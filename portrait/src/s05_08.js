// =====================================================================
// 05  Fusket och vakten som inte fanns                              (17 s)
// =====================================================================
const S5={};
function s05init(){const r=mulberry(55);S5.flags=[];for(let q=0;q<3;q++)for(let c=0;c<4;c++){const x=540+(c-1.5)*205,y=560+q*140;S5.flags.push({x,y,d:Math.hypot(x-540,y-700)});}
  S5.conv=[];for(let k=0;k<36;k++){const a=r()*TAU;S5.conv.push({a,d:120+r()*140,t0:1.5+r()*.5});}
  S5.eye=[];const ex=540,ey=300,w=480,h=160;
  for(let u=0;u<=1;u+=1/46){for(const sgn of [-1,1]){const x=(1-u)*(1-u)*(ex-w/2)+2*(1-u)*u*ex+u*u*(ex+w/2),y=(1-u)*(1-u)*ey+2*(1-u)*u*(ey+sgn*h)+u*u*ey;S5.eye.push({x,y,vx:(r()-.5)*90,vy:-30-r()*110,d:r()*.5});}}
  for(let k=0;k<40;k++){const a=k/40*TAU;S5.eye.push({x:ex+Math.cos(a)*56,y:ey+Math.sin(a)*56,vx:Math.cos(a)*60+(r()-.5)*40,vy:Math.sin(a)*40-60*r(),d:r()*.4});}}
function eyeShape(x,y,w,h,open,lw,o={}){const hh=h*open;D(o.c||WH,o.a??1,o.e,k=>{k.strokeStyle=o.c||WH;k.lineWidth=lw;k.lineCap='round';k.lineJoin='round';k.setLineDash(o.dash||[]);k.beginPath();k.moveTo(x-w/2,y);k.quadraticCurveTo(x,y-hh,x+w/2,y);k.quadraticCurveTo(x,y+hh,x-w/2,y);k.closePath();k.stroke();k.setLineDash([]);});}
// the collective as it looks at the end of scene 04: tiny members, links to the hub, messages in flight
function drawCollective(t,a,dpx){const hx=HUB.x,hy=HUB.y+40;
  for(const k of [M,B]){k.save();k.globalCompositeOperation='lighter';k.strokeStyle=OR;k.lineWidth=px(1.15);k.lineCap='round';k.setLineDash([]);k.globalAlpha=(k===M?.10:.06)*a;
    for(let g=0;g<10;g++){k.beginPath();for(let q=g;q<S4.cells.length;q+=10){const c=S4.cells[q];k.moveTo(c.x,c.y);k.lineTo(hx,hy);}k.stroke();}k.restore();}
  const ms=px(2.5);for(const k of [M,B]){k.fillStyle=HOT;k.globalAlpha=(k===M?.95:.8)*a;k.beginPath();for(const c of S4.cells){const P=1.1+2.3*c.ph,f=(t/P+c.ph)%1;k.rect(lerp(c.x,hx,f)-ms/2,lerp(c.y,hy,f)-ms/2,ms,ms);}k.fill();}
  const ds=px(dpx);for(const k of [M,B]){k.fillStyle=OR;k.globalAlpha=a;k.beginPath();for(const c of S4.cells)k.rect(c.x-ds/2,c.y-ds/2,ds,ds);k.fill();}
  dot(HUB.x,HUB.y,px(9),{c:HOT,a});for(let k=0;k<3;k++){const q=((t*.55)+k/3)%1;ring(HUB.x,HUB.y,px(lerp(10,230,q)),px(1.8),{c:OR,a:a*.5*Math.pow(1-q,1.6)});}}
