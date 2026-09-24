# Bygger underlag per avsnitt: manusmeningar + kronologiska SRT-rader med Whisper-text och ord som SRT missat.
import json,re
def ts(s):h,m,r=s.split(':');sec,ms=r.split(',');return int(h)*3600+int(m)*60+int(sec)+int(ms)/1000
srt=[];blocks=open('../klipp_for_klippning.srt',encoding='utf-8').read().strip().split('\n\n')
for b in blocks:
    L=b.strip().split('\n');a,z=L[1].split(' --> ');srt.append({'i':int(L[0]),'s':ts(a),'e':ts(z),'t':' '.join(L[2:])})
json.dump(srt,open('srt.json','w'),ensure_ascii=False)
asr=json.load(open('asr_full.json'));W=[w for s in asr for w in s['words']]
for w in W:w['m']=(w['s']+w['e'])/2
used=set()
for e in srt:
    ws=[k for k,w in enumerate(W) if e['s']-.25<=w['m']<=e['e']+.25];used.update(ws)
    e['asr']=''.join(W[k]['w'] for k in ws).strip()
extra=[];cur=[]
for k,w in enumerate(W):
    if k in used:
        if cur:extra.append(cur);cur=[]
    else:cur.append(w)
if cur:extra.append(cur)
extra=[{'s':c[0]['s'],'e':c[-1]['e'],'t':''.join(w['w'] for w in c).strip()} for c in extra if ''.join(w['w'] for w in c).strip()]
json.dump(extra,open('asr_extra.json','w'),ensure_ascii=False)
manus=json.load(open('manus_meningar.json'))
RANGES={1:(1,71),2:(72,129),3:(130,191),4:(192,298),5:(299,381)}
f=lambda t:f"{int(t//60):02d}:{t%60:05.2f}"
for sec,(a,b) in RANGES.items():
    lines=[]
    items=[('srt',e) for e in srt if a-3<=e['i']<=b+3]+[('x',x) for x in extra if srt[max(0,a-4)]['s']-1<=x['s']<=srt[min(len(srt),b+3)-1]['e']+1]
    items.sort(key=lambda p:p[1]['s'])
    for kind,e in items:
        if kind=='srt':
            ctx='' if a<=e['i']<=b else '  (kontext, annat avsnitt)'
            lines.append(f"[#{e['i']}] {f(e['s'])}–{f(e['e'])} | SRT: {e['t']} | ASR: {e['asr'] or '(inget)'}{ctx}")
        else:lines.append(f"[ASR utan SRT-rad] {f(e['s'])}–{f(e['e'])} | {e['t']}")
    ms=[m for m in manus if m['sec']==sec]
    txt=f"# Avsnitt {sec}: SRT-rader #{a}–#{b}\n\n## Manusmeningar i avsnittet\n"+'\n'.join(f"- {m['id']} [{m['scene']}]: {m['text']}" for m in ms)
    txt+="\n\n## Inspelningen, kronologiskt\n"+'\n'.join(lines)+'\n'
    open(f'sec{sec}.md','w',encoding='utf-8').write(txt)
    print('sec',sec,len(lines),'rader',len(ms),'meningar')
print('extra ASR-bitar:',len(extra))
