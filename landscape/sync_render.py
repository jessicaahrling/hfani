# Renderar animationerna synkade mot en ljudfil enligt en plan (JSON):
#   segments: [{scene, start, end, anchors:[[ljudtid, scentid], ...]}]  -> scentid interpoleras linjärt mellan ankarna,
#   före första ankaret står scenen stilla, efter sista ankaret går den i realtid (hållbart slutläge).
#   cards: [{scene, start, dur}] -> rubrikkort som renderas separat.
# Användning: python3 sync_render.py plan.json utkatalog [--part k/N] [--cards]
import sys,os,json,base64,subprocess,time,bisect
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.abspath(__file__))
plan=json.load(open(sys.argv[1]));OUT=sys.argv[2];os.makedirs(OUT,exist_ok=True)
FPS=plan['fps'];N=int(round(plan['dur']*FPS));T0=plan.get('t0',0)   # t0: klippets starttid i filmen
part=[a for a in sys.argv if a.startswith('--part=')];cards='--cards' in sys.argv
def tau(seg,T):
    A=seg['anchors']
    if T<=A[0][0]:return A[0][1]
    for (a0,s0),(a1,s1) in zip(A,A[1:]):
        if T<=a1:return s0+(s1-s0)*(T-a0)/(a1-a0)
    return A[-1][1]+(T-A[-1][0])
def enc(dst):
    return subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','png','-i','-',
        '-vf','scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-preset','medium','-crf',str(plan.get('crf',18)),
        '-g',str(FPS*2),'-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart','-r',str(FPS),dst],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch(args=["--disable-gpu","--no-sandbox"]);pg=b.new_page(viewport={"width":2000,"height":2000})
    pg.goto("file://"+os.path.join(ROOT,'animationer.html')+"#render");pg.evaluate("window.ready()")
    idx={s['id']:i for i,s in enumerate(pg.evaluate("SCENES_META()"))}
    grab=lambda i,t,ta:base64.b64decode(pg.evaluate(f"(renderFrame({i},{t:.5f},{ta:.5f}),document.getElementById('cv').toDataURL('image/png'))")[22:])
    sheet=[a for a in sys.argv if a.startswith('--sheet=')]
    if sheet:   # kontaktkarta: --sheet=ut.png T1 T2 ... (tider i ljudet)
        import io;from PIL import Image
        Ts=[float(a) for a in sys.argv[3:] if not a.startswith('--')];segs=plan['segments'];starts=[s['start'] for s in segs];ims=[]
        for T in Ts:
            s=segs[max(0,bisect.bisect_right(starts,T)-1)];c=[c for c in plan['cards'] if c['start']<=T<c['start']+c['dur']]
            png=grab(idx[c[0]['scene']],T-c[0]['start'],T-c[0]['start']) if c else grab(idx[s['scene']],tau(s,T),T)
            ims.append(Image.open(io.BytesIO(png)).convert('RGB').resize((480,270)))
        cols=4;rows=(len(ims)+cols-1)//cols;sh=Image.new('RGB',(cols*486,rows*276),(40,40,40))
        for k,im in enumerate(ims):sh.paste(im,((k%cols)*486,(k//cols)*276))
        sh.save(sheet[0].split('=',1)[1]);print('karta',len(ims));b.close();sys.exit()
    if cards:
        for c in plan['cards']:
            dst=os.path.join(OUT,f"kort_{c['scene']}.mp4");ff=enc(dst)
            for f in range(int(round(c['dur']*FPS))):t=f/FPS;ff.stdin.write(grab(idx[c['scene']],t,t))
            ff.stdin.close();ff.wait();print('kort',dst,flush=True)
    else:
        k,n=(map(int,part[0].split('=')[1].split('/'))) if part else (0,1)
        f0,f1=N*k//n,N*(k+1)//n;dst=os.path.join(OUT,f'del_{k:02d}.mp4');ff=enc(dst);t0=time.time()
        segs=plan['segments'];starts=[s['start'] for s in segs]
        for f in range(f0,f1):
            T=T0+f/FPS;s=segs[max(0,bisect.bisect_right(starts,T)-1)]
            ff.stdin.write(grab(idx[s['scene']],tau(s,T),T))
            if (f-f0)%250==0:print(k,f'{f-f0}/{f1-f0}',f'{(time.time()-t0)/(f-f0+1)*1000:.0f} ms/ruta',flush=True)
        ff.stdin.close();ff.wait();print('klar',dst,f'{time.time()-t0:.0f}s',flush=True)
    b.close()
