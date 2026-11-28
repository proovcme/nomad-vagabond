"""Bake tileable painted sheet masks and fired masonry for the game (Pillow, NumPy)."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

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
    panel_tone = np.array([[.08,-.07],[-.03,.065]])[y//256, ((x+(y//256)*109)//256)%2]
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
        exposed, .55+panel_tone+.16*tone+.07*cloud(3, 3)+grain-.49*pit-.24*dirt], axis=-1))


def bake_brick():
    row = y//32
    bx = (x+(row%2)*32)%64
    by = y%32
    edge = np.minimum(np.minimum(bx,64-bx), np.minimum(by,32-by)) + cloud(51, 48)*.95
    face = np.clip((edge-1)/3,0,1)
    variation = rng.uniform(-.08,.075,(16,8))[row, ((x+(row%2)*32)//64)%8]
    pores = rng.normal(0,.028, x.shape)
    shade = variation + .034*cloud(13,9) + .018*cloud(69,31) + pores
    brick = np.array([.72,.415,.255]) + shade[:,:,None]
    lime = np.array([.69,.61,.48]) + (pores*.8)[:,:,None]
    save("port-brick.webp", brick*face[:,:,None]+lime*(1-face[:,:,None]))
    relief = face*1.65+pores*2+.14*cloud(69,31)
    dx = (np.roll(relief,1,1)-np.roll(relief,-1,1))*.54
    dy = (np.roll(relief,-1,0)-np.roll(relief,1,0))*.54
    normals = np.stack([dx,dy,np.ones_like(dx)],axis=-1)
    save("port-brick-normal.webp", normals/np.linalg.norm(normals,axis=-1,keepdims=True)*.5+.5)


def bake_bulkhead():
    # Paint and relief are separate masters. Unit markings are flush-painted on the sheets.
    width, height = 3072, 960
    canvas = Image.new("RGB", (width, height))
    relief = Image.new("L", canvas.size, 128)
    d, h = ImageDraw.Draw(canvas), ImageDraw.Draw(relief)
    paint = np.random.default_rng(1940)
    for k in range(12):
        left = k*256
        tone = int(paint.integers(-10, 11))
        for top, bottom, rgb in [(0,388,(232,201,143)), (389,821,(42,139,143)), (822,959,(38,68,73))]:
            d.rectangle((left,top,left+255,bottom),fill=tuple(c+tone for c in rgb))
        # Caulked lap, narrow light-catching lip, staggered heads in each upright.
        d.rectangle((left,0,left+4,height),fill=(42,54,54))
        d.line((left+5,0,left+5,height),fill=(164,169,147),width=2)
        h.rectangle((left,0,left+3,height),fill=65)
        h.line((left+5,0,left+5,height),fill=169,width=2)
        for yy in range(20,950,48):
            xx=left+14
            d.ellipse((xx-4,yy-3,xx+5,yy+6), fill=(65,65,55))
            d.ellipse((xx-3,yy-4,xx+3,yy+2), fill=(167,157,121))
            d.line((xx-2,yy-3,xx+1,yy-3),fill=(229,207,153),width=1)
            h.ellipse((xx-4,yy-4,xx+4,yy+4),fill=192)
        # Fine broken scratches follow maintenance traffic at waist height.
        for _ in range(48):
            xx=left+int(paint.integers(18,247)); yy=int(paint.integers(470,950))
            length=int(paint.integers(2,14))
            d.line((xx,yy,xx+length,yy+int(paint.integers(-2,3))), fill=(106,124,112))
    for yy, depth, color in [(355,21,'#ab472d'),(379,8,'#f5bb56'),(390,5,'#255457'),(814,8,'#d49449')]:
        d.rectangle((0,yy,width,yy+depth),fill=color)
    # Two inspection covers, individually repaired and marked with a port-service wing.
    for cx,cy in [(670,610),(2250,589)]:
        d.rounded_rectangle((cx-157,cy-65,cx+158,cy+73),10,fill='#24464b')
        d.rounded_rectangle((cx-157,cy-70,cx+155,cy+66),9,fill='#327679',outline='#b3b395',width=3)
        h.rounded_rectangle((cx-157,cy-70,cx+155,cy+66),9,fill=168)
        for sign in [-1,1]:
            for step in range(3):
                a=24+step*7; b=105-step*17; yy=cy-23+step*12
                d.polygon([(cx+sign*a,yy),(cx+sign*b,yy-7),(cx+sign*(b-12),yy+3),(cx+sign*a,yy+9)], fill='#f5d499')
        d.ellipse((cx-21,cy-27,cx+21,cy+15),outline='#ebc77e',width=4)
        d.polygon([(cx,cy-39),(cx+6,cy-12),(cx+21,cy-6),(cx+5,cy),(cx,cy+27),(cx-5,cy),(cx-20,cy-6),(cx-6,cy-12)],fill='#f4d8a2')
        for dx in [-144,143]:
            for dy in [-56,52]:
                d.ellipse((cx+dx-4,cy+dy-4,cx+dx+4,cy+dy+4),fill='#d5b887')
    # Rolled sheet picks up shallow horizontal tool marks; grain stays below the paint.
    rgb=np.asarray(canvas,dtype=np.float32)
    grain=paint.normal(0,2.8,(height,width,1))+paint.normal(0,1.4,(height,1,1))
    Image.fromarray(np.uint8(np.clip(rgb+grain,0,255))).save(OUT/'hangar-bulkhead.webp',quality=95)
    dy,dx=np.gradient(np.asarray(relief,dtype=float)/55)
    normals=np.stack([-dx,dy,np.ones_like(dx)],axis=-1)
    save('hangar-bulkhead-normal.webp',normals/np.linalg.norm(normals,axis=-1,keepdims=True)*.5+.5)


if __name__ == "__main__":
    bake_skin()
    bake_brick()
    bake_bulkhead()
