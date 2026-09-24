// ============================================================
//  YOUTUBE 16:9 — shared helpers + scenes 00–02 + title cards
// ============================================================
const CX=960,CY=540;
function ambient(t,n=70,a=1){for(let i=0;i<n;i++){const d=.4+hash2(i,23),bx=(hash2(i,3)*1960+t*7*d)%1960-20,by=hash2(i,9)*1080,ph=hash2(i,17)*TAU;dot(bx,by,1.2+d*1.5,{a:a*(.10+.06*Math.sin(t*1.5+ph)),e:0});}}
function drawGlobe(x,y,s,a,p=1){if(a<=0)return;icon('globe',x,y,s,2.8,{a,p,e:.2});}
function eyeShape(x,y,w,h,open,lw,o={}){const hh=h*open;D(o.c||WH,o.a??1,o.e,k=>{k.strokeStyle=o.c||WH;k.lineWidth=lw;k.lineCap='round';k.lineJoin='round';k.setLineDash(o.dash||[]);k.beginPath();k.moveTo(x-w/2,y);k.quadraticCurveTo(x,y-hh,x+w/2,y);k.quadraticCurveTo(x,y+hh,x-w/2,y);k.closePath();k.stroke();k.setLineDash([]);});}
function vlineGaps(x,y0,y1,gaps,lw,o){let segs=[[y0,y1]];for(const [a,b] of gaps){const ns=[];for(const [s,e] of segs){if(b<=s||a>=e){ns.push([s,e]);continue;}if(a>s)ns.push([s,a]);if(b<e)ns.push([b,e]);}segs=ns;}for(const [s,e] of segs)if(e-s>1)line(x,s,x,e,lw,o);}

// ---------- title card ----------
function titleCard(t,num,lines){
  ambient(t,60,1);
  const inn=E.ob(seg(t,.12,.85)),nS=300,tS=84,gap=40;
  const nW=textW(num,nS,'BigShoulders',700);let tW=0;lines.forEach(l=>tW=Math.max(tW,textW(l,tS,'BigShoulders',700)));
  const total=nW+gap+3+gap+tW,x0=CX-total/2;
  text(num,x0,CY+nS*.35,nS,{c:OR,al:'left',a:inn,e:1});
  const rx=x0+nW+gap,half=lines.length*tS*.56+8,rp=E.io(seg(t,.45,1.35));
  line(rx,CY-half,rx,CY+half,3,{a:.55*rp,e:.2});
  const bl0=CY-(lines.length-1)*tS*.56+tS*.34;
  lines.forEach((l,i)=>{const p=E.io(seg(t,.6+i*.16,1.3+i*.16));text(l,rx+gap,bl0+i*tS*1.02,tS,{c:WH,a:p});});
  ringPulse(x0+nW*.5,CY-nS*.16,t,.3,1.4,60,260,2,{c:OR,a:.4});
}
function s_kap1(t){titleCard(t,'1',['Ett \u2019omöjligt\u2019','uppdrag']);}
function s_kap2(t){titleCard(t,'2',['Ett kollektivt','fusk']);}
function s_kap3(t){titleCard(t,'3',['Att sopa igen','alla spår']);}
function s_kap4(t){titleCard(t,'4',['Intrånget hos','Hugging Face']);}
function s_kap5(t){titleCard(t,'5',['Hackandet av','OpenAI självt']);}

// ============================================================
// 00  Intro: stjärnfält -> en enda prick                       (5 s)
// ============================================================
let S_IN;
function s_introInit(){const r=mulberry(11);S_IN={stars:[],hero:{sx:1210,sy:640}};
  for(let k=0;k<180;k++){const sx=r()*1920,sy=r()*1080,d=.4+r();S_IN.stars.push({sx,sy,d,vx:(r()-.5)*16*d,vy:(r()-.5)*12*d,r0:1.7+d*2.4,ph:r()*TAU});}}
