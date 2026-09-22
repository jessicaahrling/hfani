# Kontaktkarta over flera scener/tider:  python3 msheet.py sheets/x.png 0:1.5 0:4.0 3:2.2 ...
import sys,os,base64,io
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.abspath(__file__))
out=sys.argv[1] if os.path.isabs(sys.argv[1]) else os.path.join(ROOT,sys.argv[1])
pairs=[(int(a.split(':')[0]),float(a.split(':')[1])) for a in sys.argv[2:]]
with sync_playwright() as p:
    b=p.chromium.launch(args=["--disable-gpu","--no-sandbox"]); pg=b.new_page(viewport={"width":2000,"height":2000})
    errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto("file://"+os.path.join(ROOT,'animationer.html')+"#render"); pg.evaluate("window.ready()")
    W=pg.evaluate("document.getElementById('cv').width"); Hh=pg.evaluate("document.getElementById('cv').height")
    ims=[]
    for i,t in pairs:
        s=pg.evaluate(f"(renderFrame({i},{t}),document.getElementById('cv').toDataURL('image/png'))")
        ims.append(Image.open(io.BytesIO(base64.b64decode(s.split(',')[1]))).convert('RGB'))
    b.close()
if errs: print("ERRORS:",errs[:6])
tw=480 if W>Hh else 300; th=int(tw*Hh/W); cols=min(4,len(ims)); rows=(len(ims)+cols-1)//cols
sh=Image.new('RGB',(tw*cols+6*(cols-1),th*rows+6*(rows-1)),(40,40,40))
for k,im in enumerate(ims): sh.paste(im.resize((tw,th),Image.LANCZOS),((k%cols)*(tw+6),(k//cols)*(th+6)))
os.makedirs(os.path.dirname(out),exist_ok=True); sh.save(out); print(out,len(ims),'rutor')
