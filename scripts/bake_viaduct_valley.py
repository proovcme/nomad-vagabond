"""Draw the cadastral parcels and road in the valley's pre-fracture coordinates."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
root = Path(__file__).resolve().parents[1] / 'assets/textures/nomad'
size = (1080, 504)
grain = Image.open(root / 'painted-meadow-v3.jpg').convert('L').resize(size)
atlas = ImageOps.colorize(grain, '#677748', '#96a357')
draw = ImageDraw.Draw(atlas)
def point(x, z):
    return (round((x + 68)*6), round((42-z)*6))
for x in range(-68, 112, 18):
    for z in [-42, 4, 22]:
        # The upper village occupies meadow and orchards; the farm has long arable strips.
        if (x < 4 and z < 20) or (x == 4 and z < 0):
            continue
        ends = z+ (37 if z==-42 else 16)
        ink = ['#aeb160','#d5ab60','#97a264','#bc9b5b'][(x//18+z)%4]
        draw.polygon([point(x,z),point(x+16,z),point(x+18,ends),point(x+2,ends)], fill=ink)
        for n in range(2,16,2):
            draw.line([point(x+n,z),point(x+n+2,ends)], fill='#b7a56b', width=2)
# A lane follows the crest, with small gravel courts under the houses.
lane=[(-46,-14),(-33,-12),(-26,-7),(-19,2),(-13,9),(0,11),(17,10),(25,4)]
draw.line([point(x,z) for x,z in lane],fill='#cbb889',width=9,joint='curve')
for x,z in [(-25,-7),(-12,-9),(12,-9),(-21,11),(-11,13),(0,11),(11,10),(20,12)]:
    draw.ellipse([point(x-5,z+4),point(x+5,z-4)], fill='#bcaf88')
road = [(-68,-14),(-40,-9),(-25,-2),(-11,1),(7,3),(24,0),(62,0),(83,-7),(112,-10)]
for color,width in [('#746947',20),('#e5cc98',14)]:
    draw.line([point(x,z) for x,z in road],fill=color,width=width,joint='curve')
atlas=Image.blend(atlas,ImageOps.colorize(grain,'#6b683b','#e6ca8a'),.13)
atlas.save(root/'viaduct-valley.webp', quality=90)

# Broken vertical joints and broad brush marks for metre-scale cliff faces.
import random
rng = random.Random(1932)
def noise(width, height):
    im=Image.new('L',(width,height))
    im.putdata([rng.randint(68,235) for _ in range(width*height)])
    return im.resize((512,512),Image.Resampling.BICUBIC)
grain=Image.blend(noise(11,6),noise(44,16),.35)
grain=Image.blend(grain,noise(170,120),.14)
stone=ImageOps.colorize(grain,'#a38775','#fff7db')
draw=ImageDraw.Draw(stone,'RGBA')
for _ in range(55):
    x,y=rng.randrange(512),rng.randrange(-75,505)
    length=rng.randrange(8,110)
    nodes=[(x,y),(x+3,y+length*.32),(x-5,y+length*.51),(x-8,y+length)]
    draw.line(nodes,fill=(72,53,46,rng.randrange(35,105)),width=rng.randrange(1,4))
    draw.line([(a+2,b) for a,b in nodes],fill=(255,230,190,75),width=1)
stone.save(root/'viaduct-rock.webp',quality=89)
