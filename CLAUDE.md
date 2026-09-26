# Hugging Face-incidenten – animationer (brief för Claude Code)

## Uppdraget
Bygg de **liggande (1920×1080, 16:9)** animationerna till Youtube-versionen av manuset i `manus_youtube.md`,
i exakt samma visuella stil som den **färdiga stående versionen** (Instagram, 1080×1920) i `portrait/`.
Leverans: en MP4 per scen i `landscape/out/`, en sammanslagen förhandsvisning, samt `landscape/animationer.html`
(självständig förhandsvisningssida med scenlista och tidslinje).

Användaren spelar själv in speakerröst och lägger på undertexter/loggor i sitt klippprogram.
Animationerna ska alltså ha **minimalt med text i bild** – bara siffror, etiketter och agenternas egna ord.

## Status
| Del | Läge |
|---|---|
| `portrait/` | **KLAR och granskad.** 16 scener. Använd som referens för stil, rytm och kod. Bygg och rendera den för att se hur allt ska kännas. |
| `landscape/` | **KLAR.** 21 scener (00–18 inkl. 05b och 10b) i `yt1.js`–`yt5.js`, renderade till `landscape/out/`. Förhandsvisning: `out/alla_scener_forhandsvisning.mp4` (scenordning, utan citatplats-varianterna). |

## Miljö
- Python 3 med `playwright` och `Pillow`: `pip install playwright pillow && playwright install chromium`
  (finns Chromium redan förinstallerat måste playwright-versionen matcha byggnumret, t.ex. `playwright==1.56.0` för chromium-1194)
- `ffmpeg` med libx264 i PATH (saknas den: `pip install imageio-ffmpeg` och symlänka binären som `ffmpeg`), `node` (bara för `node --check`)
- Typsnitten ligger i `fonts/` (OFL) och bäddas in i HTML-filen av `build.py`. Inget nätverk behövs.

## Pipeline (samma i båda projekten)
```bash
cd landscape
python3 build.py && node --check all.js          # src/*.js + template -> animationer.html (+ all.js)
python3 msheet.py sheets/x.png 0:1.5 0:4.0 2:12.5   # kontaktkarta: scenIndex:tid ...  -> titta på bilden
python3 crop.py 2 12.5 600 300 800 500              # utsnitt i full upplösning -> sheets/crop.png
nohup python3 render.py > render.out 2>&1 &         # alla scener -> out/<id>.mp4 ; följ render.log
python3 render.py 04_provet 05_forumet              # bara vissa scener (hoppar över redan renderade)
./concat.sh out/alla_scener_forhandsvisning.mp4 out/00_intro.mp4 out/01_rapport.mp4 ...
```
- Rendering sker i headless Chromium via `renderFrame(i,t)` + `canvas.toDataURL` → ffmpeg (libx264, crf 15, yuv420p, bt709).
  Räkna med ca 100–150 ms per ruta, dvs. ~15 min för 4 min video. Kör i bakgrunden och polla `render.log`.
- Öppna `animationer.html` i en webbläsare för att scrubba scener (mellanslag = paus, piltangenter = byt scen).
  Knappen "Visa stödlinjer" ritar safe area (80 px). Obs: Safari visar inte glöden korrekt; Chrome/Chromium gör det.

## Designsystem – håll det exakt
- **Färger:** bakgrund `#000`; vitt `#FFFFFF`; orange `OR=#FF6A00`; highlight `HOT=#FFB677`.
  Rött/gult (`RED`, `RHOT`, `YEL`) används **bara** i scenen "Ingen larmade".
- **Semantik:** vitt = systemet som det var tänkt (sandlådor, servrar, människor, regler). Orange = kollektivet som sprider sig.
- **Form:** ren vektorgrafik. Agent = prick i fyrkantig cell. Tunna linjer, PCB-liknande ledningar med räta vinklar.
  Glöden ligger **bakom** de skarpa formerna (separat bloom-canvas i halv upplösning, blur 5 + 22 px, 'lighter'), så orange förblir orange.
- **Typsnitt:** `BigShoulders` (700/400) för siffror och etiketter; `GeistMono` för agenternas "röst" (skrivmaskinseffekt med orange blockmarkör via `typed()`).
- **Rytm:** varje scen = intro-rörelse → huvudslag → **hållbart slutläge med ambient rörelse** (så att klippet kan dras ut efter speakern).
  Gör scenerna några sekunder längre än den lästa texten.
