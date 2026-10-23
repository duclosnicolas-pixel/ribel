# RIBEL — Maquette du village, traduction 3D et VR (recette MOA)

**Décision artistique MOA : 2026-10-19.** La maquette aérienne annotée et sa correction (accès au château par un chemin extérieur arrondi à l'est des écuries) sont approuvées. Ce document fixe les exigences de géométrie du village Z05 et son stade d'avancement.

## Prévisualisation exécutable
- [Village 3D/VR, maquette V1](../../ribel-village-maquette-v1.html) — véritable Three.js avec WebXR, caméra au sol et caméra aérienne, captures PNG, déplacements et téléportation.
- Basé sur `ribel-vue-aerienne.html` ; **`index.html` de production inchangé**.
- Les écuries visibles sont le **vrai module V53** importé depuis `zones/05-village/01-ecuries/index.js`. Aucun changement à `ecuries-v53.html`, `v53-geometry.js` ou l'ancrage (x=0,z=-72).

## Implantation de recette
- Repère : x positif = est, z positif = sud, y = altitude, en mètres.
- Centre du village déplacé au z=22, pour ménager l'espace devant les écuries au nord.
- Place ovale nord-sud autour de la fontaine ; dimensions de recette : rayons ~19 m est-ouest et ~29 m nord-sud.
- Deux couronnes concentriques d'habitations à pans de bois (rayons d'implantation intérieur ~24 × 35 m, extérieur ~40 × 48 m), avec rue annulaire entre les deux et quatre ouvertures sur les points cardinaux.
- Cinq commerces repérés dans la couronne intérieure : boulanger et armurier côté ouest ; taverne, auberge, forge côté est. Bâtiments en 3D avec enseignes et auvents.
- Nord : arrivée depuis la rue du village au **portail sud des écuries**. La route **du château bifurque au sud-est de celles-ci, longe l'extérieur oriental de l'enceinte en courbe**, et repart vers le nord ; jamais à travers la cour ou les boxes.
- Est : route vers la zone distincte des greniers, serres et vergers. Ouest : route vers la forêt. Sud : rue vers la zone paroissiale.
- Rendu : maillages et éléments instanciés, matériaux de la scène existante, aucun second renderer ni seconde boucle d'animation.

## Auberge du Foyer d'Or (2026-10-23)
- Sur demande du MOA, le modèle Meshy de l'auberge/taverne remplace les trois maisons de la couronne intérieure au nord-est de la place (rond rose de la capture du MOA). Module `zones/05-village/02-taverne/`, chargé par la maquette ; ancrage x 19,48, z −0,19, rotation −0,72.
- Portes non ouvrables ; circulation entre les bancs, sous les arcades et l'encorbellement ; rue circulaire ≥ 3,5 m ; couronne extérieure intacte. Enseignes « Taverne » et « Auberge » retirées des maisons génériques.
- Détails : `zones/05-village/02-taverne/README.md`.

## Frontières de responsabilité
Les chantiers extérieurs **ne font pas partie de la présente modification du village Z05** : forêt et route forestière à prolonger, zone Z07 (verger, greniers, serres), paroisse (cimetières et cloître), château Z02/Z03 et route après sortie du périmètre village. Les éléments existants de décor au sud sont conservés provisoirement, pas validés comme modèles définitifs de la paroisse.

## Contrôles et intégration
- Code JavaScript de la page de prévisualisation vérifié syntaxiquement par l'AMOE et commit effectué ; **aucune recette réelle Galaxy Z Fold 6 ou casque n'a été réalisée**.
- Les emplacements et dimensions de l'interprétation 3D sont **proposés à recette**, ils ne constituent pas une nouvelle validation de coordonnées par le MOA ; seule la maquette aérienne de référence est approuvée à ce jour.
- Au retour de recette : corriger la prévisualisation, puis transmettre à Claude (MOE) pour intégration au moteur partagé et au `index.html` **seulement après autorisation MOA**.
- Ne pas utiliser `ribel-ecuries-nord-v2.html` (obsolète, église du nord supprimée). Continuer les modifications géométriques propres aux écuries en page autonome, selon leur README.
