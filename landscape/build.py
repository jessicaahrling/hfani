import base64,os,re
ROOT=os.path.dirname(os.path.abspath(__file__))
F=os.path.join(ROOT,'..','fonts')+os.sep
src=os.path.join(ROOT,'src')+os.sep
b64=lambda n:base64.b64encode(open(F+n,'rb').read()).decode()
PARTS='AUTO'
if PARTS=='AUTO':
    PARTS=['lib.js','world.js']+sorted(f for f in os.listdir(src) if re.match(r'yt\d+\.js$',f))+['main.js']
js='\n'.join(open(src+p,encoding='utf-8').read() for p in PARTS)
open(os.path.join(ROOT,'all.js'),'w',encoding='utf-8').write(js)
h=open(src+'template.html',encoding='utf-8').read().replace('__BSB__',b64('BigShoulders-Bold.ttf')).replace('__BSR__',b64('BigShoulders-Regular.ttf')).replace('__GMR__',b64('GeistMono-Regular.ttf')).replace('__GMB__',b64('GeistMono-Bold.ttf')).replace('__JS__',js)
open(os.path.join(ROOT,'animationer.html'),'w',encoding='utf-8').write(h)
print('built',len(h)//1024,'KB from',PARTS)