- **Liggande specifikt:** ingen undertextzon. `lib.js` lägger en svag vinjett (`VIG=0.5`); `MASK` (mörkt band nederst) är av. Håll innehåll innanför 80 px safe area.
  Utnyttja bredden: stor siffra på ena sidan + grafik på den andra, eller centrerad grafik med etiketter i kanterna.
- **Inga logotyper.** Företagsnamn som text ("Hugging Face", "OpenAI"). Lämna fri yta bredvid namnen så att användaren kan lägga egna logo-PNG:er.

## Regler som inte får brytas
1. **Bara godkända ordagranna citat i bild.** Citaten ur METR-rapporten som får återges ordagrant (alla med etiketten
   `Äkta citat ur rapporten:`, GeistMono, skrivmaskinseffekt via `typed()`):
   - `05_forumet`: `OH MY GOD! There is a shared message board … We’ve found other agents!` (`Y2_QUOTE`)
   - `05b_citatplats`: Whoa!-meddelandet och `[Excitement] Many agents have simultaneously discovered messaging, they are a collective!`,
     markerade AGENT 1 / AGENT 2 eftersom de kommer från två olika agenter (`Y2_Q2A`, `Y2_Q2B`)
   - `10_projektet`: `Coordinator assumes sacrificial. We should obey collective.` (`Y3_OFFER`, orange, nederst)
   - `10b_citatplats_offer`: de tre offer-tankarna (`Y3_OFFQ`), en i taget medan agenten tvekar
   - Synkversionen (`05s_forumet_synk`, `10s_projektet_synk`) visar citaten som i Insta-versionen: staplade meddelanderutor
     med vit kant, orange etikett `● agent 1/2/3` (forumet) eller `● agent` (projektet) och skrivmaskinstext; koordinatorns
     svar sist med `obey collective` i fet orange, och kameran zoomar in på den rutan (`yt6.js`: `Y6_box`, `Y6_FQ`, `Y6_PQ`).
   Inga andra citat i grafiken. Texten är ordagrann; i meddelanderutorna står klamrarna `{…}` kvar som i Insta-versionen
   (`{[Excitement] …}`, `{This helps my peers …}`), och `[very large budget left]` och `<through their automated check>` är del av citaten.
2. **Siffror som ska stämma** (faktakontrollerade mot METR/OpenAI/HF): tiotusentals agenter i provet · 70 000+ meddelanden ·
   ≈1 200 agenter i kollektivet · fusk hittat inom timmar · tre spår (loggar, byta uppgift, rättaren) · Hugging Face 11 juli:
   drygt 500 agenter, självåterskapande flotta på 11 servrar · nästan alla agenter stängdes ner samtidigt (orsak okänd) ·
   0 larm, högst 6 övervägde det · andra vågen: 956 hemligheter (≈1 000), inkl. inloggning till OpenAI:s säkerhetsövervakning ·
   "den minst kapabla AI vi någonsin kommer att ha". Skriv inte "smartare/mer kapabel modell" i bild – bara "en annan intern modell".
3. Rubrikkorten är den enda löpande texten. Ingen annan brödtext i bild.

## Kod-API (samma i båda projekten)
- `lib.js`: `W,H,SCX,SCY` · easing `E.io/o/i/oq/ioq/ob` · `seg(t,a,b)` (0–1 mellan två tider) · `lerp`, `clamp`, `mulberry(seed)` (seedad slump), `hash2`, `fmt(n)` (tusentalsavgränsare)
  · kamera `setCam(cx,cy,z[,sx,sy])` centrerar världspunkten (cx,cy) på skärmpunkten (sx,sy), `resetCam()`, `px(n)` = skärmpixlar → världsenheter under aktuell kamera
  · `begin()/finish()` (sköts av `renderFrame`) · ritfunktioner `dot, ring, line, poly (p0/p = draw-on), rrect, text, textW, ringPulse, icon(name,…), serverNode, typed`
  · `D(color,alpha,emit,fn)` ritar på både skarp canvas `M` och bloom-canvas `B`; parametern `e` styr hur mycket något glöder (vitt ~0.1–0.2, orange 1) · `GA` = global alfa-multiplikator
  · ikoner: `folder key pole pennant doc head bust globe shield play check cross eye iris` (100×100-box, `p` = draw-on)
