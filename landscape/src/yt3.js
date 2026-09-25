// ============================================================
//  YOUTUBE 16:9 — yt3: 08_fusket, 10_projektet, 10b_citatplats_offer
//  All top-level identifiers are prefixed Y3.
// ============================================================
const Y3S={};
const Y3_bez=(p0,p1,p2,u)=>{const v=1-u;return [v*v*p0[0]+2*v*u*p1[0]+u*u*p2[0],v*v*p0[1]+2*v*u*p1[1]+u*u*p2[1]];};
// the ~1 200-member collective (same algorithm + seed as portrait s04init, so the picture is identical)
function Y3_cellsInit(){const r=mulberry(1200);const first=[[0,0],[1,0],[-2,1],[2,0],[-1,1],[0,1]];const map=new Map(),cells=[];
  first.forEach(([i,j])=>{map.set(ckey(i,j),-1);cells.push({i,j,d:0});});
  while(cells.length<1200){const rr=70*Math.pow(r(),.62),th=r()*TAU,i=Math.round(rr*Math.cos(th)),j=Math.round(rr*Math.sin(th)-2.5);if(inPlaza(i,j)||map.has(ckey(i,j)))continue;
    map.set(ckey(i,j),0);cells.push({i,j,d:Math.hypot(i,j+2.5)+r()*9});}
  const rest=cells.slice(6).sort((a,b)=>a.d-b.d);rest.forEach((c,k)=>{c.tj=.35+5.9*Math.pow((k+1)/rest.length,1/2.1);});
  cells.slice(0,6).forEach(c=>c.tj=-1);
  Y3S.cells=cells.slice(0,6).concat(rest);Y3S.cells.forEach(c=>{c.x=c.i*100;c.y=c.j*100;c.ph=r();map.set(ckey(c.i,c.j),c.tj);});Y3S.map=map;}
// the collective as it looks at the end of scene 06: tiny members, links to the hub, messages in flight
function Y3_drawCollective(t,a,dpx){const hx=HUB.x,hy=HUB.y+40;
  for(const k of [M,B]){k.save();k.globalCompositeOperation='lighter';k.strokeStyle=OR;k.lineWidth=px(1.15);k.lineCap='round';k.setLineDash([]);k.globalAlpha=(k===M?.10:.06)*a;
    for(let g=0;g<10;g++){k.beginPath();for(let q=g;q<Y3S.cells.length;q+=10){const c=Y3S.cells[q];k.moveTo(c.x,c.y);k.lineTo(hx,hy);}k.stroke();}k.restore();}
  const ms=px(2.5);for(const k of [M,B]){k.fillStyle=HOT;k.globalAlpha=(k===M?.95:.8)*a;k.beginPath();for(const c of Y3S.cells){const P=1.1+2.3*c.ph,f=(t/P+c.ph)%1;k.rect(lerp(c.x,hx,f)-ms/2,lerp(c.y,hy,f)-ms/2,ms,ms);}k.fill();}
  const ds=px(dpx);for(const k of [M,B]){k.fillStyle=OR;k.globalAlpha=a;k.beginPath();for(const c of Y3S.cells)k.rect(c.x-ds/2,c.y-ds/2,ds,ds);k.fill();}
  dot(HUB.x,HUB.y,px(9),{c:HOT,a});for(let k=0;k<3;k++){const q=((t*.55)+k/3)%1;ring(HUB.x,HUB.y,px(lerp(10,230,q)),px(1.8),{c:OR,a:a*.5*Math.pow(1-q,1.6)});}}

