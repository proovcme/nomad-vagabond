"""Bake a small land-use map; cliff geometry cuts the lanes and fields at the rim."""
from pathlib import Path
import math
import random
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

folder = Path(__file__).resolve().parents[1] / 'assets/textures/nomad'
size = 768
rng = random.Random(1933)
grain = Image.open(folder/'painted-meadow-v3.jpg').convert('L').resize((size,size))
art = ImageOps.colorize(grain, '#556732', '#b5aa59')
for polygon, color, spacing, tilt in [
    ([(5,60),(243,78),(214,249),(-20,213)], '#beb16a',8,.18),
    ([(258,80),(489,112),(444,271),(229,246)], '#84964c',7,.26),
    ([(511,108),(740,73),(798,232),(468,270)], '#d2a14e',7,-.10),
    ([(534,422),(800,401),(800,555),(546,602)], '#b4a45a',6,.10),
    ([(12,514),(208,541),(171,780),(-30,780)], '#9b9150',9,-.17),
    ([(225,548),(394,567),(364,790),(188,790)], '#c4a061',8,-.13),
]:
    mask = Image.new('L',(size,size))
    ImageDraw.Draw(mask).polygon(polygon,fill=215)
    crop = Image.new('RGB',art.size,color)
    brush = ImageDraw.Draw(crop,'RGBA')
    for x in range(-size,size*2,spacing):
        brush.line((x,0,x+size*tilt,size),fill=(84,71,41,65),width=2)
    art.paste(crop,(0,0),mask.filter(ImageFilter.GaussianBlur(1.3)))
    hedge = ImageDraw.Draw(art,'RGBA')
    for start,end in zip(polygon,polygon[1:]+polygon[:1]):
        length = math.dist(start,end)
        for i in range(0,int(length),5):
            t=i/length
            x=start[0]+(end[0]-start[0])*t
            y=start[1]+(end[1]-start[1])*t+rng.uniform(-1.5,1.5)
            r=rng.uniform(1.6,3)
            hedge.ellipse((x-r,y-r,x+r,y+r),fill=(66,86,43,182))
brush = ImageDraw.Draw(art)
lane = [(x, int(367+61*math.sin(x/146)+x*.07)) for x in range(-8,785,4)]
brush.line(lane,fill='#89734c',width=10)
brush.line(lane,fill='#d6bc86',width=6)
relief = ImageEnhance.Contrast(grain).enhance(.65)
art = Image.blend(art, ImageOps.colorize(relief,'#586233','#d0bd78'),.12)
art.save(folder/'headland-farmland.webp',quality=84,method=6)
