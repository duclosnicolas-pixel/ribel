# RIBEL — Architecture cible et direction artistique du village
Statut : direction artistique et lancement validés par la MOA le 13 octobre 2026 ; revue technique MOE à conduire avant fusion. **Aucune validation T1/T4 n'est révoquée.** Périmètre de production actuel : **village uniquement**.

## Décisions et contraintes
- MOA : Nicolas ; MOE, AMOA, Tech Lead : Claude ; ChatGPT : assistance AMOE et UX.
- T1 (place du village) et T4 (horizon) validés par la MOA. La géométrie du banc d'essai reste un jalon fonctionnel, **pas** une validation esthétique.
- T3 en démarrage : pas de domaine multi-zones déjà fonctionnel. Maintenir la compatibilité **GitHub Pages HTTPS**, navigateur Meta Quest 2 et Galaxy Z Fold 6.
- La carte aérienne annotée fournie le 13/10/2026 est une **intention de zonage**, non une emprise géoréférencée mesurée. Rouge = limite globale approximative ; bleu = secteurs indicatifs. Ne pas déduire des coordonnées exactes des tracés à main levée.
- Conserver la place **ovale 80 m × 28 m**, la fontaine centrale et **deux axes traversants orthogonaux** (nord–sud et est–ouest). Au sud : **nouvelle zone Paroisse / Cimetière / Cloître** séparée du village. Au nord : **écuries**, accès au château ; depuis la zone château, accès vers la sortie du domaine et les remparts. À l'est : **grenier à blé** (correction et validation MOA du 13 octobre 2026).
- Ne pas modifier silencieusement les décisions A4 (maison futuriste invisible depuis le domaine) et A5 (forêt non visitable hors chemin dédié).
- Référence historique : France rurale, Val de Loire, fin XVe – début XVIe siècle. Architecture **plausible**, non reconstruction archéologique attestée. Toute affirmation de fidélité au site réel nécessite une source.

## Choix de plateforme — décision recommandée
**Three.js + WebXR + assets glTF/GLB + GitHub Pages**, architecture modulaire. GitHub Pages distribue des fichiers statiques ; il n'exécute ni application native Unreal ni APK Unity. Unity WebGL n'est pas une solution VR immersive navigateur garantie pour Quest 2. Préserver l'option migration vers application native si une recette sur casque révèle un plafond graphique inacceptable. La qualité finale dépend d'abord des modèles, textures, lumières et budgets GPU.

## Organisation du code cible
```
index.html                 # coquille et interface, conserve l'URL Pages
src/main.js                # initialisation, boucle, erreurs
src/core/renderer.js       # WebGL/WebXR, profil Quest2 / Fold6
src/core/world.js          # monde commun, temps, caméra
src/navigation/teleport.js # contrôles existants, tests de non-régression
src/zones/registry.js      # lecture et validation du manifeste
src/zones/manager.js       # états idle/loading/active/unloading, annulation
src/zones/portals.js       # transitions et orientation à l'arrivée
src/scene/village.js       # place, bâtiments, rues, écuries, grenier
src/scene/distant.js       # silhouettes et horizon T4 conservés
src/ui/diagnostics.js      # relevé, appareil, fps, appels, triangles
public/assets/village/    # modèles GLB, textures compressées, atlas
public/assets/shared/     # matériaux et accessoires mutualisés
base/                     # décisions et données sources
tests/                    # tests de logique et recettes
```
Ce plan décrit une **cible**, non des fichiers déjà présents. Ne pas remplacer `index.html` avant parité des déplacements et de la recette.

## Chargement des zones — contrat
1. Toujours présents : caméra/joueur, ciel, horizon simplifié T4, lumière globale, interface, marqueurs de zones, système de déplacement.
2. Zone active : modèles détaillés, collisions, sons, éclairages locaux, animations ; une seule zone détaillée en mémoire par défaut.
3. Transition : préchargement de la destination, verrouillage bref de la téléportation, fondu, transfert de position/orientation, activation de la nouvelle zone, libération de l'ancienne ; rollback en cas d'échec.
4. Portails nord Village → Château extérieur (zone future) ; sud Village → Paroisse/Cimetière/Cloître (zone nouvelle, future) ; est/ouest vers extensions futures **sans fausse sortie praticable**.
5. Gestion des ressources : références partagées pour textures/géométries, destruction contrôlée, absence de fuites après dix allers-retours.
6. Ne jamais charger un niveau intérieur du château pendant la visite du village ; les silhouettes lointaines ne sont pas des intérieurs détaillés.

## Plan spatial village — proposition UX
- Repère local : centre de la fontaine (0,0), axe horizontal est–ouest ; axe vertical nord–sud ; dimensions de la place 80 m (est–ouest) × 28 m (nord–sud), sous réserve de validation de l'orientation cartographique.
- Fontaine centrale avec dégagement circulaire et espace de marché.
- Axe nord : rue lisible vers le château, écuries avant la transition. Prévoir visibilité du repère château sans charger le château détaillé.
- Axe sud : perspective vers l'ensemble paroissial ; portail clairement identifiable avant chargement de la zone distincte.
- Axe est : grenier à blé monumental mais crédible, lié au marché et aux charrettes.
- Axe ouest : commerces et ruelle de service, sans ajout de nouvelle zone non validée.
- Façades irrégulières mais continuité urbaine ; éviter la répétition identique des maisons. Prévoir circulation piétonne praticable et seuils sans collisions incohérentes.

