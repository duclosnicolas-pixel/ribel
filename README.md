# Ridel

Simulation VR d'un domaine médiéval bâti sur la carte réelle du château de l'Islette (Azay-le-Rideau), pour Meta Quest 2, avec recette sur téléphone.

## Banc d'essai T0

`index.html` : place du marché ovale de 80 m × 28 m en volumes gris, fontaine centrale, maisons à pans de bois en encorbellement, église Saint-Michel au nord, cimetière clos et monastère au sud.

Adresse publique (GitHub Pages) : https://duclosnicolas-pixel.github.io/ribel/

**Au casque (Meta Quest 2)** : ouvrir l'adresse dans le navigateur du casque, puis « Entrer en VR ».

- Stick vers l'avant : arc de téléportation ; tourner le stick : orientation à l'arrivée ; relâcher : saut.
- Stick à gauche ou à droite : rotation de 45°.
- Stick vers l'arrière : demi-tour.
- Les mesures (images par seconde, appels de rendu, triangles) s'affichent sur une montre au poignet gauche.

**Au téléphone (Galaxy Z Fold 6)** : toucher le sol pour se téléporter, glisser pour regarder, boutons de rotation et de demi-tour. Le bouton « Diagnostic » donne un relevé à copier.

## Base du projet

- `base/ridel_00_referentiel.md` : référentiel (décisions, séquencement, points ouverts).
- `base/ridel_10_zones.json` : registre des zones, que l'application lira pour savoir quoi charger.
- `base/ridel_20_lieux_personnages.json` : lieux du village et personnages.

Gouvernance : maîtrise d'ouvrage Nicolas ; maîtrise d'œuvre et assistance à maîtrise d'ouvrage Claude.
