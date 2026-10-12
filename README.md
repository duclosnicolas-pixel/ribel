# Ribel

Simulation VR d'un domaine médiéval bâti sur la carte réelle du château de l'Islette (Azay-le-Rideau), pour Meta Quest 2, avec recette sur téléphone.

## Banc d'essai T0

`index.html` : place du marché ovale de 80 m × 28 m en volumes gris, fontaine centrale, maisons à pans de bois en encorbellement, cimetière clos et monastère au sud.

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

Gouvernance : maîtrise d'ouvrage Nicolas ; maîtrise d'œuvre et assistance à maîtrise d'ouvrage Claude en techlead & Chatgpt assistance AMOE + UX Designer. 

Livrable et temporalité des sujets de priorisation : 
T1 - Creation place du village, strict. Fontaine centrale. 
T2 - Deplacement façon teleportation des commandes resident evil 4. 
T3 - Separation des zones  : 
- Village articulé autour de la place centrale
- Exterieur chateau 
- Interieur chateau 
Rdv - 1er - 2eme - cave - Sous sol 
- Residences invités 
- Lac 
- Monastere-cimetière-butte de liaison
- Champs / Vergers / Verrière immense avec fruits exotiques 
- Maison moderne de reve à l’exterieur au loin 
T4 - Rendu graphique horizon des zones lointaines en regard de la direction.
T5 - Bots et personnages (quarentaines, chacun avec sa personnalite) 
T6 - Interractions avec certains personnages 
T7 - Personnages principaux : Angie, Kara, etc. 
T8 - Horaires differentiels (matin / midi / apres midi / soirée / nuit ) - Emplacement et comportement des IA differentes. 
T9 - Saisons 