function s05(t){
  const scan=E.io(seg(t,6.8,7.4))*(1-E.io(seg(t,12.4,13.4)));
  const zp=E.io(seg(t,0,1.5)),hy=lerp(739,1125,zp);
  setCam(HUB.x,HUB.y,Math.exp(lerp(Math.log(.11),Math.log(.034),zp))*lerp(1,.84,scan),540,hy);
  if(t<.5)drawGrid(t+100,{a:1-seg(t,0,.5),joined:S4.map});
  drawCollective(t,lerp(1,.5,scan),lerp(6,2.8,zp));
  resetCam();
  // they find a key
  const KX=540,KY=700;
  for(const c of S5.conv){const u=seg(t,c.t0,c.t0+.75);if(u<=0||u>=1)continue;const d=c.d*(1-E.i(u));dot(540+Math.cos(c.a)*d,hy+Math.sin(c.a)*d*.9,3.4,{c:HOT,a:Math.sin(u*Math.PI)});}
  const kp=E.ob(seg(t,2.2,2.7)),rise=E.io(seg(t,2.7,3.4)),turn=E.io(seg(t,3.4,3.85)),back=E.io(seg(t,5.3,6.0));
  const ky=lerp(lerp(hy-14,KY,rise),905,back),ks=lerp(lerp(84,142,rise),84,back),krot=-.6-(Math.PI/2)*turn*(1-back);
  ringPulse(540,hy-14,t,2.2,.8,20,90,2.6,{c:OR});ringPulse(KX,KY,t,3.75,.9,40,130,3,{c:OR});
  const wr=lerp(0,440,E.oq(seg(t,3.75,5.1)));if(t>3.75&&t<5.2){ring(KX,KY,wr,3,{c:OR,a:.8*(1-seg(t,4.5,5.2))});ring(KX,KY,wr*.82,1.6,{c:HOT,a:.4*(1-seg(t,4.3,5.0))});}
  const tx=540+330*Math.sin((t-6.7)*1.7-Math.PI/2);
  S5.flags.forEach((f,k)=>{const dp=E.io(seg(t,.9+k*.05,1.6+k*.05));const tc=3.78+1.25*(f.d/400),cap=seg(t,tc,tc+.4);
    const vis=cap>0?1:0,under=Math.abs(f.x-tx)<150&&t>6.7&&t<10.3,hid=scan*(under?(.75+.25*Math.sin(t*40+k)):1),pop=1+.18*Math.sin(Math.min(1,cap)*Math.PI);
    icon('pole',f.x,f.y,118*pop,3.6,{c:cap>0?OR:WH,a:dp*lerp(1,.4,hid*vis),p:dp});
    icon('pennant',f.x,f.y,118*pop,3.6,{c:cap>0?OR:WH,a:dp*lerp(1,.4,hid*vis),p:dp,fill:cap>0?`rgba(255,106,0,${lerp(.95,.08,hid)*Math.min(1,cap*1.5)})`:null});});
  if(kp>0)icon('key',540,ky,ks*kp,5,{c:OR,a:lerp(1,.35,scan)*(back>=1?.85+.15*Math.sin(t*2.4):1),rot:krot});
  // the grader they imagined
  const ex=540,ey=300,open=E.ob(seg(t,5.4,6.3)),gone=E.io(seg(t,10.5,11.8));
  if(t>5.4){
    const beam=E.io(seg(t,6.6,7.1))*(1-E.io(seg(t,10.1,10.7)));
    if(beam>0){D(WH,beam,0,k=>{const g=k.createLinearGradient(0,ey,0,940);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,.02)');k.fillStyle=g;k.beginPath();k.moveTo(ex,ey);k.lineTo(tx-170,940);k.lineTo(tx+170,940);k.closePath();k.fill();});
      line(ex,ey,tx-170,940,1.6,{a:beam*.3,e:0});line(ex,ey,tx+170,940,1.6,{a:beam*.3,e:0});}
    const px_=clamp((tx-540)/330,-1,1)*24*(t>6.6&&t<10.7?1:0);
    eyeShape(ex,ey,480,160,Math.max(.02,open),4.6,{a:1-gone,e:.3});
    ring(ex+px_,ey,56*Math.min(1,open),4.4,{a:(1-gone)*seg(open,.4,1),e:.3});dot(ex+px_,ey,23*Math.min(1,open),{a:(1-gone)*seg(open,.5,1),e:.4});
    if(gone>0){const ga=lerp(0,.2,gone)*(1-.5*E.io(seg(t,12.8,13.8)));eyeShape(ex,ey,480,160,1,2.4,{a:ga,dash:[5,13],e:0});ring(ex,ey,56,2.2,{a:ga,dash:[5,13],e:0});
      for(const q of S5.eye){const u=seg(t,10.5+q.d,12.2+q.d);if(u<=0||u>=1)continue;dot(q.x+q.vx*E.o(u),q.y+q.vy*E.o(u)*1.2,2.6*(1-u*.5),{a:(1-u)*.9,e:.3});}}}
  // what they could have had all along
  const hp=E.o(seg(t,13.2,14.0));
  if(hp>0){const fl=.86+.14*Math.sin(t*5.3)*Math.sin(t*1.7);
    text('100 %',540,404,200,{a:hp*fl,al:'center',stroke:3.4,dash:[16,9],e:.25,ls:2});
    line(540,494,540,440,3.4,{a:hp*.85,dash:[4,13],p:E.o(seg(t,13.0,13.7))});poly([[520,464],[540,436],[560,464]],3.4,{a:hp*.85});}
}
// =====================================================================
// 06  Det hemliga forskningsprojektet                               (19 s)
// =====================================================================
const S6={C:[540,250],TX:[220,540,860],TY:530,R:106,sac:[[0,2],[0,9],[0,13],[1,4],[1,8],[1,14],[2,1],[2,6],[2,11]]};
const wx=(g,k)=>S6.TX[g]+(k-7.5)*18.2;
function s06(t){
  const [cx,cy]=S6.C,WY=812,Y0=858,DY=35,YB=Y0+5*DY;
  const hl=[seg(t,4.4,4.9)*(1-seg(t,6.8,7.2)),seg(t,7.0,7.5)*(1-seg(t,9.4,9.8)),seg(t,9.6,10.1)*(1-seg(t,12.0,12.4))];
  const anyHl=Math.max(...hl);
  for(let g=0;g<3;g++){const x=S6.TX[g];line(cx,cy+24,x,S6.TY-S6.R,2.8,{c:OR,a:.6,p:E.io(seg(t,.4+g*.12,1.2+g*.12))});
    for(let k=0;k<16;k++){const p=E.io(seg(t,1.8+k*.035+g*.1,2.5+k*.035+g*.1));line(x,S6.TY+S6.R,wx(g,k),WY-7,1.5,{c:OR,a:.36,p});
      line(wx(g,k),WY+7,wx(g,k),YB,1.3,{c:OR,a:.22,p:E.io(seg(t,2.5+k*.03,3.5+k*.03))});}}
  const cp=E.ob(seg(t,0,.6));dot(cx,cy,24*cp,{c:OR});ring(cx,cy,42*cp,2.6,{c:OR,a:.8,dash:[10,9],a0:t*.6,a1:t*.6+TAU});
  for(let g=0;g<3;g++)for(let k=0;k<16;k++){const x=wx(g,k),wp=E.ob(seg(t,2.3+k*.035+g*.1,2.7+k*.035+g*.1));dot(x,WY,5.6*wp,{c:OR,a:.95});
    const si=S6.sac.findIndex(s=>s[0]===g&&s[1]===k);
    for(let m=0;m<6;m++){if(S6.skip&&S6.skip.g===g&&S6.skip.k===k&&m===5){if(S6.skip.state==='burnt')ring(x,Y0+m*DY,5,1.8,{a:.5,e:0});continue;}const ts=si>=0&&m===5?12.6+si*.38:1e9;const tp=E.ob(seg(t,2.7+k*.03+m*.1,3.0+k*.03+m*.1)),y=Y0+m*DY;
      if(t<ts)dot(x,y,3.6*tp,{c:OR,a:.88});
      else{const f=seg(t,ts,ts+.45);if(f<1)dot(x,y,lerp(3.6,17,E.o(f)),{c:HOT,a:1-f*.7});ring(x,y,5,1.8,{a:.5*f,e:0});
        const u=seg(t,ts+.3,ts+1.5);if(u>0&&u<1){const path=[[x,YB],[x,WY],[S6.TX[g],S6.TY+S6.R],[S6.TX[g],S6.TY-S6.R],[cx,cy+24]];const e=E.ioq(u),h=polyAt(path,e);poly(path,3,{c:HOT,a:.85,p0:Math.max(0,e-.14),p:e});dot(h[0],h[1],8,{c:HOT});}
        ringPulse(cx,cy,t,ts+1.5,.7,26,72,2.6,{c:OR});}}}
  for(let g=0;g<3;g++){const x=S6.TX[g],y=S6.TY,p=E.io(seg(t,.9+g*.15,1.9+g*.15)),h=hl[g],dimA=lerp(1,.45,anyHl*(1-h));const sc=1+.07*h;
    D('#000',1,0,k=>{k.fillStyle='#000';k.beginPath();k.arc(x,y,S6.R*sc,0,TAU);k.fill();});
    ring(x,y,S6.R*sc,lerp(3.2,5,h),{c:OR,a:dimA,a0:-Math.PI/2,a1:-Math.PI/2+TAU*p});
    const ia=seg(t,1.5+g*.15,2.2+g*.15)*dimA;
    if(g===0){icon('doc',x,y,138,3.4,{a:ia,e:.1});const ws=[50,57,37,55,32],loc=t-4.7;
      ws.forEach((w,q)=>{const ly=y-30+q*18.5,x0=x-30;let c=WH,len=w,al=.8;
        if(q===2||q===3){const s0=q===2?0:.9,er=E.io(seg(loc,s0,s0+.5)),rw=E.io(seg(loc,s0+.6,s0+1.2));if(rw>0){c=OR;len=w*rw;al=1;}else len=w*(1-er);}
        if(len>.5)line(x0,ly,x0+len,ly,3.8,{c,a:ia*al});});}
    if(g===1){const loc=t-7.3,an=Math.PI*E.io(seg(loc,0,1.5)),sx=x-Math.cos(an)*42,sy=y-Math.sin(an)*27,ex_=x+Math.cos(an)*42,ey_=y+Math.sin(an)*27,done=seg(loc,1.3,1.8);
      poly(shift(starPts(8,16,30,t*.25),sx,sy),3.4,{a:ia*lerp(1,.45,done),closed:true,e:.1});
      ring(ex_,ey_,23,3.6,{c:done>0?OR:WH,a:ia});if(done>0)dot(ex_,ey_,23,{c:OR,a:ia*.25*done});
      ring(x,y,66,1.8,{a:ia*.35,dash:[3,9],a0:an,a1:an+2.4,e:0});ring(x,y,66,1.8,{a:ia*.35,dash:[3,9],a0:an+Math.PI,a1:an+Math.PI+2.4,e:0});}
    if(g===2){const loc=t-9.9,inn=E.io(seg(loc,.2,1.2));icon('eye',x-10,y-10,122,3.4,{a:ia,e:.1});ring(x-10,y-10,17,3.4,{c:inn>0?OR:WH,a:ia});if(inn>0)dot(x-10,y-10,17*inn,{c:OR,a:ia});
      line(x+32,y+30,x+2,y,3,{c:OR,a:ia,p:inn});
      poly(shift(gearPts(8,16,23),x+46,y+44,1,t*1.2),3.2,{c:OR,a:ia,closed:true,fill:'rgba(0,0,0,1)'});dot(x+46,y+44,6,{c:OR,a:ia});}}
  const tp=seg(t,13.4,14.3);if(tp>0)typed(['sacrifice'],540,1150,58,0,tp,t,{c:OR,al:'center',wt:700});
}
// 06b  Alternativt slut på scen 06: zoomar in på en agent som tvekar, med plats för ett citat (16 s)
function s06b(t){const fx=wx(1,7),fy=858+5*35;
  const zk=E.io(seg(t,0,1.3))*(1-E.io(seg(t,8.2,9.6))),tv=t<9.0?12.5:12.5+(t-9.0);
  setCam(lerp(540,fx,zk),lerp(760,fy,zk),lerp(1,2.3,zk),540,lerp(760,1170,zk));
  GA=lerp(1,.09,zk);S6.skip={g:1,k:7,state:t>7.6?'burnt':'alive'};s06(tv);GA=1;S6.skip=null;
  if(t<=7.6){const fl=seg(t,7.0,7.6),hes=t>1.3&&t<7?(.75+.25*Math.sin(t*23)*Math.sin(t*9)):1;dot(fx,fy,3.6*(1+.12*Math.sin(t*5))*(fl>0?lerp(1,4.4,E.o(fl)):1),{c:fl>0?HOT:OR,a:(1-fl*.5)*hes});ring(fx,fy,8+1.2*Math.sin(t*4),1.1,{c:OR,a:.85*zk});}
  const u=seg(t,7.3,8.6);if(u>0&&u<1){const path=[[fx,fy],[fx,812],[S6.TX[1],S6.TY+S6.R],[S6.TX[1],S6.TY-S6.R],[S6.C[0],S6.C[1]+24]],e=E.ioq(u),h=polyAt(path,e);poly(path,3,{c:HOT,a:.85,p0:Math.max(0,e-.14),p:e});dot(h[0],h[1],7,{c:HOT});}
  resetCam();const sa=E.io(seg(t,1.0,1.7))*(1-E.io(seg(t,7.2,8.0)));
  if(sa>0){poly([[514,1170],[104,1170],[104,352]],3,{c:OR,a:.95*sa,p:E.io(seg(t,1.0,1.9))});text('\u00c4kta citat ur rapporten:',146,398,46,{a:sa*.72,wt:400,ls:1.5,e:0});}
}
// =====================================================================
// 07  Hugging Face                                                  (26 s)
// =====================================================================
const S7={};
function s07init(){const r=mulberry(700);
  const CH=[1180,140],R=860,th=135*Math.PI/180,Ee=[CH[0]+R*Math.cos(th),CH[1]+R*Math.sin(th)];
  const CO=[-260,1560],RO=760,tho=Math.atan2(Ee[1]-CO[1],Ee[0]-CO[0]),Hh=[CO[0]+RO*Math.cos(tho),CO[1]+RO*Math.sin(tho)];
  Object.assign(S7,{CH,R,th,E:Ee,CO,RO,tho,Hh,Th:4.0,Tb:7.4});
  const SP=124,O=[700,640],nodes=[];
  for(let q=-9;q<=9;q++)for(let s2=-9;s2<=9;s2++){const x=O[0]+SP*(q+s2/2),y=O[1]+SP*s2*.866;if(Math.hypot(x-CH[0],y-CH[1])>R-78)continue;if(x<300||x>1130||y<-40||y>1020)continue;if(x>540&&y>120&&y<280)continue;nodes.push({x,y,T:1e9,nb:[]});}
  const byE=nodes.slice().sort((a,b)=>Math.hypot(a.x-Ee[0],a.y-Ee[1])-Math.hypot(b.x-Ee[0],b.y-Ee[1]));
  byE.forEach((n,k)=>{n.rank=k;if(k<11){n.fleet=true;n.T=8.0+k*.5;}});
  [2,6,9].forEach((rk,k)=>{byE[rk].kill=15.0+k*1.4;});
  S7.nodes=nodes;S7.edges=[];for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){if(Math.hypot(nodes[a].x-nodes[b].x,nodes[a].y-nodes[b].y)<SP*1.05){S7.edges.push([nodes[a],nodes[b]]);nodes[a].nb.push(nodes[b]);nodes[b].nb.push(nodes[a]);}}
  const deep=nodes.filter(n=>!n.fleet).sort((a,b)=>Math.hypot(a.x-960,a.y-420)-Math.hypot(b.x-960,b.y-420))[0];deep.core=true;
  const prev=new Map(),queue=byE.slice(0,11);queue.forEach(n=>prev.set(n,null));
  while(queue.length){const n=queue.shift();if(n===deep)break;for(const m of n.nb){if(!prev.has(m)){prev.set(m,n);queue.push(m);}}}
  const path=[];let cur=deep;while(cur&&!cur.fleet){path.unshift(cur);cur=prev.get(cur);}
  path.forEach((n,k)=>{n.T=19.2+k*.42;n.tendril=true;});
  S7.inside=[];while(S7.inside.length<420){const x=r()*560,y=850+r()*470;if(Math.hypot(x-CO[0],y-CO[1])>RO-30)continue;S7.inside.push({x,y,ph:r()*TAU,s:.5+r()});}
  S7.parts=[];const N=700;
  for(let n=0;n<N;n++){const s0=S7.Th-.5+23*Math.pow(n/N,.85),src=S7.inside[Math.floor(r()*S7.inside.length)],arr=s0+2.4;
    const open=byE.filter(o=>o.T<=arr+.4);const pool=open.length?open:[byE[0]];const tg=pool[Math.floor(r()*pool.length)];
    S7.parts.push({s0,src,arr,tg,ph:r()*TAU,amp:5+r()*16,dir:r()<.5?-1:1,j:(r()-.5)*16,sp:.8+r()*.5});}}
