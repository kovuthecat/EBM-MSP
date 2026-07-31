# 2026-07-31 — D37 · Module Veille v1 **sans compte** : profil et « pour mémoire » en `localStorage`

### Décision

La V1 du module Veille n'a **aucun compte utilisateur**, aucune authentification, aucune dépendance
Supabase. Le **profil** (profession) et la liste **« pour mémoire »** vivent en `localStorage`, dans
le navigateur du lecteur. Le §9bis RGPD du brief de veille — base légale, politique de
confidentialité, CGU, registre des traitements, durées de conservation, DPA fournisseur — est
**reporté** avec les comptes, puisqu'il n'y a plus de donnée personnelle traitée.

Cette décision **amende `BRIEF_VEILLE.md` §9**, qui portait la mention « décision validée » pour les
comptes utilisateurs légers. Le brief n'est pas réécrit ; c'est cette ligne au registre qui fait foi.

### Contexte

Le module Veille démarre avec **zéro lecteur** : la première édition n'existe pas encore, et le plan
PV1 en produit deux à la main pour éprouver le cycle de production. Le brief avait tranché les
comptes très tôt, alors que la question posée était « comment synchroniser le profil entre les
appareils d'un même professionnel » — une question qui ne se pose que s'il y a des professionnels qui
consultent depuis deux appareils, donc pas avant plusieurs mois.

Ce que les comptes coûtent aujourd'hui, en revanche, est immédiat : une dépendance backend, un
écran d'authentification, un parcours de récupération de mot de passe, et surtout **un dossier RGPD
complet à produire avant la première mise en ligne**. Un e-mail professionnel est une donnée
personnelle, même sans donnée de santé (D4).

Le service rendu par le profil et le « pour mémoire » ne dépend pas, lui, du compte : filtrer par
profession et marquer des articles fonctionne à l'identique en `localStorage`. C'est la
**persistance inter-appareils** qui disparaît, pas la fonctionnalité.

### Alternatives envisagées

- **Comptes Supabase dès la V1** (position du brief §9) — **écartée.** Elle impose le dossier RGPD
  complet et un backend avant d'avoir un seul lecteur régulier ; elle fait dépendre la mise en ligne
  d'un travail juridique dont rien ne prouve encore qu'il soit nécessaire.
- **Aucune persistance du tout** — écartée : le filtre par profession et le « pour mémoire » perdent
  l'essentiel de leur intérêt s'ils sont remis à zéro à chaque visite, pour un gain nul (le
  `localStorage` n'est pas un traitement de données personnelles au sens du RGPD dès lors que rien
  n'est transmis).

### Ce que cette décision sacrifie

À nommer sans détour, parce que c'est ce qu'on relira dans six mois :

- **La synchronisation multi-appareils disparaît.** Un praticien qui met un article « pour mémoire »
  sur l'ordinateur du cabinet ne le retrouve pas sur son téléphone. C'est le service exact que les
  comptes rendaient, et il est perdu.
- **La liste « pour mémoire » est effaçable sans prévenir** — vidage du cache, navigation privée,
  changement de navigateur. Rien ne la restaure. Il faut donc s'abstenir de la présenter comme un
  espace de sauvegarde fiable.
- **Aucune mesure d'audience réelle par profil** : on ne saura pas qui lit quoi, donc pas non plus
  quels thèmes méritent d'être étoffés. Le retour se fera à la main, par conversation.

### Conséquences

- Aucune dépendance Supabase, aucun écran d'authentification, aucun document RGPD n'est requis pour
  la mise en ligne de la V1. La décision de stack D1 (« Supabase réservé au module Veille ») reste
  vraie **en cible**, sans effet en V1.
- V3 (profil) et V4 (« pour mémoire ») sortent du plan PV1. Dans V1, le filtre par profession existe
  comme **filtre**, pas comme préférence enregistrée : même service, sans persistance serveur.
- Le jour où des lecteurs réguliers réclament la synchronisation, la décision se rouvre — et le
  dossier RGPD (§9bis) redevient un prérequis de mise en ligne, pas un rattrapage.
- **À revoir après le premier trimestre de publication réelle**, sur un signal concret : quelqu'un
  qui demande à retrouver ses articles d'un appareil à l'autre.
