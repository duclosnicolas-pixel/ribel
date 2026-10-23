# Cuisson de l'occlusion ambiante de la géométrie complète dans son propre atlas UV.
import bpy, sys, time
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
src, out, size, samples, dist = args[0], args[1], int(args[2]), int(args[3]), float(args[4])
t0 = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
print('import', round(time.time() - t0, 1), 's', flush=True)
mesh_objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
obj = mesh_objs[0]
print('objet', obj.name, len(obj.data.polygons), 'faces', 'uv', [u.name for u in obj.data.uv_layers], flush=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = samples
scene.render.threads_mode = 'FIXED'; scene.render.threads = 2
if scene.world is None:
    scene.world = bpy.data.worlds.new('World')
scene.world.light_settings.distance = dist
img = bpy.data.images.new('AO', width=size, height=size, alpha=False, float_buffer=False)
for mat in obj.data.materials:
    mat.use_nodes = True
    nt = mat.node_tree
    n = nt.nodes.new('ShaderNodeTexImage'); n.image = img; n.name = 'BAKE_TARGET'
    for x in nt.nodes: x.select = False
    n.select = True; nt.nodes.active = n
bpy.ops.object.select_all(action='DESELECT')
obj.select_set(True); bpy.context.view_layer.objects.active = obj
scene.render.bake.margin = 8
t1 = time.time()
bpy.ops.object.bake(type='AO', use_selected_to_active=False, margin=8)
print('bake', round(time.time() - t1, 1), 's', flush=True)
img.filepath_raw = out; img.file_format = 'PNG'; img.save()
print('ok', out, flush=True)
