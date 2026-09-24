# Workflowresultat -> picks_final.json med luckor och markörer för kapitelkort, citat och scener. Kontrollerar täckning.
import json,sys
res=json.load(open('wf_result.json'))
manus=json.load(open('manus_meningar.json'));scene={m['id']:m['scene'] for m in manus}
CHAP={'M10':('03_kap1 · Kapitel 1',4),'M20':('07_kap2 · Kapitel 2',4),'M24':('09_kap3 · Kapitel 3',4),'M31':('11_kap4 · Kapitel 4',4),'M41':('14_kap5 · Kapitel 5',4)}
QUOTE_AFTER='M16'
picks=[];notes=[]
for r in sorted(res,key=lambda r:r['section']):
    v=r['verified'] or r['picker']
    for p in v['picks']:p['section']=r['section'];picks.append(p)
    notes.append({'section':r['section'],'missing':v.get('missing',[]),'flags':v.get('flags',[]),'changes':v.get('changes',[])})
seen={};out=[];last_scene=None;errs=[];prev_ids=None
for p in picks:
    ids=p['manus_ids']
    for i in ids:
        if i in CHAP and i not in seen:out.append({'gap':CHAP[i][1],'marker':CHAP[i][0]})
    sc=[scene[i] for i in ids if i in scene]
    if sc and sc[0]!=last_scene:p['marker']=sc[0];last_scene=sc[0]
    for i in ids:
        if i in seen and seen[i]!=len(out)-0 and i not in (prev_ids or []):errs.append(f'{i} täcks två gånger (ej i följd)')
        seen[i]=len(out)
    prev_ids=ids
    out.append(p)
    if QUOTE_AFTER in ids:out.append({'gap':6,'marker':'CITAT · 05 OH MY GOD / 05b Whoa + Excitement'})
missing=[m['id'] for m in manus if m['id'] not in seen]
used={}
for p in picks:
    for k in range(p['srt_from'],p['srt_to']+1):
        if k and k in used:errs.append(f'SRT #{k} används två gånger ({used[k]} och {p["manus_ids"]})')
        used[k]=p['manus_ids']
json.dump(out,open('picks_final.json','w'),ensure_ascii=False,indent=1)
json.dump(notes,open('notes.json','w'),ensure_ascii=False,indent=1)
print(len(picks),'picks; saknas i urval:',missing,'; fel:',errs)
for n in notes:
    for k in ('missing','flags','changes'):
        for x in n[k]:print(f"[{n['section']}] {k}: {x}")