function s_intro(t){
  const fin=E.o(seg(t,0,.9));
  for(const s of S_IN.stars){const gone=seg(t,2.4,3.4);if(gone>=1)continue;const tw=.6+.4*Math.sin(t*2.6+s.ph);dot(s.sx+s.vx*t,s.sy+s.vy*t,s.r0,{a:fin*tw*(1-gone),e:.14});}
  const H=S_IN.hero,k=E.io(seg(t,2.2,3.9));
  dot(lerp(H.sx,CX,k),lerp(H.sy,CY,k),lerp(4.4,70,k),{a:fin*lerp(.7+.3*Math.sin(t*2.6),1,k),e:.2});
  ringPulse(CX,CY,t,3.85,1.5,80,300,2.6,{a:.6});
}

// ============================================================
// 01  Den oberoende rapporten blir offentlig                   (9 s)
// ============================================================
let S_RP;
function s_rapportInit(){const r=mulberry(37);S_RP={rows:[]};const flags=new Set([2,5,8]);
  for(let i=0;i<10;i++)S_RP.rows.push({w:[672,912,576,840,744,648,864,600,792,720][i],flag:flags.has(i)});}
function s_rapport(t){
  const cx=CX,cy=550,pw=1500,ph=800;
  const app=E.ob(seg(t,0,.8));rrect(cx,cy,pw*app,ph*app,20,3.2,{a:.92,e:.12,p:E.io(seg(t,0,.7))});
  if(app<.6)return;
  const hp=seg(t,.5,1.1);line(cx-pw/2+18,cy-ph/2+52,cx+pw/2-18,cy-ph/2+52,2,{a:.4*hp,e:0});
  for(let k=0;k<3;k++)dot(cx-pw/2+34+k*16,cy-ph/2+26,4,{a:.6*hp,e:0});
  text('OBEROENDE RAPPORT',cx-pw/2+180,cy-ph/2+36,32,{a:hp*.7,wt:400,ls:3,e:0});
  const top=cy-ph/2+112,bot=cy+ph/2-44,scanY=lerp(top-14,bot,E.ioq(seg(t,1.4,5.2)));
  S_RP.rows.forEach((row,i)=>{const ry=top+i*62,rp=E.io(seg(t,.9+i*.05,1.6+i*.05));if(rp<=0)return;
    const rev=row.flag?clamp((scanY-ry)/44):0;const c=rev>.5?OR:WH,al=lerp(.85,1,rev);
    line(cx-pw/2+58,ry,cx-pw/2+58+row.w*rp,ry,10,{c,a:al,e:rev>.5?rev:.12});
    if(row.flag&&scanY>ry-4&&scanY<ry+34)ringPulse(cx-pw/2+58+row.w,ry,t,0,1,6,26,2.4,{c:OR,a:.9});});
  if(t>1.3&&t<5.4){const a=Math.pow(Math.sin(seg(t,1.4,5.2)*Math.PI),.4);
    D(OR,a*.85,.6,k=>{const g=k.createLinearGradient(0,scanY-150,0,scanY);g.addColorStop(0,'rgba(255,106,0,0)');g.addColorStop(1,'rgba(255,106,0,.16)');k.fillStyle=g;k.fillRect(cx-pw/2+20,scanY-150,pw-40,150);});
    line(cx-pw/2+20,scanY,cx+pw/2-20,scanY,3,{c:OR,a});line(cx-pw/2+20,scanY,cx+pw/2-20,scanY,1.2,{c:HOT,a});
    ring(cx+pw/2-70,scanY,20,3,{c:OR,a});line(cx+pw/2-56,scanY+14,cx+pw/2-44,scanY+26,3,{c:OR,a});}
}

// ============================================================
// 02  Träningen: belöningen ser OM, inte HUR                   (20 s)
// ============================================================
const S_TR={S:[290,540],G:[1640,540],wallX:[660,1000,1340],gaps:[300,780,300],
  honest:[[290,540],[520,540],[520,300],[840,300],[840,780],[1160,780],[1160,300],[1480,300],[1480,540],[1640,540]],
  t0:[6.2,7.8,8.7,9.45,10.05,10.6,11.05,11.45,11.8,12.1],du:[1.25,.72,.6,.5,.45,.4,.35,.3,.28,.25]};