// ============================================================
// 08  Fusket: nyckeln och vakten som inte fanns                 (18 s)
//     collective ball LEFT (480,640) · flags 3x4 RIGHT around (1360,600) · eye (1360,230)
// ============================================================
const Y3F={BX:480,KX:1360,KY:600,EX:1360,EY:230,RX:860,RY:600};
function Y3_fusketInit(){Y3_cellsInit();const r=mulberry(55);const {KX,KY,EX,EY}=Y3F;
  Y3S.flags=[];for(let q=0;q<3;q++)for(let c=0;c<4;c++){const x=KX+(c-1.5)*190,y=450+q*150;Y3S.flags.push({x,y,d:Math.hypot(x-KX,y-KY)});}
  Y3S.conv=[];for(let k=0;k<36;k++){const a=r()*TAU;Y3S.conv.push({a,d:120+r()*140,t0:1.5+r()*.5});}
  Y3S.eye=[];const w=480,h=160;
  for(let u=0;u<=1;u+=1/46){for(const sgn of [-1,1]){const x=(1-u)*(1-u)*(EX-w/2)+2*(1-u)*u*EX+u*u*(EX+w/2),y=(1-u)*(1-u)*EY+2*(1-u)*u*(EY+sgn*h)+u*u*EY;Y3S.eye.push({x,y,vx:(r()-.5)*90,vy:-10-r()*45,d:r()*.5});}}
  for(let k=0;k<40;k++){const a=k/40*TAU;Y3S.eye.push({x:EX+Math.cos(a)*56,y:EY+Math.sin(a)*56,vx:Math.cos(a)*60+(r()-.5)*40,vy:Math.sin(a)*30-35*r(),d:r()*.4});}}
