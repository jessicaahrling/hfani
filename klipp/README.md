# Grovklipp av speakertagningen

Hela tagningen (23:42) är nedklippt till **50 klipp, 6:42** inklusive luckor för kapitelkort och citat.
För varje mening i manuset är det **sista kompletta försöket** som används. Stakningar och
omstarter mitt i en rad är bortklippta, och alla in- och utpunkter ligger i tystnad
(kontrollerat mot ljudnivån, med ca 0,1 s förrulle och 0,2 s svans).

## Filer

| Fil | Vad |
|---|---|
| `premiere/<fps>/grovklipp.xml` | Sekvensen för Premiere (Final Cut Pro 7-XML). **Använd den här.** |
| `premiere/<fps>/grovklipp.edl` | Samma klipp som EDL, reserv om XML-importen krånglar. Förutsätter att filens tidkod börjar på 00:00:00:00. |
| `klipplista.md` | Alla 50 klipp: plats i sekvensen, in/ut i originalfilen, vad som sägs. |
| `grovklipp_lyssna.mp3` | Samma klippning som ljud, för att lyssna igenom innan du öppnar Premiere. |

## Så importerar du

1. **Kolla bildfrekvensen** på videofilen. I Premiere: högerklicka klippet i projektpanelen, välj *Egenskaper*, och läs av fps.
   Välj mappen i `premiere/` som matchar (t.ex. `25fps`, `29_97fps`, `30fps`, `60fps`).
2. *Arkiv → Importera* och välj `grovklipp.xml`. En ny sekvens, *Grovklipp NN fps*, dyker upp i projektet.
3. Klippen visas som offline. Högerklicka ett av dem, välj *Länka media* och peka ut din videofil. Alla 50 klipp länkas på en gång.
4. Om videofilens ljud är mono: ta bort spår A2.

I sekvensen finns **markörer** med scen-id:t för varje animation (`00_intro`, `04_provet` …), så du ser var varje MP4 i
`landscape/out/` hör hemma. Det finns också **luckor**: 4 s där kapitelkorten ska in, och 6 s efter
”… något stort på gång” där citaten ska in (`05` OH MY GOD och/eller `05b` Whoa + Excitement).

## Lyssna extra på de här

Tider i originalfilen (mm:ss). Klippnummer som i `klipplista.md`.

1. **08:22, klipp 17: ”över 70 000 meddelanden”.** SRT-filen hörde ”medlemmar”. Faktauppgiften är meddelanden, och det finns ingen annan komplett tagning.
2. **09:22, klipp 20: ”Det fanns egentligen *ingen* sådan detektor”.** SRT-filen saknar ”ingen”. Taligenkänningen hör det, men om ordet fattas vänds betydelsen.
3. **01:46, klipp 1: ”mer och mer känns som”.** Kan ha en liten tvekan före ”känns”. Alternativ: det tidigare försöket vid 01:30.
4. **04:48–04:58, klipp 7–8: exempelmeningen om 500 kronor.** Skarvad inom samma tagning, med det avbrutna ”så kan det antingen …” vid 04:52 bortklippt. Lyssna att skarven låter naturlig.
5. **07:06, klipp 13: ”för att hitta svaret på problem”.** De tre tidigare försöken säger ”lösa problem”.
6. **13:32, klipp 29: ”De *skulle* hacka sig in …”.** Försöket vid 13:28 säger ”De *ville* …”, vilket ligger närmare manuset.
7. **17:52, klipp 37: ”Man vet fortfarande inte varför, men det kan ha varit så att …”.** Ett nytt tillägg. Versionen närmast manuset (”Kanske för att någon på OpenAI …”) finns vid 17:45.
8. **22:27–22:34, klipp 46–47: ”… mycket svårare att övervaka”.** Försöket vid 21:56 säger ”överblicka” som i manuset.
9. **23:07, klipp 49: webbadressen.** Kontrollera att ”von Essen” hörs tydligt. ”I AI-frågan” är utelämnat i den här tagningen.
10. **19:38, klipp 40: ”Instanserna av den verkade vara mer kapabla”.** Faktanoten i manuset säger att ”mer kapabel” inte står i rapporten.

Tillagda meningar som finns med för att de var med i din sista tagning: ”och jag kommer göra samma sak nästa gång” (05:18),
”De ville sopa igen sina spår” (11:17) och ”Agenterna jobbade som en stor grupp” (11:59; utan den finns versionen vid 11:42).

## Hur valen gjordes

SRT-filen ger strukturen (alla försök och omstarter). En svensk taligenkänning (KB-Whisper) med ordtider ger vad som
faktiskt sägs, och ljudnivån i 10 ms-steg ger pauserna. Tagningsvalen gjordes avsnitt för avsnitt och granskades en
andra gång. 13 klipppunkter är handsatta i pausen mellan orden:
11 trimningar mitt i en rad och 2 gränsfall (`work/overrides.json`).
Allt kan byggas om med `python3 work/build_cut.py` efter ändringar i `work/picks_final.json` eller `work/overrides.json`.
