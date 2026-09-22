# Utsnitt i full upplosning:  python3 crop.py <scenIndex> t x y w h [t x y w h ...]  -> sheets/crop.png
import sys,os,base64,io
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.abspath(__file__))
idx=int(sys.argv[1]); args=[float(a) for a in sys.argv[2:]]; groups=[args[i:i+5] for i in range(0,len(args),5)]
with sync_playwright() as p:
    b=p.chromium.launch(args=["--disable-gpu","--no-sandbox"]); pg=b.new_page(viewport={"width":2000,"height":2000})
    pg.goto("file://"+os.path.join(ROOT,'animationer.html')+"#render"); pg.evaluate("window.ready()")
    ims=[]
    for t,x,y,w,h in groups:
        s=pg.evaluate(f"(renderFrame({idx},{t}),document.getElementById('cv').toDataURL('image/png'))")
        ims.append(Image.open(io.BytesIO(base64.b64decode(s.split(',')[1]))).convert('RGB').crop((int(x),int(y),int(x+w),int(y+h))))
    b.close()
W=sum(i.width for i in ims)+8*(len(ims)-1); Hh=max(i.height for i in ims); sh=Image.new('RGB',(W,Hh),(40,40,40)); xx=0
for im in ims: sh.paste(im,(xx,0)); xx+=im.width+8
out=os.path.join(ROOT,'sheets','crop.png'); os.makedirs(os.path.dirname(out),exist_ok=True); sh.save(out); print('ok',sh.size,out)
