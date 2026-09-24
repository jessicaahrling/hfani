# picks_final.json -> exakta in/ut-punkter (ordtider + tystnad i ljudet) -> klipplista, FCP7-XML och EDL per bildfrekvens, lyssnings-MP3.
import json,re,os,difflib,subprocess,math
import numpy as np
from xml.sax.saxutils import escape
HERE=os.path.dirname(os.path.abspath(__file__));OUT=os.path.join(HERE,'..')
srt={e['i']:e for e in json.load(open('srt.json'))}
asr=json.load(open('asr_full.json'));W=[w for s in asr for w in s['words']]
for w in W:w['m']=(w['s']+w['e'])/2
db=np.load('energy.npy');FR=0.01;NF=len(db);DUR=NF*FR
manus={m['id']:m for m in json.load(open('manus_meningar.json'))}
P=json.load(open('picks_final.json'));OV=json.load(open('overrides.json'))
norm=lambda s:re.sub(r'[^a-zåäö0-9]','',s.lower())

def words_in(t0,t1):return [w for w in W if t0-.3<=w['m']<=t1+.3]
def boundary(p,t0,t1):
    """tid för första behållna ord (om drop_head) och sista behållna ord (om drop_tail), via Whisper-ord"""
    s_in,s_out=t0,t1;how=[]
    for side in ('head','tail'):
        n=p.get(f'drop_{side}_words') or 0
        if not n:continue
        row=srt[p['srt_from'] if side=='head' else p['srt_to']];toks=row['t'].split()
        ws=words_in(row['s'],row['e']);wt=[norm(w['w']) for w in ws];st=[norm(x) for x in toks]
        sm=difflib.SequenceMatcher(None,st,wt,autojunk=False);mp={}
        for a,b,size in sm.get_matching_blocks():
            for k in range(size):mp[a+k]=b+k
        if side=='head':
            k=n;cand=[mp[j] for j in range(k,len(st)) if j in mp]
            if cand:s_in=ws[cand[0]]['s'];how.append('head:ord')
            else:frac=sum(len(x) for x in toks[:n])/max(1,sum(len(x) for x in toks));s_in=row['s']+frac*(row['e']-row['s']);how.append('head:andel')
        else:
            k=len(st)-n-1;cand=[mp[j] for j in range(k,-1,-1) if j in mp]
            if cand:s_out=ws[cand[0]]['e'];how.append('tail:ord')
            else:frac=sum(len(x) for x in toks[:len(toks)-n])/max(1,sum(len(x) for x in toks));s_out=row['s']+frac*(row['e']-row['s']);how.append('tail:andel')
    return s_in,s_out,how

def thr_at(t):
    a=max(0,int((t-6)/FR));b=min(NF,int((t+6)/FR));seg=db[a:b]
    return max(np.percentile(seg,15)+14,-50)
def silent_runs(t0,t1,thr,minlen):
    a=max(0,int(t0/FR));b=min(NF,int(t1/FR));runs=[];k=a
    while k<b:
        if db[k]<thr:
            j=k
            while j<b and db[j]<thr:j+=1
            if (j-k)*FR>=minlen:runs.append((k*FR,j*FR))
            k=j
        else:k+=1
    return runs
def is_sil(k,thr):return db[k]<thr
def refine_in(t,thr):
    k=int(round(t/FR))
    if is_sil(k,thr):   # tystnad vid t: gå framåt till talstart
        j=k
        while j<min(NF,k+60) and is_sil(j,thr):j+=1
        on=j;s0=k
        while s0>max(0,k-150) and is_sil(s0-1,thr):s0-=1
    else:               # tal vid t: gå bakåt till en tystnad >= 60 ms
        j=k;on=None
        while j>max(0,k-50):
            if is_sil(j-1,thr):
                e=j;s0=j-1
                while s0>0 and is_sil(s0-1,thr):s0-=1
                if (e-s0)>=6:on=e;break
                j=s0
            else:j-=1
        if on is None:return t-.03,['in utan tystnad']
    return max((s0+3)*FR,on*FR-.12),[]
def refine_out(t,thr):
    k=int(round(t/FR))
    if is_sil(k,thr):   # tystnad vid t: gå bakåt till sista talet
        j=k
        while j>max(0,k-60) and is_sil(j-1,thr):j-=1
        off=j;e=k
        while e<min(NF,k+150) and is_sil(e,thr):e+=1
    else:               # tal vid t: gå framåt till en tystnad >= 120 ms
        j=k;off=None
        while j<min(NF,k+100):
            if is_sil(j,thr):
                s0=j;e=j
                while e<NF and is_sil(e,thr):e+=1
                if (e-s0)>=12:off=s0;break
                j=e
            else:j+=1
        if off is None:return t+.03,['ut utan tystnad']
    return min((e-3)*FR,off*FR+.2),[]
