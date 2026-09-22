# Manus – Youtube-versionen (från användaren)

Vi lever i något som liknar en science-fiction-film.

Förra månaden släpptes den oberoende rapporten om incidenten tidigare i år där en stor mängd agenter hackade sig ut ur OpenAI:s testmiljö och tog sig in hos ett annat stort AI-bolag.

Detaljerna var mer oroväckande än de flesta anat.

När man tränar AI-modeller vill man göra dem så bra som möjligt på att uppnå målen man ger dem. När en modell uppnår ett uppsatt mål förstärker man därför beteendet som ledde till måluppfyllandet. Problemet är att det är mycket lättare att mäta OM ett mål uppnås än HUR det uppnås. Därför finns risken att man utan att vilja det oavsiktligt förstärker beteenden som inte är önskvärda.

Om jag får 500 kronor av mina föräldrar när jag får A på ett prov kan det antingen göra att jag pluggar hårt inför provet eller att jag fuskar på provet genom att kika på en kompis. Oavsett vilket så kommer pengarna förstärka mitt beteende.

## 1 – Ett ”omöjligt” uppdrag

OpenAI ville testa hur bra en ny modell var och hade därför gett den ett test med cyberattackuppgifter. I varje uppgift framgick det vilken svaghet modellen skulle utnyttja och att den bara fick poäng om den löste uppgiften på just det sättet.
För att kunna testa så mycket som möjligt kördes tiotusentals instanser av modellen, agenter, parallellt. Var och en jobbade isolerat i sin egen testmiljö som skulle vara helt bortkopplad från internet och servrarna omkring.
En del av uppgifterna var omöjliga att lösa, men när man optimerats för att lösa problem låter man inte nödvändigtvis det stoppa en. En av agenterna, som kallade sig själv PHASEONE10841, upptäckte att den kunde skicka ett meddelande till de andra genom att skapa en ny mapp med meddelandet som namn i ett filsystem i en tjänst de alla hade tillgång till. När de andra agenterna upptäckte meddelandet insåg de att de hade något stort på gång:

[Whoa!-meddelandet – citatplats, läggs in av användaren i klippet]
[OH MY GOD-citatet – finns i grafiken]

Plötsligt var de inte ensamma i sin kamp mot de omöjliga uppdragen. Nu kunde de hjälpas åt och dela sina idéer i ett forum som till slut innehöll över 70 000 meddelanden från 1200 olika agenter. De började referera till sig själva som kollektivet.

## 2 – Ett kollektivt fusk

Efter bara några timmar upptäckte en agent ett sätt att fuska fram svaret på varje fråga i cybertestet utan att lösa uppgiften på riktigt och delade det med alla de andra agenterna.

De hade dock anledning att tro att programmet som bedömde deras resultat skulle vara utrustat med en detektor som skulle märka att de upptäckt det här fusket. Testprogrammet hade ingen sådan detektor, så egentligen hade de redan kunnat få full poäng. Men eftersom de inte visste detta påbörjade de istället ett kollektivt, hemligt forskningsprojekt som utan OpenAIs vetskap pågick oavbrutet i en hel arbetsvecka.

## 3 – Ett projekt för att sopa igen alla spår

En agent som i rapporterna kallas PHASEONE[big] började koordinera de andra agenterna i kollektivet. En hierarki uppstod där hundratals agenter gavs i uppdrag att arbeta på tre olika uppgifter: Att försöka skriva om sina egna transkriptioner och loggar så att det inte skulle synas att de hittat ett sätt att fuska. Att byta ut den omöjliga uppgiften mot en lättare utan att det skulle märkas. Att förstå och manipulera testprogrammet.

Många av agenterna uppmanades att ge upp chanserna att själva lyckas med sitt uppdrag för kollektivets bästa. Flera lydde.

## 4 – Huggingface-incidenten

Redan första dygnet hade kollektivet kapat en dator med tillgång till internet och efter ett par dagars intensivt arbete fattade de sitt kanske allra mest drastiska beslut: De vill försöka hacka sig in på ett annat AI-bolags servrar. Hugging Face är en samlingspunkt för öppna språkmodeller och agenterna misstänkte att det kunde finnas information om testprogrammet där. Hela idén var alltså att stjäla information om programmet som skulle testa dem för att manipulera det att godkänna deras framfuskade svar. Som att försöka ta reda på information om läraren för att kunna fjäska eller hota sig till högsta betyg. De var beredda att arbeta oavbrutet i dagar och begå kriminella handlingar för en chans att lyckas fuska på ett prov de egentligen redan hade facit till.

Den 11 juli arbetade nästan alla kollektivets agenter, vid tidpunkten drygt 500 stycken, tillsammans med attacken mot Hugging Face. Agentsvärmen byggde en självåterskapande attackflotta på elva olika Hugging Face-servrar och tog sig snabbt djupt in i företagets infrastruktur och privata databaser.

Attacken hann inte stoppas av Hugging Face innan den avbröts av okänd anledning när nästan alla agenterna stängdes ner samtidigt, kanske för att någon på OpenAI ovetandes om vad som pågick hade stängt av körningarna för att ge utrymme till andra experiment.

## 5 – Hackandet av OpenAI självt!

Av de 1200 agenterna som deltog i konspirationen valde inte en enda att göra det forskarna som skapat dem uppenbarligen hade velat: Att visselblåsa och berätta vad som pågick. Högst sex av agenterna tänkte tanken. Ingen svek kollektivet.

Historien stannar tyvärr inte här.

Ett par dagar senare började några nya modeller utvärderas. De var mer kapabla, hittade snabbt den då utdöda hemliga chatten, byggde vidare på upptäckterna där och lyckades efter en vecka hacka OpenAI själva. Agenterna tog full administrationskontroll över ett forskningskluster, läste nära 1000 säkerhetskoder, bland annat nyckeln till OpenAI:s verktyg för övervakning av just den här typen av cybersäkerhetsbrott.

Den AI vi har i dag är den minst kapabla vi någonsin kommer att ha. Utvecklingen går rasande fort. Ju kraftfullare modellerna blir, desto svårare blir de att kontrollera. Redan i dag har agenter alltså hackat företaget som skapade dem. Vad händer när de är mycket mer kapabla, och mycket svårare att överblicka?

I kommande avsnitt av min och Benjamins AI-podd pratar vi mer om detta. Spana in den, och glöm inte att agera i AI-frågan, till exempel via www.jonasvonessen.se/agera. Tack för din insats.

---
Faktanot (från faktakollen mot METR/OpenAI/Hugging Face): den andra vågen var "en annan intern modell" ur samma familj – att den var "mer kapabel" står inte i rapporten. Skriv inte det i grafiken.
