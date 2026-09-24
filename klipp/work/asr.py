import sys,json,time
from faster_whisper import WhisperModel
src,out,model=sys.argv[1],sys.argv[2],sys.argv[3]
t0=time.time()
m=WhisperModel(model,device='cpu',compute_type='int8',cpu_threads=4,download_root='/tmp/claude-0/-home-user-hfani/21c813be-3973-5b58-a1ca-9bcecb2168fd/scratchpad/hf')
segs,info=m.transcribe(src,language='sv',word_timestamps=True,vad_filter=False,beam_size=5,condition_on_previous_text=False)
res=[]
for s in segs:
    res.append({'start':s.start,'end':s.end,'text':s.text,'words':[{'s':w.start,'e':w.end,'w':w.word,'p':w.probability} for w in (s.words or [])]})
    if len(res)%20==0: print(f'{s.end:.0f}s {time.time()-t0:.0f}s',flush=True)
json.dump(res,open(out,'w'),ensure_ascii=False)
print('done',time.time()-t0,'s',len(res),'segs',flush=True)
