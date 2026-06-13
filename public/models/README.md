# 3D room models

Drop a downloaded room model here as a single **`.glb`** file named `room.glb`:

```
public/models/room.glb
```

Then in `src/editor/EditingRoom.jsx` set:

```js
const ROOM_MODEL_URL = '/models/room.glb'
```

and tune `MODEL_SCALE` / `MODEL_POSITION` / `MODEL_ROTATION` so it fits, and move the
`<TV />` (or point the screen) to wherever the model's TV/monitor is.

## Where to get models (free, web-friendly)
- **Poly Pizza** (polypizza.org) — low-poly, CC0/CC-BY, great for web
- **Quaternius** (quaternius.com) — free low-poly packs, CC0
- **Sketchfab** — filter by "Downloadable" + a permissive license; export **glTF/GLB**
- **Kenney** (kenney.nl) — free game assets

## Keep it web-friendly
- Prefer **GLB** (single file, textures embedded)
- Low/medium poly; compress with **Draco** or **meshopt** if it's heavy
- Aim for under ~5–10 MB so the page stays fast
- Make sure the license allows use on a personal site (CC0 is safest)
