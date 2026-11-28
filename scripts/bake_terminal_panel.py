"""Original painted enamel panel for the island air-line terminals."""
from pathlib import Path
from PIL import Image,ImageDraw
import random
im=Image.new('RGB',(768,288),'#ded3a7');d=ImageDraw.Draw(im)
blue='#21434e';red='#af4931';gold='#c58d49'
d.rectangle((8,8,759,279),outline=blue,width=6)
d.rectangle((19,19,748,268),outline=gold,width=3)
d.ellipse((470,34,611,175),fill=gold)
for x in [42,64,86]:
    d.line((x,230,x+42,66),fill=blue,width=5)
    for n in range(5):
        y=177-20*n;u=x+(230-y)//4
        d.polygon([(u,y),(u-12,y-5),(u-17,y-31),(u-2,y-13)],fill=gold)
        d.polygon([(u,y-6),(u+19,y-19),(u+21,y-34),(u+7,y-24)],fill=red)
for x,y in [(180,93),(218,77),(256,99)]:
    d.rectangle((x,y,x+39,221),fill=blue);d.ellipse((x,y-9,x+39,y+9),fill='#57777a')
d.polygon([(156,231),(208,171),(322,171),(360,214),(416,191),(526,205),(589,182),(724,207),(724,245),(156,245)],fill=red)
d.polygon([(337,138),(467,112),(533,75),(571,72),(547,100),(681,81),(698,86),(548,123),(498,151),(477,150),(488,134),(359,149)],fill=blue)
d.line((36,251,732,251),fill=gold,width=4)
r=random.Random(27)
for i in range(5200):
 x=r.randrange(im.width);y=r.randrange(im.height);shade=r.randrange(-13,14)
 im.putpixel((x,y),tuple(max(0,min(255,c+shade)) for c in im.getpixel((x,y))))
im.save(Path(__file__).resolve().parents[1]/'assets/textures/nomad/terminal-freight-panel.webp',quality=90)
