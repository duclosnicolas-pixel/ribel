# Ridel — référentiel projet

État au 12 octobre 2026 : arbitrages du Lot 0 rendus le 11 octobre, banc d'essai v2 publié, dépôt GitHub relié. Prochaine étape : recette du banc sur Fold 6 et Quest 2, puis lancement du Lot 1.

## Gouvernance
- MOA : Nicolas. MOE et AMOA : Claude.
- Mode agile : un lot à la fois, priorités P0 / P1 / P2, recette sur Galaxy Z Fold 6 et Meta Quest 2 à chaque lot.
- Dossier de lancement (Claude Docs) : https://claude.ai/code/artifact/bd6028bb-7f17-4f38-bf00-880b98a53949
- Banc d'essai T0, recette téléphone (artefact) : https://claude.ai/artifact/AacTS47fW1ZReaWQfswvVP
- Dépôt GitHub : https://github.com/duclosnicolas-pixel/ribel — version casque publiée par GitHub Pages à l'adresse https://duclosnicolas-pixel.github.io/ribel/

## Demande de la MOA
- Application VR pour Meta Quest 2 : basculer une cartographie réelle et exacte en simulation dans laquelle on se déplace.
- Époque figée au Moyen Âge. Géographie reprise et améliorée selon l'imaginaire de la MOA ; la carte initiale n'est qu'une base de travail.
- Déplacement et typologie de chargement inspirés de Resident Evil 4 sur Meta Quest (inspiration, pas copie).
- Recette possible depuis le Galaxy Z Fold 6 : déplacement par l'interface du téléphone.
- Aucune restriction de taille ni de poids.
- L'image du village fournie n'est qu'une ébauche.

## Décisions MOA du 11 octobre 2026
- A1 Site : château de l'Islette, 9 route de Langeais, Azay-le-Rideau (≈ 47,268 N ; 0,435 E), base de travail retenue.
- A2 Ancrage historique : vers 1500 (case cochée dans le dossier) — douves en eau, tourelles à toits coniques, village à pans de bois.
- A3 Monastère et cimetière : au sud du village, rattachés à la zone Village.
- A4 Maison futuriste (maison moderne de rêve) : jamais visible ; au fond de la forêt ; accessible uniquement par un chemin.
- A5 Forêt : décor d'horizon, non visitable (seul le chemin vers la maison futuriste la traverse).
- A6 Place du marché : ovale, étirée, superficie doublée en longueur, soit 80 m × 28 m.
- A7 Limite du monde : mur d'enceinte sur l'emprise de l'ancienne voie ferrée.
- A8 Hébergement : compte GitHub créé, dépôt « ribel » relié à Claude.
- Zones visitables : Entrée, château intérieur, château extérieur, lac, village, résidences des invités, vergers et serre exotique, maison futuriste.
- PNJ : supprimés pour l'instant ; T5 à T7 restent au plan, sans échéance.

## Registre des zones (détail dans ridel_10_zones.json)
- Visitables : Z01 Entrée · Z02 Château intérieur (rez-de-chaussée, 1er, 2e, cave, sous-sol) · Z03 Château extérieur · Z04 Lac · Z05 Village (place du marché 80 × 28 m, église Saint-Michel, monastère et cimetière au sud) · Z06 Résidences des invités · Z07 Vergers et serre exotique · Z08 Maison futuriste.
- Décors non visitables : forêt, champs, monde lointain, mur d'enceinte.

## Choix techniques (proposés par la MOE, hébergement GitHub engagé)
- Application web WebXR (Three.js) : un seul code pour le Quest 2 (mode VR) et le Fold 6 (mode tactile).
- Deux couches : monde lointain toujours chargé (relief allégé, silhouettes, ciel) et zone active chargée en détail ; transitions par portes et passages avec fondu au noir ; voyage rapide entre zones éloignées.
- Déplacement VR : stick vers l'avant = arc et marqueur, orientation choisie au stick, relâcher = téléportation ; stick latéral = rotation de 45° ; stick arrière = demi-tour.
- Déplacement téléphone : toucher le sol = téléportation, glisser = regarder, boutons de rotation et de demi-tour.
- Relief : MNT LiDAR HD de l'IGN (dalles de 1 km, pas de 50 cm, licence ouverte) ; RGE ALTI en secours ; orthophoto comme calque.
- Rendu : éclairage dynamique simple et ombres de contact précalculées (compatible T8 et T9), textures compressées, instanciation, niveaux de détail, rendu fovéal ; sols découpés en cases (un plan d'un seul tenant fausse la profondeur près de l'œil).
- Budgets de départ par œil, à confirmer au banc d'essai : 72 i/s, au plus 100 appels de rendu, au plus 300 000 triangles.
- Données projet en JSON, modèles 3D en glTF.

## Hébergement et pérennité
- Niveau 1 : artefact Claude, pour la recette téléphone ; le cadre des artefacts bloque la VR immersive.
- Niveau 2 : GitHub Pages (dépôt « ribel »), pour la VR au casque.
- Niveau 3 : PC et casque (Air Link ou Steam Link), préréglage « PC VR ».
- Niveau 4 : application native (APK) si le plafond du navigateur est atteint.
- Correctifs de sécurité du Quest 2 jusqu'en décembre 2027 ; l'appli web reste compatible Quest 3 et 3S.

## Séquencement
- T0 socle et banc d'essai → T1 place du village et téléportation minimale → T2 déplacement façon RE4 et transitions de zones → T3a cadre de chargement et maquette blanche du domaine → T4 horizon → T3b habillage zone par zone → T5 à T7 personnages (en attente) → T8 moments de la journée → T9 saisons.
- Ordre d'habillage proposé : village, château extérieur, château intérieur, lac, entrée, résidences des invités, vergers et serre exotique, maison futuriste.

## Points ouverts (non bloquants)
- Butte de liaison : à situer, ou à abandonner.
- Moulin : proposé comme partie du château extérieur.
- Champs : proposés comme décor non visitable.
- Maison futuriste : placée au fond de la forêt de l'ouest, à confirmer.

## Lot 1 (après recette du banc d'essai)
- P0 : place du marché ovale de 80 m × 28 m, pavée ; fontaine centrale ; ceinture de façades à pans de bois (commerces de l'ébauche) ; débouchés de rues fermés par un décor ; téléportation minimale et commandes téléphone ; lumière de jour fixe ; au moins 72 i/s sur Quest 2.
- P1 : repères lointains (clocher Saint-Michel, château) ; étals de marché ; ambiance sonore.

## Banc d'essai T0, version 2 (livrée le 12 octobre)
- Place ovale de 80 m × 28 m en volumes gris, fontaine animée, 37 maisons à pans de bois en encorbellement, église Saint-Michel au bout de la rue nord, cimetière clos et monastère au bout de la rue sud, château aux tourelles coniques à l'horizon.
- Aucun personnage. Mesures en direct (i/s, appels, triangles), relevé copiable, diagnostic navigateur et VR.
- Charge du décor en rendu logiciel : environ 25 appels et 24 000 triangles par vue, sous les budgets.
