# RIBEL — Consignes communes à tous les assistants de développement

Ce dépôt est un monde médiéval modulaire Three.js/WebXR. Respecter `CLAUDE.md` et `docs/WORKFLOW.md` quel que soit l'assistant utilisé.

- Source de vérité du code : dépôt GitHub, pas une description de conversation.
- Source de vérité des validations : état documenté + confirmation explicite du MOA.
- Chaque zone, bâtiment, personnage et système est un module à responsabilité unique.
- Conserver les identifiants stables et les interfaces définies dans `docs/CONTRACTS.md`.
- Ne pas modifier `index.html` sans validation ; privilégier prévisualisations isolées.
- Ne pas déplacer/supprimer les prévisualisations existantes sans maintenir leurs liens.
- Pas de duplication de renderer, de caméra, de boucle principale, de gestion du temps ou des entrées utilisateur.
- Les personnages ne sont pas codés à l'intérieur des bâtiments : références par ID et événements.
- Vérifier les références JavaScript et l'ordre d'initialisation ; un seul symbole non initialisé peut bloquer toute la scène.
- Ne jamais présenter un contrôle de syntaxe comme une recette sur appareil réel.
- Documenter chaque livraison, rollback et dette technique.

Ordre de lecture : `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/CONTRACTS.md`, `docs/WORKFLOW.md`, manifeste du module.
