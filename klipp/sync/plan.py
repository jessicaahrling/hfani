# Bygger synkplanen (plan.json) för finklippet: scenfönster, ankare (ljudtid -> scentid) och kapitelkort.
# Ankarna knyts till ord i ljudet (ord.json från KB-Whisper) så att varje scens slag hamnar på rätt ord.
import json,re
W=json.load(open('ord.json'));n=lambda s:re.sub(r'[^a-zåäö0-9]','',s.lower())
def w(word,after,end=False):
    """tid för första förekomsten av ordet (prefixmatchning) efter tiden 'after'"""
    for x in W:
        if x['s']>=after-.05 and n(x['w']).startswith(n(word)):return x['e'] if end else x['s']
    raise SystemExit(f'hittar inte "{word}" efter {after}')
DUR=381.53;CARD=2.8
seg=[];cards=[]
def S(scene,start,anchors):seg.append({'scene':scene,'start':round(start,3),'anchors':[[round(a,3),round(b,3)] for a,b in anchors]})
def K(scene,start):cards.append({'scene':scene,'start':round(start,3),'dur':CARD})
# 00 intro: stjärnfält -> en prick, på 'Vi lever i en värld … science fiction-film'
S('00_intro',0,[(0,0),(w('Förra',0)-.2,4.7)])
# 01 rapporten: skannern sveper långsamt, de flaggade raderna blir orange på 'Detaljerna var obehagligare'
t=w('Förra',0)-.2;S('01_rapport',t,[(t,0),(w('rapporten',t),1.4),(w('Detaljerna',t),2.3),(w('tro',w('Detaljerna',t),True),5.2)])
# 02 träningen
t=w('När',19)-.15
S('02_traningen',t,[(t,0),(w('vill',t),.9),(w('förstärker',w('När',24)),5.0),(w('Problemet',t),5.4),(w('Därför',30),5.9),
   (w('oavsiktligt',37),6.2),(w('beteenden',38),7.45),(w('önskvärda',41,True)+.2,12.4)])
# 02b pengarna: 500 kr för ett A, plugga (vit väg) eller fuska (orange), båda belönas och görs igen
t=w('Om',43)-.2
S('02b_pengar',t,[(t,0),(w('kr',45,True),1.2),(w('A',45.5),2.4),(w('pluggar',48),4.4),(w('provet',49.5)+.5,7.0),(w('eller',50.5),7.4),
   (w('fuskar',51.5),8.2),(w('kompis',53),9.1),(w('Om',54),11.4),(w('förstärka',56),12.8),(w('gör',58.5,True),14.6),(w('samma',59.5),16.8),(w('gång',60.5,True),19.0)])
# kapitel 1
k1=w('OpenAI',61)-.3;K('03_kap1',k1)
S('04_provet',k1,[(k1+CARD,0),(w('tiotusentals',77),3.0),(w('parallellt',80,True),6.418),(w('Var',85),6.9),(w('testmiljö',86,True),11.1),(w('omkring',90,True)+.2,14.7)])
t=w('En',92.5)-.2
S('05s_forumet_synk',t,[(t,0),(w('lösa',93,True),2.9),(w('hitta',95),5.2),(w('låter',98),7.2),(w('stoppa',99,True)+.2,8.8),(w('En',101.5),9.2),
   (w('upptäckte',105),10.0),(w('mapp',109),10.4),(w('meddelandet',110),11.2),(w('namn',111,True),11.7),(w('När',115),12.6),
   (w('insåg',116),15.6),(w('gång',118,True),16.6),(w('gång',118,True)+.3,17.2)])
t=w('slut',128)-.1;S('06_kollektivet',t,[(t,.4),(w('70',127),3.4),(w('meddelanden',128,True),6.0),(w('1200',130),6.6),
   (w('agenter',131,True),7.2),(w('kollektivet',133),8.2)])