## Bible artistique — bâti 1450–1550, Val de Loire
- Maisons de marchands : rez-de-chaussée en moellons/enduit à la chaux ; étages à pans de bois avec hourdis enduits ; encorbellements mesurés, pas systématiques ; soubassements et seuils en pierre ; toitures à forte pente en ardoise ou tuile selon bâtiment et statut.
- Variations cohérentes : pignons ou égouts sur rue, travées asymétriques, cheminées maçonnées, lucarnes ponctuelles, volets bois, ferronneries discrètes, vitrages petits carreaux réservés aux bâtiments aisés ; ouvertures plus simples ailleurs.
- Fontaine : pierre usée, traces d'humidité, écoulement plausible ; éviter l'effet plastique et les particules excessives.
- Place : pavage hétérogène, caniveaux, ornières localisées, boue et gravier aux marges ; mobilier utilitaire (étals, tonneaux, cordages, paniers) seulement après validation des volumes principaux.
- Écuries nord : bâtiment utilitaire, larges portes, ventilation, cour de service, abreuvoir ; ne pas obstruer le passage château.
- Grenier à blé ouest : volume de stockage ventilé, charpente, accès charrettes, toiture protectrice ; éviter une esthétique de château fort miniature.
- Ensemble sud **hors zone Village** : église paroissiale, cimetière clos, cloître/monastère, avec identité architecturale distincte et seuil de transition.
- Palette : enduits crème/grège/ocre, bois patiné brun-gris, pierre calcaire locale, ardoise bleu-gris, terre humide et végétation modérée. Usure crédible, pas de délabrement uniforme.
- Interdits visuels : toits parfaitement clonés, bois uniformément noir, textures « cartoon », vitres panoramiques modernes, poutres décoratives sans logique structurelle, surfaces impeccablement répétitives.
- Créer 4–6 **familles modulaires** de façades/toitures avec variantes et accessoires, puis composer une trentaine de bâtiments distincts sans trente matériaux uniques.

## Pipeline de qualité
1. **Références sourcées** : photos et plans d'architecture tourangelle XVe–XVIe, distinguer reconstitutions et bâtiments remaniés ; vérifier licences.
2. **Greybox** : conserver volumes/axes/portails, valider vues depuis les quatre accès et la fontaine.
3. **Un bâtiment témoin** : façade complète, toit, pierre, bois, huisseries, UV, collision, LOD, GLB. Approbation visuelle MOA avant duplication.
4. **Kit modulaire** : plusieurs typologies, atlases de matériaux PBR, détails de proximité et silhouettes à distance.
5. **Éclairage** : ciel et soleil, ombres sélectionnées, éclairage précalculé quand possible ; éviter de multiplier les ombres temps réel.
6. **Optimisation** : glTF/GLB, KTX2/Basis pour textures si support confirmé, compression géométrique si pertinente, instanciation d'éléments répétés, LOD, culling, plafonds de résolution.
7. **Recette** : Quest 2 prioritaire ; Z Fold 6 en contrôle tactile ; vérifier l'apparence en mouvement, pas seulement sur capture fixe.

## Critères de recette de la première tranche
- T1/T4 restent conformes fonctionnellement : place ovale, fontaine, horizon, navigation tactile et VR sans régression.
- Axes nord/sud et est/ouest immédiatement lisibles ; écuries au nord, grenier à blé à l'est ; zone sud identifiée mais pas chargée en détail.
- Une **maison témoin 1450–1550** validée visuellement par Nicolas (matières, proportions, ouvertures, toiture, vieillissement).
- Téléportation interdite dans la fontaine, murs, bâtiments et hors passages autorisés ; orientation préservée aux transitions.
- Pas de saccade majeure ou crash au chargement ; mesure des fps sur Quest 2 après stabilisation. Cible initiale 72 i/s à confirmer par appareil et scène, non promesse de résultat.
- Relevé de recette : appareil, navigateur, version/commit, fps moyen et bas, appels, triangles, problèmes reproductibles.
- Revenir à `main` doit restaurer le banc d'essai validé.

## Découpage de livraison recommandé
**R0 (ce document)** : décision d'architecture, plan et bible artistique ; aucune altération du site public.
**R1** : modulariser sans changer le rendu ni les commandes, tests de parité.
**R2** : intégrer bâtiment témoin haute qualité et matériaux ; validation MOA.
**R3** : reconstruire progressivement la place et ses abords, écuries et grenier à l'est ; maintenir T1/T4.
**R4** : gestionnaire de zones + portail nord/sud avec scènes de substitution ; la zone Paroisse et le château détaillés restent des lots ultérieurs.
**R5** : optimisation Quest 2, tests Fold 6, recette et publication.

## Points à arbitrer par Nicolas
1. Confirmer que la longueur 80 m de la place correspond bien à l'axe est–ouest de la carte de conception.
2. Confirmer l'architecture souhaitée pour la paroisse : église et cloître attenants ou séparés.
3. Fournir éventuellement des photos de bâtiments ou un niveau de réalisme de référence. Sans cela, privilégier une restitution ligérienne plausible et documentée.

## Feu vert MOA — 13 octobre 2026
- Visuels de référence et direction artistique validés ; démarrage des travaux autorisé.
- Correction d'implantation : **grenier à blé à l'EST**, et non à l'ouest. Les écuries restent au nord.
- T1 et T4 restent validés ; les autres tâches sont autorisées à avancer, mais non réputées réceptionnées.
