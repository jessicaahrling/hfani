#!/usr/bin/env bash
# Slår ihop de renderade delarna, lägger på kapitelkorten och gör en förhandsvisning med rösten.
set -e; cd "$(dirname "$0")"; L=../../landscape
AUDIO="${1:-finklipp.mp3}"
printf "file '%s'\n" del_00.mp4 del_01.mp4 del_02.mp4 > delar.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i delar.txt -c copy -movflags +faststart animationer_synk_utan_kapitelkort.mp4
python3 $L/sync_render.py plan.json . --cards
# kapitelkorten ovanpå, på exakt sina tider
python3 - <<'PY'
import json,subprocess,os
p=json.load(open('plan.json'));ins=['-i','animationer_synk_utan_kapitelkort.mp4'];fc=[];last='[0:v]'
for k,c in enumerate(p['cards'],1):
    ins+=['-itsoffset',str(c['start']),'-i',f"kort_{c['scene']}.mp4"]
    out=f'[v{k}]';fc.append(f"{last}[{k}:v]overlay=enable='between(t,{c['start']},{c['start']+c['dur']-0.001})':eof_action=pass{out}");last=out
subprocess.run(['ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',';'.join(fc),'-map',last,'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',
  '-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-r','25',*(['-force_key_frames',os.environ['KEYFRAMES']] if os.environ.get('KEYFRAMES') else []),'-movflags','+faststart','animationer_synk.mp4'],check=True)
PY
# förhandsvisning med rösten (720p, för att titta på)
ffmpeg -y -loglevel error -i animationer_synk.mp4 -i "$AUDIO" -map 0:v -map 1:a -vf scale=1280:720 -c:v libx264 -preset fast -crf 24 -c:a aac -b:a 160k -shortest -movflags +faststart forhandsvisning_synk_720p.mp4
ls -la animationer_synk*.mp4 forhandsvisning_synk_720p.mp4
