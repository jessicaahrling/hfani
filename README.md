# hf-animationer

Animationer till videon om Hugging Face-incidenten. Två projekt med samma motor:

- `portrait/`  – Instagram/Reels, 1080×1920. **Klar.** Referens.
- `landscape/` – Youtube, 1920×1080. Grund + 3 utkastscener + rubrikkort. **Ska byggas färdigt** – se `CLAUDE.md`.
- `fonts/`     – Big Shoulders + Geist Mono (OFL), bäddas in vid bygge.
- `manus_youtube.md` – manuset som scenerna följer.

Snabbstart:
```bash
pip install playwright pillow && playwright install chromium   # + ffmpeg och node i PATH
cd landscape && python3 build.py && python3 msheet.py sheets/test.png 0:3 1:5 2:12 3:2.5
```
Öppna sedan `landscape/animationer.html` i Chrome för att scrubba scenerna.