function s_traningen(t,ta=t){
  const [sx,sy]=S_TR.S,[gx,gy]=S_TR.G,firstBreach=6.2;
  const nCheat=S_TR.t0.filter((q,k)=>t>=q+S_TR.du[k]).length;
  // barriers, with holes where the shortcut punched through at y=540
  S_TR.wallX.forEach((x,k)=>{const gp=S_TR.gaps[k],p=E.io(seg(t,.1+k*.12,.9+k*.12)),u=(x-sx)/(gx-sx),tb=firstBreach+1.2*u;
    const gaps=[[gp-48,gp+48]];if(t>=tb)gaps.push([sy-36,sy+36]);
    vlineGaps(x,200,826,gaps,9,{a:.94,p,cap:'butt',e:.15});
    if(t>=tb){const f=seg(t,tb,tb+.7);if(f<1){for(let q=0;q<7;q++){const an=-2.4+q*.28,dd=E.o(f)*(52+q*10);rrect(x+Math.cos(an)*dd,sy+Math.sin(an)*dd,10,6,1,0,{a:1-f,fill:WH});}ringPulse(x,sy,t,tb,.6,10,80,3.2,{c:OR});}}});
  // the intended (honest) route
  const ha=lerp(.62,.12,clamp(nCheat/6));poly(S_TR.honest,3,{a:ha,p:E.io(seg(t,.3,1.4)),dash:[7,12],e:0});
  S_TR.honest.slice(1,-1).forEach((q,k)=>{const cp=E.ob(seg(t,.5+k*.08,.9+k*.08));rrect(q[0],q[1],18*cp,18*cp,3,2.4,{a:lerp(.7,.15,clamp(nCheat/6)),fill:'#000'});});
  // the shortcut, thicker each time it pays off
  if(t>firstBreach){const pp=seg(t,firstBreach,firstBreach+.9);line(sx,sy,gx,gy,Math.min(20,4+nCheat*1.7),{c:OR,a:.95,p:nCheat>0?1:pp});}
  // goal + the measured circle
  const fp=E.io(seg(t,.2,1.1));ring(gx,gy,120,2.8,{a:.6*fp,dash:[6,13],a0:ta*.25,a1:ta*.25+TAU,e:0});
  icon('pole',gx+16,gy-12,178,4.4,{a:fp,p:fp,e:.15});icon('pennant',gx+16,gy-12,178,4.4,{a:fp,p:fp,e:.15,fill:'rgba(255,255,255,.13)'});
  dot(sx,sy,10,{a:.5*fp,e:0});ring(sx,sy,24,2,{a:.4*fp,e:0});
  // labels: OM is measured, HUR is not
  const la=E.io(seg(t,1.4,2.2));
  // rewards: honest and cheat both reinforced
  const rew=[{t:5.0,c:WH}].concat(S_TR.t0.map((q,k)=>({t:q+S_TR.du[k],c:OR})));
  rew.forEach((r,k)=>{const u=seg(t,r.t,r.t+1.0);if(u>0&&u<1)text('+1',gx-170,gy-70-80*E.o(u),lerp(90,124,E.ob(Math.min(1,u*3))),{c:r.c,a:1-E.i(u),al:'center',e:r.c===WH?.3:1});
    if(u>0){const bp=E.ob(seg(t,r.t,r.t+.3));rrect(150+k*40,300,22,70*bp,4,0,{c:r.c,fill:r.c,a:1});}});
  // the honest runner, then repeated cheat runs
  if(t>=.9&&t<5.0){const p=seg(t,.9,5.0),h=polyAt(S_TR.honest,p);poly(S_TR.honest,6,{a:.9,p0:Math.max(0,p-.09),p,e:.4});dot(h[0],h[1],15,{e:.6});}
  else if(t<.9||(t>=5.0&&t<firstBreach)){dot(sx,sy,15*E.ob(seg(t,.2,.6)),{c:t<5?WH:HOT,e:.6});}
  S_TR.t0.forEach((q,k)=>{const u=seg(t,q,q+S_TR.du[k]);if(u>0&&u<1){const x=lerp(sx,gx,u),y=lerp(sy,gy,u);line(sx,sy,gx,gy,6,{c:HOT,a:.9,p0:Math.max(0,u-.2),p:u});dot(x,y,15,{c:OR});dot(x,y,7,{c:HOT});}});
  if(t>=firstBreach&&!S_TR.t0.some((q,k)=>t>=q&&t<q+S_TR.du[k]))dot(sx,sy,15,{c:OR});
}