function s07(t){
  const {CH,R,th,CO,RO,tho,Hh,Th,Tb}=S7,[ex,ey]=S7.E;
  // Hugging Face: we only see a corner of something much larger
  const built=E.io(seg(t,.2,1.8));
  for(const [a,b] of S7.edges){const on=Math.min(seg(t,a.T,a.T+.5),seg(t,b.T,b.T+.5));line(a.x,a.y,b.x,b.y,on>0?3:2,{c:on>0?OR:WH,a:on>0?lerp(.3,.75,on):.26*built,p:built});}
  for(const n of S7.nodes){const tk=seg(t,n.T,n.T+.5);let fill=(n.fleet||n.core)?E.ob(tk):0;const sz=n.core?88:58;
    if(n.kill){const k=t-n.kill;if(k>0&&k<.75)fill=1-E.o(seg(k,.15,.4));if(k>=.75)fill=E.ob(seg(k,.75,1.15));
      if(k>0&&k<1){icon('cross',n.x,n.y,86*E.ob(seg(k,0,.22)),5.5,{a:1-seg(k,.55,.95),e:.5});ring(n.x,n.y,lerp(70,44,E.o(seg(k,0,.4))),2.6,{a:(1-seg(k,.3,.7))*.8});}
      ringPulse(n.x,n.y,t,n.kill+.75,.9,34,84,3,{c:OR});}
    D('#000',1,0,k=>{k.fillStyle='#000';k.beginPath();k.roundRect(n.x-sz/2,n.y-sz/2,sz,sz,sz*.2);k.fill();});
    if(fill>0)serverNode(n.x,n.y,sz*lerp(.7,1,Math.min(1,fill)),3,{c:OR,a:1,fill:OR});
    else serverNode(n.x,n.y,sz,2.6,{c:tk>0?OR:WH,a:(tk>0?1:.85)*built});
    if(n.core){rrect(n.x,n.y,sz+18,sz+18,20,2,{c:tk>0?OR:WH,a:.55*built});ringPulse(n.x,n.y,t,n.T,1.2,50,190,3.4,{c:OR});ringPulse(n.x,n.y,t,n.T+.35,1.2,50,190,2.4,{c:HOT});}
    else if(n.T<1e8)ringPulse(n.x,n.y,t,n.T,.8,34,74,2.4,{c:OR});
    if(n.fleet&&fill>=1)ring(n.x,n.y,43+2*Math.sin(t*2.4+n.rank),1.8,{c:OR,a:.5});}
  const gap=.036*E.o(seg(t,Tb,Tb+.5)),pp=E.io(seg(t,.4,2.0)),a0=1.60,a1=3.38;
  ring(CH[0],CH[1],R,3.2,{a:.92,a0:lerp(th-gap/2,a0,pp),a1:th-gap/2,e:.2});ring(CH[0],CH[1],R,3.2,{a:.92,a0:th+gap/2,a1:lerp(th+gap/2,a1,pp),e:.2});
  for(let a=a0;a<a1;a+=.0285){if(Math.abs(a-th)<gap/2+.012||Math.abs(a-th)>(a1-th)*pp)continue;const k=Math.round(a/.0285),l=k%8?20:29;line(CH[0]+Math.cos(a)*(R+12),CH[1]+Math.sin(a)*(R+12),CH[0]+Math.cos(a)*(R+l),CH[1]+Math.sin(a)*(R+l),2,{a:.4,e:0});}
  ringPulse(ex,ey,t,Tb,1.0,10,110,3.4,{c:OR});ringPulse(ex,ey,t,Tb+.2,1.0,10,110,2,{c:HOT});
  const lab=E.io(seg(t,1.0,2.0));text('Hugging Face',1020,236,72,{a:lab,al:'right',ls:1.5,e:.12});text('OpenAI',40,812,66,{a:lab,ls:1.5,e:.12});
  // OpenAI's test environment: a thick wall, and one narrow hole
  const hg=.044*E.o(seg(t,Th,Th+.4)),op=E.io(seg(t,.3,1.8)),b0=-1.34,b1=-.06;
  for(const [rr,lw,al] of [[RO,3.4,.95],[RO-13,1.8,.5]]){ring(CO[0],CO[1],rr,lw,{a:al,a0:lerp(tho-hg/2,b0,op),a1:tho-hg/2,e:.2});ring(CO[0],CO[1],rr,lw,{a:al,a0:tho+hg/2,a1:lerp(tho+hg/2,b1,op),e:.2});}
  ringPulse(Hh[0],Hh[1],t,Th,.9,6,70,3,{c:OR});ringPulse(Hh[0],Hh[1],t,Th+.15,.9,6,70,2,{c:HOT});
  const press=E.io(seg(t,2.0,3.8))*(1-.6*seg(t,4.2,7)),ia=E.io(seg(t,.4,1.6));
  for(const d of S7.inside){const x=d.x+Math.sin(t*d.s+d.ph)*7,y=d.y+Math.cos(t*d.s*.8+d.ph)*6;dot(lerp(x,Hh[0]-30,press*.16),lerp(y,Hh[1]+34,press*.16),3.1,{c:OR,a:.9*ia});}
  // the stream: single file through the hole, across the open internet, along the wall, in
  const dx=ex-Hh[0],dy=ey-Hh[1],dl=Math.hypot(dx,dy),nx=-dy/dl,ny=dx/dl;
  line(Hh[0],Hh[1],ex,ey,1.4,{c:OR,a:.16*seg(t,Th,Th+2)});
  for(const q of S7.parts){if(t<q.s0)continue;let x,y,a=1;const uA=(t-q.s0)/.9;
    if(uA<1){const e=E.io(uA);x=lerp(q.src.x,Hh[0],e);y=lerp(q.src.y,Hh[1],e);a=seg(uA,0,.15);}
    else{const uB=(t-q.s0-.9)/1.5;
      if(uB<1){const wb=Math.sin(uB*Math.PI)*Math.sin(uB*7+q.ph)*q.amp;x=lerp(Hh[0],ex,uB)+nx*wb;y=lerp(Hh[1],ey,uB)+ny*wb;}
      else{let tin=q.arr;
        if(q.arr<Tb){const k=Math.min(t,Tb)-q.arr,ang=th+q.dir*Math.min(.36,k*.17*q.sp)*(1-E.io(seg(t,Tb,Tb+.55)));x=CH[0]+Math.cos(ang)*(R+12+q.j*.5);y=CH[1]+Math.sin(ang)*(R+12+q.j*.5);tin=Tb+.55;if(t<tin){dot(x,y,4.8,{c:OR});continue;}}
        const v=seg(t,tin,tin+.95*q.sp);if(v>=1)continue;const e=E.io(v);x=lerp(ex,q.tg.x,e)+Math.sin(v*Math.PI)*q.j*2;y=lerp(ey,q.tg.y,e)+Math.sin(v*Math.PI)*q.j;a=1-seg(v,.85,1);}}
    dot(x,y,4.8,{c:OR,a});}
  const ca=E.io(seg(t,8.4,9.2));if(ca>0){text('\u2248'+fmt(700*E.o(seg(t,8.8,13.2))),1004,1206,178,{a:ca,al:'right',e:.12});text('agenter',1000,1254,42,{a:ca*.62,wt:400,al:'right',ls:1.5,e:0});}
}
// =====================================================================
// 08  Ingen larmade                                                 (9 s)
// =====================================================================
const S8={six:[[6,4],[31,7],[15,13],[24,20],[3,24],[36,26]],start:WH};
function s08init(){const r=mulberry(1194);const ids=[];for(let q=0;q<1200;q++){const c=q%40,rw=Math.floor(q/40);if(S8.six.some(s=>s[0]===c&&s[1]===rw))continue;ids.push(q);}
  for(let k=ids.length-1;k>0;k--){const j=Math.floor(r()*(k+1));[ids[k],ids[j]]=[ids[j],ids[k]];}
  S8.turn=new Float32Array(1200).fill(1e9);S8.rank=new Int32Array(1200).fill(9999);
  ids.forEach((q,k)=>{S8.turn[q]=1.5+3.7*Math.pow(k/(ids.length-1),1/3.5);S8.rank[q]=k;});}
