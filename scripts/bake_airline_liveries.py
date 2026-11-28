"""Paint original civil fleet skins. U runs nose to tail; V goes around the hull."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps
import random

out=Path(__file__).resolve().parents[1]/'assets/textures/nomad'
for kind,base,trim,mark in [('express','#e7d6ad','#1f4856','AL • 247'),('feeder','#b8462e','#efc989','AL • 36'),('envelope','#e4d4ad','#33545c','АЭРОЛИНИЯ')]:
    im=Image.new('RGB',(1024,512),base)
    d=ImageDraw.Draw(im); rng=random.Random(1935)
    for x in range(22,1023,58):
        d.line((x,0,x,511),fill=tuple(int(c*.85) for c in im.getpixel((1,1))),width=1)
        for y in range(3,512,7):
            d.point((x+2,y),fill='#a49b81')
    for _ in range(9200):
        x,y=rng.randrange(1024),rng.randrange(512)
        c=im.getpixel((x,y));d.point((x,y),fill=tuple(max(0,k-rng.randrange(1,15)) for k in c))
    for mid in [127,383]:
        d.polygon([(48,mid+3),(700,mid-4),(948,mid-1),(700,mid+9),(150,mid+15)],fill=trim)
        d.line((140,mid+19,735,mid+12),fill='#c49857',width=2)
        if kind!='envelope':
            for j in range(7 if kind=='express' else 4):
                x=330+j*49
                d.rounded_rectangle((x,mid-34,x+30,mid-9),5,fill='#766e5d')
                d.rounded_rectangle((x+2,mid-32,x+28,mid-12),4,fill='#355561')
                d.line((x+4,mid-29,x+24,mid-29),fill='#9eb4a9',width=2)
        try: font=ImageFont.truetype('Arial Bold.ttf',24 if kind!='envelope' else 31)
        except OSError: font=ImageFont.truetype('DejaVuSans.ttf',24)
        stamp=Image.new('RGBA',(225,42));ImageDraw.Draw(stamp).text((2,0),mark,font=font,fill=trim)
        if mid==127: stamp=ImageOps.mirror(stamp)
        im.paste(stamp,(615 if kind!='envelope' else 365,mid-46),stamp)
    # On starboard, the mesh UV runs from the keel up to the crown.
    im.paste(ImageOps.flip(im.crop((0,0,1024,256))),(0,0))
    im.save(out/('airline-'+kind+'.webp'),quality=92)