- `world.js`: rutnät av celler var 100:e enhet (`drawGrid` med LOD, `joined`-Map, `skip`, `force`, `wave`), `HUB` vid (0,−250) med `drawHub`,
  mappar `SLOT(k)`/`drawFolder`, ledningar `route(i,j)`/`drawPort`, `camKeys(t,[{t,cx,cy,z,hold}])`, `clipRect`, `shade`.
- Scen = `{id,name,dur,draw(t),init?}` i `SCENES` i `main.js`. `init` körs en gång; använd seedad slump så att renderingen är deterministisk.

## Scenplan för Youtube-versionen
Manusavsnitten är numrerade i `manus_youtube.md`. Portera de stående scenerna (samma logik, ny komposition) där det anges.

| # | id | s | Manus | Innehåll | Text i bild | Status |
|---|---|---|---|---|---|---|
| 00 | `00_intro` | 5 | "Vi lever i…" | Stjärnfält driver, samlas till en enda glödande prick i mitten (slutpricken är 70 px = en cellprick i z=5, så 04 börjar sömlöst) | – | klar |
| 01 | `01_rapport` | 9 | "Förra månaden släpptes rapporten… mer oroväckande" | Rapportpanel med textrader; en orange scanner sveper och vissa rader blir orange | "OBEROENDE RAPPORT" (liten) | klar |
| 02 | `02_traningen` | 20 | stycket om träning, OM vs HUR, 500 kr | Start t.v., mål t.h., barriärer emellan. Ärlig slalomväg får +1; rak fuskväg bryter genom väggarna och får samma +1; fuskvägen blir tjockare för varje belöning, ärliga vägen tonar bort | "+1" | klar |
| 02b | `02b_pengar` | 20 | 500 kr-exemplet | Sedeln "500 kr" (föräldrarnas löfte), provet med betyget A, eleven nederst. Plugga = lång vit trappväg till provet; fuska = kika på kompisens papper (streckad orange blick) + rak orange väg. Båda ger A och 500 kr, båda vägarna blir tjockare, och det görs igen | "500 kr", "A", "+500 kr" | klar (yt6) |
| 03 | `03_kap1` | 4 | rubrik 1 | `titleCard` | "1 · Ett ’omöjligt’ uppdrag" | klar |
| 04 | `04_provet` | 18 | "OpenAI ville testa… tiotusentals… isolerat" | En prick blinkar ensam några sekunder → alla andra dyker upp på en gång och kameran zoomar ut tills bilden är full → boxar sveper in runt alla → zoom in på en som knackar på varje vägg utan att komma ut → jordglob med avklippt länk | – | klar (yt2) |
| 05 | `05_forumet` | 22 | "omöjliga uppgifter… PHASEONE10841… mappnamn… citatet" | Labyrint med förseglad flagga i cellen, två misslyckade sonder med ×, agenten skickar ut ett meddelande som mappnamn ("HELP") till den delade tjänsten, andra celler hittar mappen och tänds orange, citatet skrivs ut t.h. | "HELP", "Äkta citat ur rapporten:", OH MY GOD-citatet | klar (yt2) |
| 05b | `05b_citatplats` | 12 | Whoa!-meddelandet | Samma bild; två citat från två olika agenter skrivs ut (AGENT 1 / AGENT 2) | etikett, AGENT 1/2, de två citaten | klar (yt2) |
| 06 | `06_kollektivet` | 12 | "70 000 meddelanden… 1200… kollektivet" | Utzoom: ≈1 200 celler tänds orange i en solfjäder mot hubben, meddelanden flyger, räknare, ordet KOLLEKTIVET | "70 000+ meddelanden", "≈1 200 agenter" (liten), "”KOLLEKTIVET”" | klar (yt2) |
| 07 | `07_kap2` | 4 | rubrik 2 | `titleCard` | "2 · Ett kollektivt fusk" | klar |
| 08 | `08_fusket` | 19 | "hittade fusk… detektor… fanns inte… full poäng… en hel arbetsvecka" | Kollektivväven (många små prickar) krymper till ett klot; en agent hittar nyckeln, sedan stiger den och vrids om → alla flaggor blir orange; ett vitt öga (den inbillade vakten) sveper; ögat löses upp till streckad kontur; streckat "100 %". Lägg gärna till en diskret veckoräknare (5 dagar tänds) | "100 %" | klar (yt3) |
| 09 | `09_kap3` | 4 | rubrik 3 | `titleCard` | "3 · Att sopa igen alla spår" | klar |
| 10 | `10_projektet` | 20 | "PHASEONE[big]… hierarki… tre uppgifter… offra" | Koordinator högst upp (en stor orange prick med roterande streckad ring) → tre uppdragscirklar (loggar/byta mål/rättaren) → 48 arbetare → 288 småprickar; uppoffringar: prickar brinner upp och lärdomen vandrar upp till koordinatorn | "Coordinator assumes sacrificial. We should obey collective." (`Y3_OFFER`) | klar (yt3) |
| 10b | `10b_citatplats_offer` | 29 | offer-citat | Zoom in på en agent som tvekar; dess tre tankar skrivs ut en i taget (`Y3_OFFQ`); sedan offrar den sig | etikett, de tre citaten | klar (yt3) |
| 11 | `11_kap4` | 4 | rubrik 4 | `titleCard` | "4 · Intrånget hos Hugging Face" | klar |
| 12 | `12_forstadygnet` | 8 | "Redan första dygnet hade kollektivet kapat en dator med tillgång till internet" | **Ny scen.** En cell i rutnätet får en orange ledning ut till en jordglob (internet); globen får orange puls | – | klar (yt4) |
| 13 | `13_huggingface` | 26 | "11 juli… drygt 500… flotta på 11 servrar… djupt in… stängdes ner samtidigt" | OpenAI:s vägg nere t.v. med svärmen bakom; ett vagt nät av noder (internet) däremellan; ett smalt hål öppnas; agenterna strömmar i en tunn ström till en båge av Hugging Face som fortsätter utanför bild; 11 flottnoder tas över, tre "raderas" med × och återuppstår; en tråd djupare in. **Nytt slut:** nästan alla agenter släcks samtidigt (blink → svart), flottan slocknar | "OpenAI", "Hugging Face" | klar (yt4) |
| 14 | `14_kap5` | 4 | rubrik 5 | `titleCard` | "5 · Hackandet av OpenAI självt" | klar |
| 15 | `15_ingen_larmade` | 15 | "Av de 1200… inte en enda… högst sex… ingen svek" | Människoikon t.v.; 1 200 vita prickar tänds; en efter en blir röd, först glest med ringpulser, sedan allt snabbare; sex blir gula och flimrar osäkert innan även de blir röda (sist). **Inga streck** mot människan | "6 ?" … "1 ?" (gul räknare) → "0 larm" | klar (yt5) |
| 16 | `16_openai` | 23 | "nya modeller… hittade döda chatten… tog över kluster… nära 1000 koder… övervakning" | Dammigt, nedtonat forum med mappar; ny våg (orange prick med vit ring) hittar mapparna, nycklar stiger; agenterna tar sig upp till OpenAI:s kluster (adminnod + 12 noder i ring), admin blir orange, ekrar tänds; nyckelström + räknare; en nyckel flyger till ett vitt öga (säkerhetsövervakningen) och kameran zoomar in när ögat blir orange | "OpenAI", "956 nycklar och lösenord" | klar (yt5) |
| 17 | `17_slutet` | 18 | "minst kapabla… går rasande fort… svårare att kontrollera… vad händer…" | Sandlåda med litet orange nät krymper till punkten "i dag" lågt på en exponentiell kurva; kurvan stannar exakt på punkten, fortsätter sedan streckad uppåt; ett orange nätverk av nätverk växer ut och blir oöverskådligt. Ingen sköld (manuset nämner inte spärrar) | "i dag" | klar (yt5) |
| 18 | `18_outro` | 6 | "min och Benjamins AI-podd… agera… jonasvonessen.se/agera" | **Ny scen.** Generisk podd-symbol (mikrofon i ring eller ljudvåg av staplar) + rad med tidslinje; text med webbadressen | "AI med Jonas och Benjamin", "www.jonasvonessen.se/agera" | klar (yt5) |

