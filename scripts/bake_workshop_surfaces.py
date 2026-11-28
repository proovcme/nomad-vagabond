"""Bake tileable painted sheet masks and fired masonry for the game (Pillow, NumPy)."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

OUT = Path(__file__).resolve().parents[1] / "assets/textures/nomad"
SIZE = 512
rng = np.random.default_rng(1936)
y, x = np.indices((SIZE, SIZE))


def cloud(cols, rows):
    # Periodic, smoothly interpolated noise, for firing marks and wash streaks.
    lattice = rng.normal(0, 1, (rows, cols))
    u, v = x * cols / SIZE, y * rows / SIZE
    i, j = u.astype(int), v.astype(int)
    u, v = u % 1, v % 1
    u, v = u*u*(3-2*u), v*v*(3-2*v)
    return ((1-u)*lattice[j, i] + u*lattice[j, (i+1)%cols])*(1-v) + (
        (1-u)*lattice[(j+1)%rows, i] + u*lattice[(j+1)%rows, (i+1)%cols])*v


def save(name, values):
    Image.fromarray(np.uint8(np.clip(values, 0, 1)*255)).save(OUT/name, quality=94)


def bake_skin():
    # R carries height, G exposed metal at joints, B panel tone and oil dragged from fasteners.
    tone = cloud(7, 6)
    sheet_y = y % 256
    sheet_x = (x + (y//256)*109) % 256
    joint = np.minimum(np.minimum(sheet_y, 256-sheet_y), np.minimum(sheet_x, 256-sheet_x))
    rim = np.exp(-((joint-3)/1.8)**2)
    pit = np.exp(-(joint/1.5)**2)
    fastener = np.exp(-((sheet_y-8)**2 + ((sheet_x+16)%32-16)**2)/6)
    dirt = np.exp(-np.maximum(0, sheet_y-8)/35) * np.exp(-(((sheet_x+16)%32-16)/3.8)**2) * (sheet_y>8)
    grain = rng.normal(0, 0.03, x.shape)
    exposed = np.clip((cloud(48, 48)+.4)*rim + fastener*.85, 0, 1)
    save("airframe-sheet.webp", np.stack([.5 + .28*rim-.45*pit+.30*fastener + grain*.4,
        exposed, .55+.12*tone+.08*cloud(3, 3)+grain-.49*pit-.24*dirt], axis=-1))


def bake_brick():
    row = y//32
    bx = (x+(row%2)*32)%64
    by = y%32
    edge = np.minimum(np.minimum(bx,64-bx), np.minimum(by,32-by)) + cloud(51, 48)*.95
    face = np.clip((edge-1)/3,0,1)
    variation = rng.uniform(-.08,.075,(16,8))[row, ((x+(row%2)*32)//64)%8]
    pores = rng.normal(0,.028, x.shape)
    shade = variation + .034*cloud(13,9) + .018*cloud(69,31) + pores
    brick = np.array([.65,.36,.235]) + shade[:,:,None]
    lime = np.array([.60,.52,.405]) + (pores*.8)[:,:,None]
    save("port-brick.webp", brick*face[:,:,None]+lime*(1-face[:,:,None]))
    relief = face*1.65+pores*2+.14*cloud(69,31)
    dx = (np.roll(relief,1,1)-np.roll(relief,-1,1))*.54
    dy = (np.roll(relief,-1,0)-np.roll(relief,1,0))*.54
    normals = np.stack([dx,dy,np.ones_like(dx)],axis=-1)
    save("port-brick-normal.webp", normals/np.linalg.norm(normals,axis=-1,keepdims=True)*.5+.5)


if __name__ == "__main__":
    bake_skin()
    bake_brick()
    # Extract local ridges from the painted bulkhead. Broad paint bands carry no relief.
    wall = Image.open(OUT/"hangar-bulkhead.webp").convert("L").resize((1024,320))
    local = (np.asarray(wall,dtype=float)-np.asarray(wall.filter(ImageFilter.GaussianBlur(3)),dtype=float))/60
    dy, dx = np.gradient(local)
    n = np.stack([-dx,dy,np.ones_like(dx)],axis=-1)
    save("hangar-bulkhead-normal.webp", n/np.linalg.norm(n,axis=-1,keepdims=True)*.5+.5)