items=[];flags=[]
for p in P:
    if p.get('gap'):items.append({'gap':p['gap'],'marker':p.get('marker','')});continue
    ov=OV.get(f"{p['manus_ids'][0]}:{p['srt_from']}",{})
    if 'spoken' in ov:p['spoken']=ov['spoken']
    t0,t1=srt[p['srt_from']]['s'],srt[p['srt_to']]['e'];how=[];thr=thr_at((t0+t1)/2);notes=[]
    if 'cut_in' in ov:cin=ov['cut_in'];how.append('in:fast')
    else:cin,n1=refine_in(t0,thr);notes+=n1
    if 'cut_out' in ov:cout=ov['cut_out'];how.append('ut:fast')
    else:cout,n2=refine_out(t1,thr);notes+=n2
    if cout-cin<.3:flags.append(f"kort klipp {p['manus_ids']}");
    items.append({'in':round(cin,3),'out':round(cout,3),'manus':p['manus_ids'],'spoken':p['spoken'],'srt':[p.get('srt_from'),p.get('srt_to')],'how':how,'notes':notes,'marker':p.get('marker','')})
# överlapp mellan klipp i källan (samma ljud två gånger)?
cl=[x for x in items if 'in' in x]
for a in cl:
    for b in cl:
        if a is not b and a['in']<b['out']-.05 and b['in']<a['out']-.05:flags.append(f"överlapp {a['manus']} / {b['manus']}")
json.dump({'items':items,'flags':flags},open('cut.json','w'),ensure_ascii=False,indent=1)

# ---------- export ----------
RATES=[('23.976',24,True),('24',24,False),('25',25,False),('29.97',30,True),('30',30,False),('50',50,False),('59.94',60,True),('60',60,False)]
SRC_NAME='klipp för klippning';SRC_FILE='klipp_for_klippning.mp4'
def fps(tb,ntsc):return tb*1000/1001 if ntsc else tb
def tc(fr,tb):s,f=divmod(fr,tb);m,s=divmod(s,60);h,m=divmod(m,60);return f"{h:02d}:{m:02d}:{s:02d}:{f:02d}"
seq_len_s=sum((x['gap'] if 'gap' in x else x['out']-x['in']) for x in items)
for name,tb,ntsc in RATES:
    F=fps(tb,ntsc);fr=lambda t:int(round(t*F));src_dur=fr(DUR+1)
    rate=f"<rate><timebase>{tb}</timebase><ntsc>{'TRUE' if ntsc else 'FALSE'}</ntsc></rate>"
    fileful=f"""<file id="file-1"><name>{escape(SRC_NAME)}</name><pathurl>file://localhost/{SRC_FILE}</pathurl>{rate}<duration>{src_dur}</duration>
<timecode>{rate}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>
<media><video><samplecharacteristics>{rate}<width>1920</width><height>1080</height><pixelaspectratio>square</pixelaspectratio></samplecharacteristics></video>
<audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>2</channelcount></audio></media></file>"""
    V=[];A1=[];A2=[];markers=[];pos=0;n=0;edl=[f"TITLE: Grovklipp {name} fps",'FCM: NON-DROP FRAME','']
    for x in items:
        if 'gap' in x:
            if x['marker']:markers.append((pos,x['marker']))
            pos+=fr(x['gap']);continue
        n+=1;i0,i1=fr(x['in']),fr(x['out']);L=i1-i0
        if x['marker']:markers.append((pos,x['marker']))
        lab=escape(' '.join(x['manus']))
        fe=fileful if n==1 else '<file id="file-1"/>'
        links=lambda:f"<link><linkclipref>v{n}</linkclipref><mediatype>video</mediatype><trackindex>1</trackindex><clipindex>{n}</clipindex></link><link><linkclipref>a{n}l</linkclipref><mediatype>audio</mediatype><trackindex>1</trackindex><clipindex>{n}</clipindex><groupindex>1</groupindex></link><link><linkclipref>a{n}r</linkclipref><mediatype>audio</mediatype><trackindex>2</trackindex><clipindex>{n}</clipindex><groupindex>1</groupindex></link>"
        V.append(f"<clipitem id=\"v{n}\"><name>{lab}</name><enabled>TRUE</enabled><duration>{src_dur}</duration>{rate}<start>{pos}</start><end>{pos+L}</end><in>{i0}</in><out>{i1}</out>{fe}{links()}</clipitem>")
        for tr,lst,cid in ((1,A1,f'a{n}l'),(2,A2,f'a{n}r')):
            lst.append(f"<clipitem id=\"{cid}\"><name>{lab}</name><enabled>TRUE</enabled><duration>{src_dur}</duration>{rate}<start>{pos}</start><end>{pos+L}</end><in>{i0}</in><out>{i1}</out><file id=\"file-1\"/><sourcetrack><mediatype>audio</mediatype><trackindex>{tr}</trackindex></sourcetrack>{links()}</clipitem>")
        edl+= [f"{n:03d}  AX       AA/V  C        {tc(i0,tb)} {tc(i1,tb)} {tc(pos,tb)} {tc(pos+L,tb)}",f"* FROM CLIP NAME: {SRC_FILE}",f"* {' '.join(x['manus'])}: {x['spoken'][:70]}",'']
        pos+=L
    mk=''.join(f"<marker><name>{escape(m)}</name><comment></comment><in>{p}</in><out>-1</out></marker>" for p,m in markers)
    xml=f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4"><sequence id="seq-1"><name>Grovklipp {name} fps</name><duration>{pos}</duration>{rate}
