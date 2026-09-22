# Renderar varje scen till en egen MP4 (30 fps, H.264 yuv420p). Valfritt: scen-id som argument for att bara rendera vissa.
# Kor garna i bakgrunden:  nohup python3 render.py > render.out 2>&1 &   och folj render.log
import sys, os, base64, subprocess, time
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.abspath(__file__)); FPS=30; OUT=os.path.join(ROOT,'out'); os.makedirs(OUT,exist_ok=True)
only=set(sys.argv[1:])
def log(*a):
    with open(os.path.join(ROOT,'render.log'),'a') as f: f.write(' '.join(str(x) for x in a)+'\n')
with sync_playwright() as p:
    b=p.chromium.launch(args=["--disable-gpu","--no-sandbox"]); pg=b.new_page(viewport={"width":2000,"height":2000})
    pg.goto("file://"+os.path.join(ROOT,'animationer.html')+"#render"); pg.evaluate("window.ready()")
    meta=pg.evaluate("SCENES_META()")
    for i,sc in enumerate(meta):
        if only and sc['id'] not in only: continue
        dst=f"{OUT}/{sc['id']}.mp4"; tmp=dst+'.part.mp4'
        if os.path.exists(dst): log('skip (finns redan)',sc['id']); continue
        n=int(round(sc['dur']*FPS)); t0=time.time()
        ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','png','-i','-',
            '-vf','scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-preset','fast','-crf','15',
            '-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart','-r',str(FPS),tmp],stdin=subprocess.PIPE)
        for f in range(n):
            s=pg.evaluate(f"(renderFrame({i},{f/FPS:.5f}),document.getElementById('cv').toDataURL('image/png'))")
            ff.stdin.write(base64.b64decode(s[22:]))
            if f%120==0: log(sc['id'],f'{f}/{n}',f'{(time.time()-t0)/(f+1)*1000:.0f} ms/ruta')
        ff.stdin.close(); ff.wait(); os.rename(tmp,dst); log('done',sc['id'],f'{time.time()-t0:.0f}s',os.path.getsize(dst)//1024,'KB')
    b.close()
log('ALL DONE')
