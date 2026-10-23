# Cuisson des reliefs de la géométrie complète (normales, carte de Meshy comprise) sur une version allégée,
# puis export de la version allégée avec ses tangentes MikkTSpace (mêmes tangentes qu'à la cuisson).
import bpy, sys, time
args = sys.argv[sys.argv.index('--') + 1:]
high_path, low_path, out_png, out_glb, size, samples, extrusion, maxdist = args[0], args[1], args[2], args[3], int(args[4]), int(args[5]), float(args[6]), float(args[7])
t0 = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=high_path)
high = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]; high.name = 'HIGH'
bpy.ops.import_scene.gltf(filepath=low_path)
low = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o.name != 'HIGH'][0]; low.name = 'LOW'
print('import', round(time.time() - t0, 1), 's', len(high.data.polygons), '→', len(low.data.polygons), flush=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'; scene.cycles.device = 'CPU'; scene.cycles.samples = samples
scene.render.threads_mode = 'FIXED'; scene.render.threads = 2
img = bpy.data.images.new('NORMAL_BAKE', width=size, height=size, alpha=False, float_buffer=False)
img.colorspace_settings.name = 'Non-Color'
# Matériau propre à la version allégée, avec la cible de cuisson active.
mat = bpy.data.materials.new('LOW_BAKE'); mat.use_nodes = True
n = mat.node_tree.nodes.new('ShaderNodeTexImage'); n.image = img
for x in mat.node_tree.nodes: x.select = False
n.select = True; mat.node_tree.nodes.active = n
low.data.materials.clear(); low.data.materials.append(mat)
bpy.ops.object.select_all(action='DESELECT')
high.select_set(True); low.select_set(True); bpy.context.view_layer.objects.active = low
bk = scene.render.bake
bk.use_selected_to_active = True; bk.cage_extrusion = extrusion; bk.max_ray_distance = maxdist; bk.margin = 8
bk.normal_space = 'TANGENT'; bk.normal_r = 'POS_X'; bk.normal_g = 'POS_Y'; bk.normal_b = 'POS_Z'
t1 = time.time()
bpy.ops.object.bake(type='NORMAL', use_selected_to_active=True, cage_extrusion=extrusion, max_ray_distance=maxdist, margin=8, normal_space='TANGENT')
print('bake', round(time.time() - t1, 1), 's', flush=True)
img.filepath_raw = out_png; img.file_format = 'PNG'; img.save()
# Export de la version allégée seule, sans matériau (les textures sont partagées côté moteur), avec tangentes.
bpy.ops.object.select_all(action='DESELECT'); low.select_set(True); bpy.context.view_layer.objects.active = low
low.data.materials.clear()
bpy.ops.export_scene.gltf(filepath=out_glb, export_format='GLB', use_selection=True, export_tangents=True,
                          export_normals=True, export_texcoords=True, export_materials='NONE', export_yup=True)
print('ok', out_png, out_glb, flush=True)