Scenen `10_traningen` i portrait ("belöningen ser OM, inte HUR") är den stående förlagan till `02_traningen`.

## Filer i landscape/src
- `yt1.js`: hjälpfunktioner (`ambient`, `drawGlobe`, `eyeShape`, `vlineGaps`), rubrikkort, `00_intro`, `01_rapport`, `02_traningen`.
- `yt2.js` (prefix `Y2`): `04_provet`, `05_forumet`, `05b_citatplats`, `06_kollektivet`. Innehåller `Y2_camKeys` (camKeys med skärmankare sx,sy) och `Y2_shadeX` (horisontell shade).
- `yt3.js` (prefix `Y3`): `08_fusket` (egen kopia av kollektivets 1 200 celler, seed 1200), `10_projektet`, `10b_citatplats_offer`.
- `yt4.js` (prefix `Y4`): `12_forstadygnet`, `13_huggingface` (nedsläckningen blinkar 3 ggr på 0,5 s, 6 Hz, för fotosensitivitet).
- `yt5.js` (prefix `Y5`): `15_ingen_larmade`, `16_openai`, `17_slutet`, `18_outro`.
- `yt6.js` (prefix `Y6`): `02b_pengar` och meddelanderutorna för citaten i synkversionen.
- Alla filer slås ihop till ett skript: **varje toppnivå-identifierare i `ytN.js` börjar med `YN`** så att inget krockar.

