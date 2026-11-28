"""Paint the port workshops' wired glazing and vitreous-enamel trade sign."""
from pathlib import Path
import math
import random
from PIL import Image, ImageDraw, ImageFont

out = Path(__file__).resolve().parents[1] / "assets/textures/nomad"
rng = random.Random(1934)
im = Image.new("RGB", (512, 768))
d = ImageDraw.Draw(im)
for y in range(768):
    t = y/768
    d.line((0,y,512,y),fill=(int(116-49*t),int(162-62*t),int(164-71*t)))
# Silhouettes seen through factory glass. Shafts, overhead truss, belt wheels.
for x in range(-90,650,120):
    d.line((x,104,x+120,180,x+120,103),fill='#5a7474',width=8)
for x,y,r in [(100,510,91),(392,579,65)]:
    d.ellipse((x-r,y-r,x+r,y+r),outline='#586159',width=12)
    for a in range(0,360,60):
        d.line((x,y,x+r*math.cos(math.radians(a)),y+r*math.sin(math.radians(a))),fill='#586159',width=7)
d.rectangle((0,655,512,768),fill='#6e7366')
glaze = Image.new("RGBA",im.size)
g = ImageDraw.Draw(glaze)
for col in range(6):
    for row in range(8):
        x,y=col*86,row*96
        g.rectangle((x+4,y+4,x+82,y+91),fill=rng.choice([(250,198,112,70),(42,89,94,57),(202,224,206,58),(244,213,146,115)]))
        g.line((x+5,y+5,x+80,y+5), fill=(242,228,197,130),width=2)
for x in range(-768,512,84):
    g.line((x,0,x+768,768),fill=(227,229,198,32),width=14)
im=Image.alpha_composite(im.convert("RGBA"),glaze);d=ImageDraw.Draw(im)
for x in range(0,513,86):
    d.rectangle((x,0,x+4,768), fill='#344e4e')
for y in range(0,769,96):
    d.rectangle((0,y,512,y+5),fill='#384e4c')
im.convert("RGB").save(out/"port-machine-glass.webp",quality=94)

im=Image.new("RGB",(1536,160),'#135559');d=ImageDraw.Draw(im)
for inset,col in [(4,'#e7c680'),(12,'#c99a58')]:
    d.rectangle((inset,inset,1535-inset,159-inset),outline=col,width=3)
def wings(cx):
    for sign in [-1,1]:
        for i in range(3):
            a=18+i*3;b=65-i*12;y=68+i*8
            d.polygon([(cx+a*sign,y),(cx+b*sign,y-6),(cx+(b-9)*sign,y+4),(cx+a*sign,y+7)], fill='#eed39e')
    d.ellipse((cx-15,61,cx+15,91),outline='#e4bd78',width=3)
    d.polygon([(cx,51),(cx+4,72),(cx+15,76),(cx+4,80),(cx,99),(cx-4,80),(cx-15,76),(cx-4,72)],fill='#fbe7ae')
wings(113);wings(1423)
fonts=['/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf','DejaVuSansCondensed-Bold.ttf','DejaVuSans.ttf']
for f in fonts:
    try:
        font=ImageFont.truetype(f,86)
        break
    except OSError:
        continue
else:
    raise RuntimeError('Install a Cyrillic display font from the fonts list')
d.text((768,87),'МЕХАНИЧЕСКИЕ МАСТЕРСКИЕ',font=font,fill='#f7ddb0',anchor='mm',stroke_width=1)
for _ in range(1100):
    x=rng.randrange(1536);y=rng.choice([rng.randrange(14),rng.randrange(145,160)])
    d.line((x,y,x+rng.randrange(1,6),y),fill='#88755b')
im.save(out/'port-workshop-sign.webp',quality=95)

# Matte glazed cladding with asymmetric rain tracks and chips concentrated at joints.
tile=Image.new('RGB',(512,512),'#c9dbcd'); d=ImageDraw.Draw(tile)
for j in range(4):
    for i in range(4):
        x,y=i*128,j*128
        v=rng.randrange(-9,10)
        d.rectangle((x+1,y+1,x+127,y+127),fill=(210+v,218+v,207+v))
        d.line((x,y,x+127,y),fill='#87978d',width=2)
        d.line((x,y,x,y+127),fill='#a3b3a7',width=2)
        for _ in range(22):
            xx=x+rng.randrange(2,127); yy=y+rng.choice([1,2,126])
            d.line((xx,yy,xx+rng.randrange(1,6),yy),fill='#9d9c87')
for _ in range(11000):
    xx=rng.randrange(512); yy=rng.randrange(512)
    d.point((xx,yy), fill=rng.choice(['#c4d1c2','#e5e4cd','#b9cabe']))
tile.save(out/'port-glazed-block.webp',quality=93)