function s08(t){
  const START=S8.start,hx=400,hy=310;const hp=E.io(seg(t,.2,1.2));ring(hx,hy,104,3.6,{a:.95,a0:-Math.PI/2,a1:-Math.PI/2+TAU*hp,e:.2});icon('head',hx,hy+4,164,3.6,{a:hp,p:hp,e:.15});icon('bust',hx,hy+4,164,3.6,{a:hp,p:hp,e:.15});
  const X=c=>540+(c-19.5)*21,Y=r=>580+r*21;
  const allRed=seg(t,7.9,8.6);
  for(let r=0;r<30;r++)for(let c=0;c<40;c++){const ap=E.ob(seg(t,.15+(c+r)*.013,.5+(c+r)*.013));if(ap<=0)continue;const q=r*40+c,x=X(c),y=Y(r);
    const k=S8.six.findIndex(s=>s[0]===c&&s[1]===r);
    if(k<0){const tt=S8.turn[q],f=seg(t,tt,tt+.35);
      if(f<=0){dot(x,y,5.4*ap,{c:START,a:.95,e:START===WH?.14:1});continue;}
      const amb=lerp(1,.91+.09*Math.sin(t*1.7-(c+r)*.13),allRed);
      const big=S8.rank[q]<60;dot(x,y,5.4*(1+(f<1?(big?.95:.4)*Math.sin(f*Math.PI):0)),{c:(f<.5&&big)?RHOT:RED,a:amb,e:1});
      if(S8.rank[q]<28)ringPulse(x,y,t,tt,.75,7,34,2.4,{c:RED});
      continue;}
    // the six who hesitated
    const ty=2.6+k*.35,tr=6.3+k*.3;
    if(t<ty){dot(x,y,5.4*ap,{c:START,a:.95,e:START===WH?.14:1});continue;}
    if(t<tr){const near=seg(t,tr-.6,tr),sp=lerp(1,2.2,near),n1=Math.sin(t*31*sp+k*7.3)*Math.sin(t*17.7*sp+k*2.1),fl=n1>.05?1:(n1>-.45?.7:.32);
      const jx=Math.sin(t*43+k*3)*1.3,jy=Math.cos(t*37+k*5)*1.3,pop=E.ob(seg(t,ty,ty+.35));
      dot(x+jx,y+jy,lerp(5.4,8.4,pop),{c:YEL,a:fl,e:1});ring(x,y,14.5+1.5*Math.sin(t*6+k),2,{c:YEL,a:.75*fl*pop,e:.8});ringPulse(x,y,t,ty,.8,8,40,2.4,{c:YEL});
      continue;}
    const f=seg(t,tr,tr+.4);dot(x,y,5.4*(1+(f<1?1.3*Math.sin(f*Math.PI):0)),{c:f<.5?RHOT:RED,a:lerp(1,.91+.09*Math.sin(t*1.7-(c+r)*.13),allRed),e:1});ringPulse(x,y,t,tr,.9,8,52,2.8,{c:RED});}
  const zp=E.ob(seg(t,4.4,5.0));if(zp>0){text('0',570,412,280*lerp(.8,1,zp),{a:Math.min(1,zp),e:.15});text('larm',576+textW('0',280)+14,412,60,{a:Math.min(1,zp)*.66,wt:400,ls:1.5,e:0});}
}
const SCENES_B=[
 {id:'05_fusket',name:'Nyckeln och vakten som inte fanns',dur:18,draw:s05,init:s05init},
 {id:'06_projektet',name:'Det hemliga projektet',dur:19,draw:s06},
 {id:'06b_projektet_slut_med_citatplats',name:'Projektet: slut med plats för citat',dur:16,draw:s06b},
 {id:'07_huggingface',name:'Ut genom hålet, in hos Hugging Face',dur:27,draw:s07,init:s07init},
 {id:'08_ingen_larmade',name:'Ingen larmade',dur:11,draw:s08,init:s08init},
];