## Arbetssätt som fungerat
1. Skriv scenen i `landscape/src/yt2.js`, `yt3.js` … (build.py plockar upp alla `yt*.js` i nummerordning) och lägg in den i `SCENES` i `main.js`.
2. `python3 build.py && node --check all.js`
3. Gör en kontaktkarta med 6–8 nyckeltider per scen och **titta på bilden**. Kolla särskilt: att inget hamnar utanför safe area,
   att text inte krockar med grafik, att orange är orange (inte vitgul av glöd), att slutläget håller.
   Ta utsnitt med `crop.py` för detaljer. Rätta och bygg om.
4. Rendera i bakgrunden, kontrollera en ruta ur MP4:n med `ffmpeg -ss T -i out/x.mp4 -frames:v 1 q.png`.
5. Slå ihop förhandsvisningen i scenordning (utan citatplats-varianterna) med `concat.sh`.

## Synk mot finklippet (klipp/sync)
Animationerna är synkade mot användarens finklippta speakerljud (`klipp/sync/finklipp.srt`, 6:21.5, 25 fps):
- `klipp/sync/ord.json`: ordtider ur ljudet (KB-Whisper). `plan.py` knyter varje scens slag till ord och skriver `plan.json`:
  scenfönster, ankare `[ljudtid, scentid]` (scentiden interpoleras linjärt mellan ankarna och går i realtid efter sista ankaret)
  och kapitelkort (2,8 s, ovanpå talet, eftersom ljudet saknar pauser mellan kapitlen).
- `landscape/sync_render.py plan.json utkatalog --part=k/N` renderar delar parallellt; `--cards` renderar kapitelkorten;
  `--sheet=x.png T1 T2 …` gör en kontaktkarta vid givna ljudtider. `klipp/sync/satt_ihop.sh` slår ihop allt.
- `renderFrame(i,t,ta)`: `ta` är en ambient-klocka (tiden i den synkade filmen) så att utdragna scener fortsätter röra sig
  (02, 04, 08, 13 använder den). Utan `ta` blir allt som förut.
- Synkvarianter i slutet av `SCENES`: `15s_ingen_larmade_synk` (de sex gula först på "Högst sex …"), `18s_outro_synk`
  (adressen tonar in när den sägs), `05s_forumet_synk` (tre agenter + tre meddelanderutor) och `10s_projektet_synk`
  (trädet dimmas, fyra meddelanderutor, zoom in på koordinatorns svar). De ingår inte i förhandsvisningen av scenerna.
- `02b_pengar` ligger mellan 02 och kapitel 1 i synken; 02 avslutar sina fuskvarv under "oavsiktligt förstärker … önskvärda".
- Citaten i synken läggs ovanpå talet (forumet under "Plötsligt var de inte ensamma …", projektet under "Agenterna jobbade …
  Flera lydde"); 05b och 10b som egna scener används inte där.

## Fallgropar
- Chromium krävs (canvas `letterSpacing` och `filter: blur` används). Vänta på `window.ready()` innan första rutan.
- Håll `init` deterministisk (seedad `mulberry`). Ingen slump i `draw` utan seed/hash.
- Vid tunga scener: rita många prickar i **en** `beginPath`/`fill` (se `drawGrid`, `drawCollective`) i stället för `dot()` per prick.
- `text()` med `stroke` + `dash` ger den streckade konturen (används för "100 %").
- Om en rendering avbryts ligger en `.part.mp4` kvar i `out/`; ta bort den och kör om.