<timecode>{rate}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>{mk}
<media><video><format><samplecharacteristics>{rate}<width>1920</width><height>1080</height><pixelaspectratio>square</pixelaspectratio></samplecharacteristics></format>
<track>{''.join(V)}</track></video>
<audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
<track>{''.join(A1)}<outputchannelindex>1</outputchannelindex></track><track>{''.join(A2)}<outputchannelindex>2</outputchannelindex></track></audio></media></sequence></xmeml>
"""
    d=os.path.join(OUT,'premiere',name.replace('.','_')+'fps');os.makedirs(d,exist_ok=True)
    open(os.path.join(d,'grovklipp.xml'),'w',encoding='utf-8').write(xml);open(os.path.join(d,'grovklipp.edl'),'w',encoding='utf-8').write('\n'.join(edl))
# klipplista
f=lambda t:f"{int(t//60):02d}:{t%60:06.3f}"
rows=['| # | Plats i klippet | Källa in | Källa ut | Längd | Manus | Sagt |','|---|---|---|---|---|---|---|'];pos=0;n=0
for x in items:
    if 'gap' in x:rows.append(f"|  | {f(pos)} | | | {x['gap']:.1f} s | **{x['marker']}** | *(lucka)* |");pos+=x['gap'];continue
    n+=1;L=x['out']-x['in'];rows.append(f"| {n} | {f(pos)} | {f(x['in'])} | {f(x['out'])} | {L:.1f} s | {' '.join(x['manus'])}{' · '+x['marker'] if x['marker'] else ''} | {x['spoken']} |");pos+=L
open(os.path.join(OUT,'klipplista.md'),'w',encoding='utf-8').write(f"# Klipplista – grovklipp\n\nTotal längd: {int(pos//60)} min {pos%60:.0f} s, {n} klipp.\n\n"+'\n'.join(rows)+'\n')
# lyssnings-MP3 ur original-MP3:n
src='/root/.claude/uploads/21c813be-3973-5b58-a1ca-9bcecb2168fd/ba89a9df-klipp_fo_r_klippning.MP3'
parts=[];fl=[]
for k,x in enumerate(items):
    if 'gap' in x:fl.append(f"aevalsrc=0:d={x['gap']}:s=44100:c=stereo[g{k}]");parts.append(f"[g{k}]")
    else:fl.append(f"[0:a]atrim={x['in']}:{x['out']},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={max(0,x['out']-x['in']-0.03):.3f}:d=0.03[c{k}]");parts.append(f"[c{k}]")
fl.append(''.join(parts)+f"concat=n={len(parts)}:v=0:a=1[o]")
open('filter.txt','w').write(';\n'.join(fl))
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',src,'-filter_complex_script','filter.txt','-map','[o]','-c:a','libmp3lame','-b:a','128k','grovklipp_lyssna.mp3'],check=True)
print(f"{n} klipp, {pos/60:.1f} min, flaggor: {len(flags)}");[print(' !',x) for x in flags]
for x in cl:
    if x['notes']:print(' ~',x['manus'],x['how'],x['notes'])
