# hf-animationer

Animationer till videon om Hugging Face-incidenten. Två projekt med samma motor:

- `portrait/`  – Instagram/Reels, 1080×1920. **Klar.** Referens.
- `landscape/` – Youtube, 1920×1080. **Klar.** 21 scener i `src/yt1.js`–`yt5.js`, MP4 per scen i `out/` samt `out/alla_scener_forhandsvisning.mp4`. Se `CLAUDE.md` för scenplan och regler.
- `fonts/`     – Big Shoulders + Geist Mono (OFL), bäddas in vid bygge.
- `manus_youtube.md` – manuset som scenerna följer.

Snabbstart:
```bash
pip install playwright pillow && playwright install chromium   # + ffmpeg och node i PATH
cd landscape && python3 build.py && python3 msheet.py sheets/test.png 0:3 1:5 2:12 3:2.5
```
Öppna sedan `landscape/animationer.html` i Chrome för att scrubba scenerna.
