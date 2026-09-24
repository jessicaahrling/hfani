# RMS-kurva i 10 ms-steg ur 16 kHz mono -> energy.npy (dBFS)
import numpy as np,wave
w=wave.open('audio16k.wav');n=w.getnframes();x=np.frombuffer(w.readframes(n),dtype=np.int16).astype(np.float32)/32768
hop=160;frames=len(x)//hop;x=x[:frames*hop].reshape(frames,hop)
rms=np.sqrt((x**2).mean(1)+1e-12);db=20*np.log10(rms)
np.save('energy.npy',db);print('frames',frames,'p10',np.percentile(db,10),'p50',np.percentile(db,50),'p90',np.percentile(db,90))
