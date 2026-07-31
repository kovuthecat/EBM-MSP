# Semaines de veille — archive

Une édition par dossier, nommé **`AAAA-Www`** (semaine ISO du **lundi de publication**, cf.
`../SOP_veille.md` §3) : `2026-W30`, `2026-W31`, `2026-W32`…

```text
2026-W32/
├── moisson.md        # étape 1 — candidats bruts normalisés + sources balayées (y compris sans nouveauté)
├── screening.md      # étape 2 — le journal : une ligne par candidat, seuil §6bis, décision, route, file d'attente
└── entrees/
    └── <slug>.md     # étapes 3-6 — une entrée publiée, brève ou analyse
```

Copier les gabarits depuis **`_gabarit/`** (`_gabarit/entrees/_gabarit.md` pour une entrée). Le
dossier `_gabarit/` n'est pas une semaine : il est versionné et amendé quand la méthode change.

Le **journal de screening est publié**, au même titre que les entrées (SOP §10) — c'est lui qui rend
la semaine auditable. Les entrées sont en **markdown** tant que le schéma n'est pas gelé ; la
conversion en YAML + JSON Schema (`content/veille/`) viendra après les deux premières éditions, et
elle **est** le test du schéma.
