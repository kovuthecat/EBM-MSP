# OUTIL-INTERFACE-OE.md — interroger OpenEvidence en ligne de commande

> **Interface-OE** est une application Electron séparée (dépôt racine de `<CLI>`, § Prérequis
> ci-dessous) qui tient une session OpenEvidence derrière un routage hors UE cloisonné, et expose un
> CLI. Ce fichier est son mode d'emploi **côté ebm-msp** : ce qu'on peut faire, à quel prix, et ce
> qu'on ne fait pas.
>
> **Autorité des règles d'usage d'OE : `<Interface-OE>/CLAUDE.md`** (rythme humain, jamais l'API
> interne, arrêt sur défi anti-robot). En cas de divergence, c'est lui qui gagne, pas ce fichier.

## Ce que ça change, et ce que ça ne change pas

**Change :** le prompt OE généré par le circuit de preuve n'a plus besoin d'être collé à la main
par le référent. Claude peut poser la question lui-même et récupérer la réponse **en markdown,
directement dans ce dépôt**.

**Ne change pas :** OpenEvidence reste du **débroussaillage**, jamais une référence en soi
(`docs/veille/SOP_veille.md` §4, `docs/decision/00-global.md` §2, invariant 6 de `CLAUDE.md`).
Toute affirmation, tout chiffre repassent par la source primaire avant classement. Le red-team
(Agent B) attaque le retour OE comme avant — un retour obtenu par CLI n'est pas plus fiable qu'un
retour collé à la main.

## Prérequis

- **`<CLI>` = `C:\Users\Kovu\Projets\Interface-OE\out\cli\index.js`** (constaté le 2026-09-24 sur ce
  poste). Ce chemin ne s'écrit **qu'à cet endroit** du dépôt ; tout le reste y renvoie sous le nom
  `<CLI>`. Changement de poste → une seule ligne à corriger, ici.
- **Avant tout appel, vérifier que `<CLI>` existe** (`Test-Path <CLI>` ou `[ -f "<CLI>" ]`). Absent :
  le dire explicitement — « CLI Interface-OE introuvable à `<CLI>` : vérifier le chemin sur ce
  poste » — et s'arrêter là, **jamais** parler de « réponse incomplète » : un `node` sur un chemin
  mort sort au même code 1 qu'une vraie réponse OE tronquée, et rien d'autre que ce contrôle
  préalable ne distingue les deux cas.
- L'application résidente **lancée** : le CLI la démarre au besoin (sauf `--no-launch`).
- Le **routage hors UE actif** et la **session OE connectée** — la connexion se fait à la main
  dans la fenêtre de l'application. Le CLI ne se connecte jamais, ne saisit jamais d'identifiant.
- `<CLI>` présent mais daté → `npm run build:cli` dans Interface-OE.

## La commande

```bash
node "<CLI>" demander "<question>" --output docs/decision/validation/<chantier>/OE-<sujet>.md --modele <osler|sackett|snow> --json
```

Le binaire `interface-oe` n'est **pas** sur le `PATH` : appeler `node` + le chemin absolu (`<CLI>`).

| Option | Effet |
|---|---|
| `--output <chemin>` | Écrit une **copie markdown autonome** de la réponse. Chemin relatif = relatif au répertoire courant, donc à ce dépôt. **Refuse d'écraser** un fichier existant. |
| `--conversation <id>` | Relance dans une conversation OE existante (question de suivi) au lieu d'en ouvrir une neuve. |
| `--modele <osler\|sackett\|snow>` | Sélectionne le modèle OpenEvidence avant de poser. Absent = modèle du compte, sélecteur non touché. Valeur absente ou inconnue → code 2, aucune requête consommée ; demandé mais introuvable sur la page réelle → code 1, sans question consommée non plus. La copie `--output` écrit `- Modèle : <nom>` (ou `inconnu`) en tête : comparer à la demande avant d'exploiter la réponse. |
| `--json` | Sortie machine : `{ok, etat, conversation, sortie}`. |
| `--no-launch` | Interdit de démarrer l'application ; échoue tout de suite si elle ne répond pas. |

**Codes de sortie** — les lire, ils portent le sens :

| Code | Signification | Conduite |
|---|---|---|
| `0` | Réponse complète, archivée | Continuer |
| `1` | Réponse **incomplète**, erreur d'écriture — **ou `<CLI>` introuvable** | Le markdown dit ce qui manque en tête quand la commande a pu tourner ; si le contrôle d'existence de `<CLI>` (§ Prérequis) n'a pas été fait avant l'appel, le faire avant de conclure à une réponse tronquée |
| `2` | Arguments invalides | Corriger l'appel (aucune requête OE consommée) |
| `3` | **Défi anti-robot** | **STOP.** On ne réessaie pas, on ne reformule pas, on ne relance pas plus tard de sa propre initiative : on rend la main à Thibault |
| `4` | Application injoignable | Le dire, ne pas insister |

## Ce qu'on récupère

- **La copie `--output`** : markdown autonome — titre = la question, lien de la conversation, date,
  corps de la réponse, section `## Références`. Une extraction incomplète est signalée **en tête**
  (`⚠️ Extraction …`).
- **L'archive de référence**, écrite par l'application et par elle seule :
  `%APPDATA%\interface-oe\conversations\<date-heure-slug>\` avec `conversation.md`, `images/`,
  `meta.json`.
- **Les figures** : dans la copie `--output`, elles sont référencées en chemin **relatif**
  (`images/…`) et ne s'affichent donc pas depuis ce dépôt. Les fichiers sont dans le dossier
  d'archive ci-dessus. Si une figure compte pour la preuve, la lire là-bas ou la copier à la main.

## Le coût, et la règle de politesse

- **Une question = une vraie requête OE** sur le compte personnel de Thibault, avec un risque de
  compte (CGU assumées, DataDome déjà déclenché une fois). Le budget de requêtes est le sien.
- **Demander avant de poser** : annoncer les questions prévues et leur nombre, attendre l'accord.
  Jamais de rafale décidée seul.
- **Jamais de parallélisme.** L'application sérialise tout et impose un délai aléatoire de
  **20 à 60 s après la fin** de chaque requête : un appel peut donc attendre plusieurs minutes
  avant même de partir (la position dans la file s'affiche). Ce n'est pas un blocage — ne pas
  couper, ne pas mettre de timeout court, ne pas lancer plusieurs CLI en même temps.
- **Grouper** les sous-questions dans un seul prompt plutôt que multiplier les appels : c'est
  d'ailleurs déjà la discipline du gabarit de prompt (sous-questions nommées une par une).
- **Aucune donnée personnelle de patient** dans une question. Contexte clinique uniquement.

## Où ça s'insère dans les circuits du projet

- `recherche-preuve-triangulee` (module Décision, étape P4) : le prompt OE généré en fin de
  rapport d'Agent A peut être **posé par le CLI**, sortie dans
  `docs/decision/validation/<chantier>/OE-<sujet>.md`, puis attaqué par Agent B avec le rapport
  d'Agent A — circuit inchangé pour le reste.
- `verif-source-veille` / `recherche-source-primaire` : OE devient une voie de repérage de plus,
  au même statut que Consensus ou SciSpace — **jamais** une source citable.
- Marche à suivre complète (accord préalable, gabarit de prompt, qualification du retour) :
  `.claude/skills/recherche-source-primaire/references/openevidence.md`.