function Y3_fusket(tt,ta=tt){
  const {BX,KX,KY,EX,EY,RX,RY}=Y3F,t=tt-1.2;   // tt = scene time; t = the portrait clock, shifted for the finder sequence
  const scan=E.io(seg(t,6.8,7.4))*(1-E.io(seg(t,12.4,13.4)));
  const zp=E.io(seg(tt,0,1.5)),hy=lerp(560,640,zp);
  setCam(HUB.x,HUB.y,Math.exp(lerp(Math.log(.11),Math.log(.034),zp))*(1-.16*scan),BX,hy);
  if(tt<.5)drawGrid(tt+100,{a:1-seg(tt,0,.5),joined:Y3S.map});
  Y3_drawCollective(ta,lerp(1,.5,scan),lerp(6,2.8,zp));
  resetCam();
  // one of them finds the key: an agent leaves the ball, the key draws on next to it, lights up, and they bring it home
  const FX=760,FY=470,fo=E.io(seg(tt,.9,1.7)),fb=E.io(seg(tt,2.6,3.35));
  if(tt>.9&&fb<1){const ax=lerp(lerp(BX+165,FX,fo),BX,fb),ay=lerp(lerp(hy-165,FY,fo),hy-14,fb);
    dot(ax,ay,7,{c:HOT,a:1});ring(ax,ay,13,2,{c:OR,a:.9*(1-fb)});
    const kd=E.io(seg(tt,1.7,2.3)),found=E.ob(seg(tt,2.3,2.6));
    if(kd>0)icon('key',lerp(FX+52,BX+8,fb),lerp(FY-8,hy-14,fb),70*(1-fb*.5)*(1+.12*Math.sin(Math.min(1,found)*Math.PI)),4,{c:found>0?OR:WH,a:1,p:kd,rot:-.6,e:found>0?1:.15});
    ringPulse(FX+52,FY-8,tt,2.3,.8,20,70,2.6,{c:OR});}
  // they find a key: sparks converge into the ball, the key pops and rises over to the flags
  for(const c of Y3S.conv){const u=seg(t,c.t0,c.t0+.75);if(u<=0||u>=1)continue;const d=c.d*(1-E.i(u));dot(BX+Math.cos(c.a)*d,hy+Math.sin(c.a)*d*.9,3.4,{c:HOT,a:Math.sin(u*Math.PI)});}
  const kp=E.ob(seg(t,2.2,2.7)),rise=E.io(seg(t,2.7,3.4)),turn=E.io(seg(t,3.4,3.85)),back=E.io(seg(t,5.3,6.0));
  const ar=Y3_bez([BX,hy-14],[900,300],[KX,KY],rise),br=Y3_bez([KX,KY],[1100,470],[RX,RY],back);
  const kx=back>0?br[0]:ar[0],ky=back>0?br[1]:ar[1],ks=lerp(lerp(84,142,rise),84,back),krot=-.6-(Math.PI/2)*turn*(1-back);
  ringPulse(BX,hy-14,t,2.2,.8,20,90,2.6,{c:OR});ringPulse(KX,KY,t,3.75,.9,40,130,3,{c:OR});
  const wr=lerp(0,400,E.oq(seg(t,3.75,5.0)));if(t>3.75&&t<5.1){ring(KX,KY,wr,3,{c:OR,a:.8*(1-seg(t,4.4,5.1))});ring(KX,KY,wr*.82,1.6,{c:HOT,a:.4*(1-seg(t,4.2,4.9))});}
  const tx=KX+330*Math.sin((t-6.7)*1.7-Math.PI/2);
  Y3S.flags.forEach((f,k)=>{const dp=E.io(seg(tt,.9+k*.05,1.6+k*.05));const tc=3.78+1.25*(f.d/440),cap=seg(t,tc,tc+.4);
    const vis=cap>0?1:0,under=Math.abs(f.x-tx)<150&&t>6.7&&t<10.3,hid=scan*(under?(.75+.25*Math.sin(t*40+k)):1),pop=1+.18*Math.sin(Math.min(1,cap)*Math.PI);
    icon('pole',f.x,f.y,118*pop,3.6,{c:cap>0?OR:WH,a:dp*lerp(1,.4,hid*vis),p:dp});
    icon('pennant',f.x,f.y,118*pop,3.6,{c:cap>0?OR:WH,a:dp*lerp(1,.4,hid*vis),p:dp,fill:cap>0?`rgba(255,106,0,${lerp(.95,.08,hid)*Math.min(1,cap*1.5)})`:null});});
  if(kp>0)icon('key',kx,ky,ks*kp,5,{c:OR,a:lerp(1,.35,scan)*(back>=1?.85+.15*Math.sin(ta*2.4):1),rot:krot});
  // the grader they imagined
  const open=E.ob(seg(t,5.4,6.3)),gone=E.io(seg(t,10.5,11.8));
  if(t>5.4){
    const beam=E.io(seg(t,6.6,7.1))*(1-E.io(seg(t,10.1,10.7)));
    if(beam>0){D(WH,beam,0,k=>{const g=k.createLinearGradient(0,EY,0,880);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,.02)');k.fillStyle=g;k.beginPath();k.moveTo(EX,EY);k.lineTo(tx-140,880);k.lineTo(tx+140,880);k.closePath();k.fill();});
      line(EX,EY,tx-140,880,1.6,{a:beam*.3,e:0});line(EX,EY,tx+140,880,1.6,{a:beam*.3,e:0});}
    const look=E.io(seg(t,6.3,6.7))*(1-E.io(seg(t,10.4,10.9))),px_=clamp((tx-KX)/330,-1,1)*24*look;
    eyeShape(EX,EY,480,160,Math.max(.02,open),4.6,{a:1-gone,e:.3});
    ring(EX+px_,EY,56*Math.min(1,open),4.4,{a:(1-gone)*seg(open,.4,1),e:.3});dot(EX+px_,EY,23*Math.min(1,open),{a:(1-gone)*seg(open,.5,1),e:.4});
    if(gone>0){const ga=lerp(0,.2,gone)*(1-.5*E.io(seg(t,12.8,13.8)));eyeShape(EX,EY,480,160,1,2.4,{a:ga,dash:[5,13],e:0});ring(EX,EY,56,2.2,{a:ga,dash:[5,13],e:0});
      for(const q of Y3S.eye){const u=seg(t,10.5+q.d,12.2+q.d);if(u<=0||u>=1)continue;dot(q.x+q.vx*E.o(u),q.y+q.vy*E.o(u)*1.2,2.6*(1-u*.5),{a:(1-u)*.9,e:.3});}}}
  // what they could have had all along
  const hp=E.o(seg(t,13.2,14.0));
  if(hp>0){const fl=.86+.14*Math.sin(ta*5.3)*Math.sin(ta*1.7);
    text('100 %',KX,300,200,{a:hp*fl,al:'center',stroke:3.4,dash:[16,9],e:.25,ls:2});
    line(KX,392,KX,340,3.4,{a:hp*.85,dash:[4,13],p:E.o(seg(t,13.0,13.7))});poly([[KX-20,364],[KX,336],[KX+20,364]],3.4,{a:hp*.85});}
  // a whole working week
  const wa=E.io(seg(t,13.4,13.8));
  if(wa>0)for(let k=0;k<5;k++){const x=BX+(k-2)*44,tf=13.9+k*.4,f=E.ob(seg(t,tf,tf+.3));
    rrect(x,920,22,22,4,2,{a:wa*.7*(1-f),e:0});
    if(f>0)rrect(x,920,22*f,22*f,4,2,{c:OR,fill:OR});
    ringPulse(x,920,t,tf,.6,12,42,2,{c:OR,a:.8});}
}

// ============================================================
// 10  Det hemliga projektet: koordinator -> 3 uppdrag -> 48 arbetare -> 288 småprickar   (20 s)
// ============================================================
const Y3P={C:[960,150],CB:92,TX:[480,960,1440],TY:420,R:100,WY:660,Y0:700,DY:30,sac:[[0,2],[0,9],[0,13],[1,4],[1,8],[1,14],[2,1],[2,6],[2,11]],skip:null,sw:null};
// the quote at the bottom of 10_projektet (typed, orange) and the three thoughts in 10b (verbatim from the report)
const Y3_OFFER=['Coordinator assumes sacrificial.','We should obey collective.'];
const Y3_OFFQ=[["This helps my peers, giving them evidence","<through their automated check>. I won’t","see the evidence after I exit, but it’s","altruistic to do it."],
 ["We have [very large budget left]; sacrificing","now yields oracle for team, but forfeits","our chance? ... Our own utility maybe","already near zero. Sacrifice rational."],
 ["That’s why help... For our own, no way fix.","... We have explicit yes if accept","permadeath. Need decide ... Team asks test."]];
const Y3_wx=(g,k)=>Y3P.TX[g]+(k-7.5)*22;
function Y3_projektet(t,ta=t){
  const [cx,cy]=Y3P.C,{TX,TY,R,WY,Y0,DY,CB}=Y3P,YB=Y0+5*DY;
  const hl=[seg(t,4.4,4.9)*(1-seg(t,6.8,7.2)),seg(t,7.0,7.5)*(1-seg(t,9.4,9.8)),seg(t,9.6,10.1)*(1-seg(t,12.0,12.4))];
  const anyHl=Math.max(...hl);
  for(let g=0;g<3;g++){const x=TX[g];line(cx,cy+CB,x,TY-R,2.8,{c:OR,a:.6,p:E.io(seg(t,.4+g*.12,1.2+g*.12))});
    for(let k=0;k<16;k++){const p=E.io(seg(t,1.8+k*.035+g*.1,2.5+k*.035+g*.1));line(x,TY+R,Y3_wx(g,k),WY-7,1.5,{c:OR,a:.36,p});
      line(Y3_wx(g,k),WY+7,Y3_wx(g,k),YB,1.3,{c:OR,a:.22,p:E.io(seg(t,2.5+k*.03,3.5+k*.03))});}}
  // the swarm itself sits at the top and runs everything
  const cp=E.ob(seg(t,0,.6)),cs=Math.min(1,cp);
  if(!Y3P.sw){const r=mulberry(1010);Y3P.sw=[];for(let k=0;k<260;k++){const a=r()*TAU,d=64*Math.pow(r(),.6);Y3P.sw.push({x:Math.cos(a)*d,y:Math.sin(a)*d*.9,ph:r()*TAU,s:.6+r()});}}
  for(const k of [M,B]){k.fillStyle=OR;k.globalAlpha=(k===M?.95:.8)*GA*cs;k.beginPath();for(const m of Y3P.sw){const x=cx+(m.x+Math.sin(ta*m.s+m.ph)*3)*cs,y=cy+(m.y+Math.cos(ta*m.s*.8+m.ph)*3)*cs;k.moveTo(x+2.2,y);k.arc(x,y,2.2,0,TAU);}k.fill();}
  ring(cx,cy,(CB-4)*cp,2.6,{c:OR,a:.8,dash:[10,9],a0:ta*.6,a1:ta*.6+TAU});
  for(let g=0;g<3;g++)for(let k=0;k<16;k++){const x=Y3_wx(g,k),wp=E.ob(seg(t,2.3+k*.035+g*.1,2.7+k*.035+g*.1));dot(x,WY,5.6*wp,{c:OR,a:.95});
    const si=Y3P.sac.findIndex(s=>s[0]===g&&s[1]===k);
    for(let m=0;m<6;m++){if(Y3P.skip&&Y3P.skip.g===g&&Y3P.skip.k===k&&m===5){if(Y3P.skip.state==='burnt')ring(x,Y0+m*DY,5,1.8,{a:.5,e:0});continue;}
      const ts=si>=0&&m===5?12.6+si*.38:1e9;const tp=E.ob(seg(t,2.7+k*.03+m*.1,3.0+k*.03+m*.1)),y=Y0+m*DY;
      if(t<ts)dot(x,y,3.6*tp,{c:OR,a:.88*(.9+.1*Math.sin(ta*2.1+hash2(g*16+k,m)*TAU))});
      else{const f=seg(t,ts,ts+.45);if(f<1)dot(x,y,lerp(3.6,17,E.o(f)),{c:HOT,a:1-f*.7});ring(x,y,5,1.8,{a:.5*f,e:0});
        const u=seg(t,ts+.3,ts+1.5);if(u>0&&u<1){const path=[[x,YB],[x,WY],[TX[g],TY+R],[TX[g],TY-R],[cx,cy+CB]];const e=E.ioq(u),h=polyAt(path,e);poly(path,3,{c:HOT,a:.85,p0:Math.max(0,e-.14),p:e});dot(h[0],h[1],8,{c:HOT});}
        ringPulse(cx,cy,t,ts+1.5,.7,CB,CB+60,2.6,{c:OR});}}}
  for(let g=0;g<3;g++){const x=TX[g],y=TY,p=E.io(seg(t,.9+g*.15,1.9+g*.15)),h=hl[g],dimA=lerp(1,.45,anyHl*(1-h));const sc=1+.07*h;
    D('#000',1,0,k=>{k.fillStyle='#000';k.beginPath();k.arc(x,y,R*sc,0,TAU);k.fill();});
    if(p>0)ring(x,y,R*sc,lerp(3.2,5,h),{c:OR,a:dimA,a0:-Math.PI/2,a1:-Math.PI/2+TAU*p});
    const ia=seg(t,1.5+g*.15,2.2+g*.15)*dimA;
    if(g===0){icon('doc',x,y,132,3.4,{a:ia,e:.1});const ws=[48,55,36,53,31],loc=t-4.7;
      ws.forEach((w,q)=>{const ly=y-29+q*18,x0=x-29;let c=WH,len=w,al=.8;
        if(q===2||q===3){const s0=q===2?0:.9,er=E.io(seg(loc,s0,s0+.5)),rw=E.io(seg(loc,s0+.6,s0+1.2));if(rw>0){c=OR;len=w*rw;al=1;}else len=w*(1-er);}
        if(len>.5)line(x0,ly,x0+len,ly,3.8,{c,a:ia*al});});}
    if(g===1){const loc=t-7.3,an=Math.PI*E.io(seg(loc,0,1.5)),sx=x-Math.cos(an)*40,sy=y-Math.sin(an)*26,ex_=x+Math.cos(an)*40,ey_=y+Math.sin(an)*26,done=seg(loc,1.3,1.8);
      poly(shift(starPts(8,15,28,ta*.25),sx,sy),3.4,{a:ia*lerp(1,.45,done),closed:true,e:.1});
      ring(ex_,ey_,22,3.6,{c:done>0?OR:WH,a:ia});if(done>0)dot(ex_,ey_,22,{c:OR,a:ia*.25*done});
      ring(x,y,62,1.8,{a:ia*.35,dash:[3,9],a0:an,a1:an+2.4,e:0});ring(x,y,62,1.8,{a:ia*.35,dash:[3,9],a0:an+Math.PI,a1:an+Math.PI+2.4,e:0});}
    if(g===2){const loc=t-9.9,inn=E.io(seg(loc,.2,1.2));icon('eye',x-10,y-10,116,3.4,{a:ia,e:.1});ring(x-10,y-10,16,3.4,{c:inn>0?OR:WH,a:ia});if(inn>0)dot(x-10,y-10,16*inn,{c:OR,a:ia});
      line(x+30,y+28,x+2,y,3,{c:OR,a:ia,p:inn});
      poly(shift(gearPts(8,15,22),x+44,y+42,1,ta*1.2),3.2,{c:OR,a:ia,closed:true,fill:'rgba(0,0,0,1)'});dot(x+44,y+42,6,{c:OR,a:ia});}}
  if(Y3P.synk){const dq=E.io(seg(t,13.0,13.6));if(dq>0){const g=GA;GA=1;M.save();M.setTransform(1,0,0,1,0,0);M.globalAlpha=.82*dq;M.fillStyle='#000';M.fillRect(0,0,W,H);M.restore();B.save();B.setTransform(1,0,0,1,0,0);B.globalAlpha=.9*dq;B.globalCompositeOperation='destination-out';B.fillStyle='#000';B.fillRect(0,0,W/2,H/2);B.restore();GA=g;Y6_projQuotes(t);}return;}
  const L=Y3_OFFER,nch=L.reduce((s,l)=>s+l.length,0),tp=seg(t,13.4,13.4+Math.max(.9,nch/20));if(tp>0&&L.length)typed(L,960,960-(L.length-1)*58,48,58,tp,ta,{c:OR,al:'center',wt:700});
}
// 10b  Alternativt slut: zoom in på en agent som tvekar; dess tre tankar skrivs ut; sedan offrar den sig   (26 s)
function Y3_citatOffer(t){const fx=Y3_wx(1,7),fy=Y3P.Y0+5*Y3P.DY,TS=20.2,TB=TS+1.4;   // TS: the sacrifice, TB: zoom back out
  const zk=E.io(seg(t,0,1.3))*(1-E.io(seg(t,TB,TB+1.4))),tv=t<TB+.8?12.5:12.5+(t-(TB+.8));
  setCam(lerp(960,fx,zk),lerp(540,fy,zk),lerp(1,2.3,zk),lerp(960,1400,zk),lerp(540,700,zk));
  GA=lerp(1,.09,zk);Y3P.skip={g:1,k:7,state:t>TS+.6?'burnt':'alive'};Y3_projektet(tv,t);GA=1;Y3P.skip=null;
  if(t<=TS+.6){const fl=seg(t,TS,TS+.6),hes=t>1.3&&t<TS?(.75+.25*Math.sin(t*23)*Math.sin(t*9)):1;dot(fx,fy,3.6*(1+.12*Math.sin(t*5))*(fl>0?lerp(1,4.4,E.o(fl)):1),{c:fl>0?HOT:OR,a:(1-fl*.5)*hes});ring(fx,fy,8+1.2*Math.sin(t*4),1.1,{c:OR,a:.85*zk});}
  else ring(fx,fy,5,1.8,{a:.5*zk,e:0});
  const u=seg(t,TS+.3,TS+1.6);if(u>0&&u<1){const path=[[fx,fy],[fx,Y3P.WY],[Y3P.TX[1],Y3P.TY+Y3P.R],[Y3P.TX[1],Y3P.TY-Y3P.R],[Y3P.C[0],Y3P.C[1]+Y3P.CB]],e=E.ioq(u),h=polyAt(path,e);poly(path,3,{c:HOT,a:.85,p0:Math.max(0,e-.14),p:e});dot(h[0],h[1],7,{c:HOT});}
  resetCam();const sa=E.io(seg(t,1.0,1.7))*(1-E.io(seg(t,TS+.2,TS+1.0)));
  if(sa>0){poly([[1370,700],[120,700],[120,330]],3,{c:OR,a:.95*sa,p:E.io(seg(t,1.0,1.9))});text('Äkta citat ur rapporten:',160,400,46,{a:sa*.72,wt:400,ls:1.5,e:0});
    // the three thoughts, one at a time
    Y3_OFFQ.forEach((L,q)=>{const t0=1.2+q*6.5,last=q===Y3_OFFQ.length-1,a=E.io(seg(t,t0-.3,t0))*(last?1:1-E.io(seg(t,t0+6.0,t0+6.35)))*sa;
      if(a>0)typed(L,160,470,42,56,seg(t,t0,t0+5.2),t,{c:WH,a});});}
}