# kapitel 2
k2=w('Efter',136)-.25;K('07_kap2',k2)
S('08_fusket',k2,[(k2+CARD,.9),(w('fuska',139,True),2.3),(w('cybertestet',140,True),3.4),(w('riktigt',143,True),4.6),(w('delade',144),5.05),
   (w('agenterna',146,True),6.3),(w('anledning',147),6.6),(w('detektor',152),7.8),(w('fusk',154,True),10.3),(w('Det',156),11.3),
   (w('detektor',157,True),13.0),(w('full',160),14.4),(w('Men',163),15.0),(w('pågick',170),15.1),(w('arbetsvecka',172,True),16.9)])
# kapitel 3
k3=w('En',174)-.25;K('09_kap3',k3)
S('10s_projektet_synk',k3,[(k3+CARD,0),(w('koordinera',178),.9),(w('hierarki',181),1.8),(w('uppgifter',185,True),3.6),(w('Det',187),4.4),
   (w('Det',196),7.0),(w('Det',201),9.6),(w('Agenterna',205),12.4),(w('jobbade',205.5),13.4),(w('lydde',215,True),24.2)])
# kapitel 4
k4=w('Flera',214,True)+.08;K('11_kap4',k4)
S('12_forstadygnet',k4,[(k4+CARD,1.0),(w('tillgång',218),2.8),(w('internet',219,True)+.1,4.9)])
t=w('Hugging',228)-.2
S('13_huggingface',t,[(t,0),(w('språkmodeller',230,True),2.0),(w('kriminella',254)-.5,3.8),(w('kriminella',254),4.0),(w('Den',261),7.4),
   (w('Face',268,True),13.0),(w('Agentssvärmen',270),14.2),(w('olika',273,True),18.0),(w('snabbt',276),18.6),(w('databåsar',278,True),21.0),
   (w('hänvisades',284),22.6)])
# kapitel 5
k5=w('Av',295)-.3;K('14_kap5',k5)
S('15s_ingen_larmade_synk',k5,[(k5+CARD,.6),(w('pågick',306,True),5.2),(w('Högst',307.5),5.4),(w('tanken',309,True),7.4),(w('Ingen',311),8.0),(w('kollektivet',312,True),9.8)])
t=w('Historien',313)-.15
S('16_openai',t,[(t,.3),(w('Ett',316),1.0),(w('Instanserna',319),2.5),(w('hittade',322),3.0),(w('byggde',325),5.3),(w('där',327,True),7.0),
   (w('hacka',329),8.5),(w('själva',330,True),9.8),(w('forskningskluster',333,True),11.2),(w('läste',334),11.6),(w('säkerhetskoder',337,True),14.6),
   (w('Bland',338.5),15.0),(w('OpenAI',339),15.8),(w('övervakning',340),17.2),(w('den',341.5),18.4),(w('cybersäkerhetsbrott',342,True),19.4)])
t=w('Den',345)-.2
S('17_slutet',t,[(t,1.0),(w('idag',345),3.4),(w('kapabla',346),5.0),(w('ha',349,True),5.8),(w('Utvecklingen',350),6.4),(w('fart',352,True),8.9),
   (w('Ju',353),9.0),(w('dem',361,True),13.0),(w('övervaka',366,True),16.0)])
t=w('I',367.5)-.2
S('18s_outro_synk',t,[(t,0),(w('podd',369),1.3),(w('prata',370),2.2),(w('agera',375),3.4),(w('agera',378),4.2)])
json.dump({'fps':25,'dur':DUR,'crf':18,'segments':seg,'cards':cards},open('plan.json','w'),ensure_ascii=False,indent=1)
f=lambda t:f"{int(t//60)}:{t%60:05.2f}"
for s in seg:
    A=s['anchors'];bad=[i for i in range(1,len(A)) if not(A[i][0]>A[i-1][0] and A[i][1]>=A[i-1][1])]
    sp=[round((A[i][1]-A[i-1][1])/(A[i][0]-A[i-1][0]),2) for i in range(1,len(A))]
    print(f"{f(s['start'])} {s['scene']:24s} ankare {len(A):2d}  fart {min(sp) if sp else '-'}–{max(sp) if sp else '-'} {'FEL ORDNING '+str(bad) if bad else ''}")
print('kort:',[(c['scene'],f(c['start'])) for c in cards])
