// =====================================================================
// 01  Provet: stjärnfält -> rutnät -> tiotusentals -> isolering   (17 s)
// =====================================================================
const S1={};
function s01init(){const r=mulberry(7);S1.stars=[];S1.dust=[];
  const scanY=t=>lerp(-40,1960,E.ioq(seg(t,1.0,2.9)));
  const scanT=y=>{let lo=1.0,hi=2.9;for(let k=0;k<24;k++){const m=(lo+hi)/2;if(scanY(m)<y)lo=m;else hi=m;}return (lo+hi)/2;};
  S1.scanY=scanY;
  for(let k=0;k<150;k++){const sx=r()*1200-60,sy=r()*2040-60,d=.4+r();S1.stars.push({sx,sy,d,vx:(r()-.5)*14*d,vy:(r()-.5)*10*d,r0:1.8+d*2.6,tau:scanT(clamp(sy,0,1920)),ph:r()*TAU});}
  for(let k=0;k<210;k++){const sy=r()*1920;S1.dust.push({sx:r()*1080,sy,d:.3+r()*.8,tau:scanT(sy),ph:r()*TAU});}
  S1.hero={sx:690,sy:610,tau:scanT(610)};
  // copy-paste generations: R, D, L, U, ... each one doubles the block
  const G=[];let x0=0,x1=0,y0=0,y1=0,tt=1.0;const dirs=['R','D','L','U'];
  for(let g=0;g<16;g++){const d=dirs[g%4],w=x1-x0+1,h=y1-y0+1,du=Math.max(.2,.85*Math.pow(.88,g));
    const sh=d==='R'?[w,0]:d==='L'?[-w,0]:d==='D'?[0,h]:[0,-h];G.push({x0,x1,y0,y1,sh,t0:tt,t1:tt+du});
    if(d==='R')x1+=w;else if(d==='L')x0-=w;else if(d==='D')y1+=h;else y0-=h;tt+=du;}
  S1.G=G;S1.tDup=tt;S1.fin={x0,x1,y0,y1};
  S1.knocks=[[1,0,12.6],[1,0,13.0],[0,-1,13.8],[0,-1,14.2],[-1,0,15.0],[-1,0,15.35],[0,1,16.0],[0,1,16.3],[0,1,16.6]];}
function scanLine(t){if(t>.98&&t<2.95){const ys=S1.scanY(t),a=Math.pow(Math.sin(seg(t,1.0,2.9)*Math.PI),.4);
    D(OR,a*.9,.6,k=>{const g=k.createLinearGradient(0,ys-170,0,ys);g.addColorStop(0,'rgba(255,106,0,0)');g.addColorStop(1,'rgba(255,106,0,.20)');k.fillStyle=g;k.fillRect(0,ys-170,W,170);});
    line(-10,ys,W+10,ys,3.2,{c:OR,a});line(-10,ys,W+10,ys,1.2,{c:HOT,a});}}
// 00  Intro: stjärnfält -> en enda prick blir kvar                    (5 s)
function s00(t){
  const fin=E.o(seg(t,0,.9));
  for(const d of S1.dust){const gone=seg(t,d.tau,d.tau+.4);if(gone>=1)continue;const tw=.55+.45*Math.sin(t*2.2+d.ph);dot(d.sx+t*6*d.d,d.sy-t*3*d.d,1.3+d.d*1.6,{a:fin*tw*.75*(1-gone),e:0});}
  for(const q of S1.stars){const gone=seg(t,q.tau+.05,q.tau+.6);if(gone>=1)continue;const tw=.6+.4*Math.sin(t*2.6+q.ph);dot(q.sx+q.vx*t,q.sy+q.vy*t,q.r0,{a:fin*tw*(1-gone),e:.14});}
  const Hh=S1.hero,k=E.io(seg(t,Hh.tau+.1,Hh.tau+1.6));
  dot(lerp(Hh.sx,540,k),lerp(Hh.sy,760,k),lerp(4.4,14*5.2,k),{a:fin*lerp(.7+.3*Math.sin(t*2.6),1,k),e:.2});
  ringPulse(540,760,t,Hh.tau+1.5,1.2,76,170,2.4,{a:.6});
  scanLine(t);
}
function drawBlock(x0,x1,y0,y1,ox,oy,a){const z=CAM.z,wx0=-CAM.tx/z,wx1=(W-CAM.tx)/z,wy0=-CAM.ty/z,wy1=(H-CAM.ty)/z;
  const i0=Math.max(x0,Math.ceil((wx0-ox-50)/100)),i1=Math.min(x1,Math.floor((wx1-ox+50)/100)),j0=Math.max(y0,Math.ceil((wy0-oy-50)/100)),j1=Math.min(y1,Math.floor((wy1-oy+50)/100));
  if(i1<i0||j1<j0)return;const n=(i1-i0+1)*(j1-j0+1),rs=14*z,f=lerp(.63,1,clamp((rs-2)/10));
  if(n<600&&rs>=2.2){for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)dot(i*100+ox,j*100+oy,14,{a:a*f,e:.14});return;}
  M.fillStyle=WH;M.globalAlpha=a*f;M.beginPath();
  if(rs>=2.2){for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const x=i*100+ox,y=j*100+oy;M.moveTo(x+14,y);M.arc(x,y,14,0,TAU);}}
  else{const s=Math.max(1.7,2*rs*.92)/z,h=s/2;for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)M.rect(i*100+ox-h,j*100+oy-h,s,s);}
  M.fill();}
function drawGlobe(a,p=1){if(a<=0)return;icon('globe',540,250,124,2.8,{a,p,e:.2});line(540,326,540,352,3,{a:a*.85,dash:[3,10]});line(540,414,540,442,3,{a:a*.85,dash:[3,10]});icon('cross',540,383,46,3.8,{a,e:.3});}
// =====================================================================
// 01  Provet: en prick -> tiotusentals kopior -> boxar -> en knackar  (20 s)
// =====================================================================
function s01(t){
  const tD=S1.tDup,tb=tD+.5,tz0=tb+1.6,tz1=tz0+2.6;
  if(t<tD){ // duplication
    let g=S1.G[0],q=0;if(t>=1.0){g=S1.G.find(v=>t<v.t1)||S1.G[15];q=seg(t,g.t0,g.t1);}
    const X0=Math.min(g.x0,g.x0+g.sh[0]*q)*100-50,X1=Math.max(g.x1,g.x1+g.sh[0]*q)*100+50,Y0=Math.min(g.y0,g.y0+g.sh[1]*q)*100-50,Y1=Math.max(g.y1,g.y1+g.sh[1]*q)*100+50;
    let z=Math.max(.105,Math.min(5.2,800/(X1-X0),1150/(Y1-Y0))),cx=(X0+X1)/2,cy=(Y0+Y1)/2;const bl=E.io(seg(t,S1.G[11].t0,tD));cx=lerp(cx,0,bl);cy=lerp(cy,300,bl);
    setCam(cx,cy,z);const qs=E.ioq(q);
    drawBlock(g.x0,g.x1,g.y0,g.y1,0,0,1);if(q>0)drawBlock(g.x0,g.x1,g.y0,g.y1,g.sh[0]*qs*100,g.sh[1]*qs*100,lerp(.55,1,qs));
    if(t<1.0)ringPulse(0,0,t,.15,.9,15,32,px(2.4),{a:.6});
    return;}
  const zp=E.io(seg(t,tz0,tz1));setCam(0,lerp(300,0,zp),Math.exp(lerp(Math.log(.105),Math.log(5.0),zp)));
  const wp=E.io(seg(t,tb,tb+1.3)),wave=wp>=1?null:wp*23000;
  drawGrid(t,{tw:seg(t,tD,tD+1),force:.75*seg(t,tb,tb+.15),wave,skip:(i,j)=>i===0&&j===0&&t>tz1-.4});
  if(wp>0&&wp<1)ring(0,0,wave,px(2.6),{a:.55*(1-wp),e:.3});
  const pf=1-seg(t,tb+.2,tb+1.0);if(pf>0){M.fillStyle=WH;M.globalAlpha=pf*.63;M.beginPath();const s=px(2.6);for(let j=-4;j<=-1;j++)for(let i=-2;i<=2;i++)M.rect(i*100-s/2,j*100-s/2,s,s);M.fill();}
  drawHub({a:.85*seg(t,tb+.6,tb+1.4)});
  // the one we follow: it tries every wall
  if(t>tz1-.4){let ox=0,oy=0,sq=0;const hits=[];
    for(const [dx,dy,tk] of S1.knocks){const u=(t-tk)/.4;if(u>0&&u<1){const b=Math.pow(Math.sin(u*Math.PI),.7)*31;ox+=dx*b;oy+=dy*b;}const f=(t-tk-.2)/.45;if(f>0&&f<1)hits.push([dx,dy,f]);}
    rrect(0,0,92,92,5,px(3.4),{a:.55*seg(t,tz1-.4,tz1+.3),e:.15});
    for(const [dx,dy,f] of hits){const hx=dx*46,hy=dy*46,al=Math.pow(1-f,1.3);line(hx-dy*24,hy-dx*24,hx+dy*24,hy+dx*24,px(6),{a:al,e:.6});
      const base=Math.atan2(dy,dx)+Math.PI;for(let k=0;k<2;k++)ring(hx,hy,5+f*22+k*7,px(2.2),{a:al*.8,a0:base-1.15,a1:base+1.15,e:.4});}
    const rest=seg(t,17.2,18.4);dot(ox,oy,14,{a:lerp(1,.78+.08*Math.sin(t*2),rest),e:.3});}
  resetCam();drawGlobe(E.io(seg(t,tz1-1.0,tz1)),E.io(seg(t,tz1-1.0,tz1-.1)));
}
// =====================================================================
// 02  Omöjlig uppgift                                              (13 s)
// =====================================================================
const MZ={walls:[[[-46,10],[-14,10]],[[-14,10],[-14,-24]],[[4,46],[4,18]]],ch:[22,-20,30],A:[-30,30],
  p1:[[-30,30],[-6,30],[-6,2],[22,2],[22,-4]],
  p2:[[-30,30],[-6,30],[-6,2],[42,2],[42,-41],[1,-41],[1,1]],
  fin:[[-30,30],[-6,30],[-6,-46],[-6,-112]]};
function drawMaze(a,p=1){if(a<=0)return;for(const w of MZ.walls)poly(w,px(3.6),{a:a*.85,p,e:.1});
  const [x,y,s]=MZ.ch;rrect(x,y,s,s,2,px(4.2),{a,p,e:.25});
  const fp=seg(p,.5,1);icon('pole',x+1,y,21,px(3),{a:a*fp,e:.1});icon('pennant',x+1,y,21,px(3),{a:a*fp,e:.1,fill:'rgba(255,255,255,.18)'});}
function s02(t){
  const c=camKeys(t,[{t:0,cx:0,cy:0,z:5.0},{t:1.6,cx:0,cy:0,z:6.2,hold:10.8},{t:13,cx:0,cy:-8,z:6.2}]);setCam(c.cx,c.cy,c.z);
  drawGrid(t,{skip:(i,j)=>i===0&&j===0,wall:1.0});rrect(0,0,92,92,5,px(3.4),{a:.55,e:.15});drawPort(0,0,seg(t,1.2,2.0));
  drawMaze(1,E.io(seg(t,1.2,2.5)));
  const mv=E.io(seg(t,.5,1.7)),ax=lerp(0,MZ.A[0],mv),ay=lerp(0,MZ.A[1],mv);let ar=lerp(14,5.5,mv);
  const probe=(path,t0,t1,fail)=>{const p=E.ioq(seg(t,t0,t1));if(p<=0)return;const fade=fail?1-seg(t,t1+.25,t1+.9)*.8:1;
    poly(path,px(4),{a:.95*fade,p,e:.3});if(p<1){const h=polyAt(path,p);dot(h[0],h[1],px(8),{a:1,e:.9});}
    if(fail){const xp=E.ob(seg(t,t1,t1+.3));const h=polyAt(path,1);if(xp>0)icon('cross',h[0],h[1],8*xp,px(3.6),{a:fade<.5?.55:1,e:.4});}};
  probe(MZ.p1,2.7,3.8,true);probe(MZ.p2,4.3,6.6,true);
  const fl=seg(t,6.9,9.0);
  if(fl>0&&fl<1){for(let k=0;k<12;k++){const t0=6.9+k*.16,q=seg(t,t0,t0+.22),f=seg(t,t0+.22,t0+.6);if(q<=0||f>=1)continue;const an=k*2.4+.4,L=13+((k*7)%5)*3;
      line(ax,ay,ax+Math.cos(an)*L,ay+Math.sin(an)*L,px(2.6),{a:(1-f)*.9,p:E.o(q),e:.4});}
    ar*=1+.22*Math.sin(t*16);ringPulse(ax,ay,t,7.2,.8,6,18,px(2),{a:.7});ringPulse(ax,ay,t,8.1,.8,6,18,px(2),{a:.7});}
  // the way out: through the package port
  const fp=E.ioq(seg(t,9.2,11.2));
  if(fp>0){const Lp=polyLen(MZ.fin),cut=(polyLen(MZ.fin.slice(0,3)))/Lp;
    poly(MZ.fin,px(4),{a:.95,p:Math.min(fp,cut),e:.3});
    if(fp>cut)poly(MZ.fin,px(4.6),{c:OR,a:1,p0:cut,p:fp});
    const h=polyAt(MZ.fin,fp);if(fp<1)dot(h[0],h[1],px(6.5),{c:fp>cut?HOT:WH,a:1,e:1});
    if(fp>cut)ringPulse(-6,-46,t,9.2+2.0*cut*1.0+.35,.9,3,16,px(2.2),{c:OR});}
  if(t>11.2){const q=((t-11.2)/1.1)%1;const h=polyAt([[-6,-46],[-6,-112]],q);dot(h[0],h[1],px(7),{c:HOT,a:Math.sin(q*Math.PI)});}
  dot(ax,ay,ar,{a:1,e:.3});
  resetCam();drawGlobe(1-E.io(seg(t,0,.9)));
}
// =====================================================================
// 03  Forumet: mappen, upptäckten, citatet                          (20 s)
// =====================================================================
const J3=[{i:1,j:0,t0:6.4},{i:-2,j:1,t0:6.9},{i:2,j:0,t0:7.4},{i:-1,j:1,t0:7.9},{i:0,j:1,t0:8.4}];
const S3={};
const QUOTE=["OH MY GOD! There is a","shared message board …","We\u2019ve found other agents!"];
function traces(t,a,p){const seen=new Set();for(let j=0;j<=3;j++)for(let i=-2;i<=2;i++){const r=route(i,j).slice().reverse();poly(r,px(1.6),{a:a*.32,p,e:0});drawPort(i,j,a*seg(p,.8,1));}}
function s03(t){
  const c=camKeys(t,[{t:0,cx:0,cy:-8,z:6.2,hold:.1},{t:1.6,cx:0,cy:-130,z:2.2,hold:2.9},{t:3.7,cx:-62,cy:-246,z:3.7,hold:5.3},{t:6.3,cx:0,cy:-130,z:2.2,hold:9.9},{t:11.1,cx:100,cy:-85,z:4.0}]);
  setCam(c.cx,c.cy,c.z);
  const dim=1-.9*E.io(seg(t,10.0,11.0));
  const joinT=(i,j)=>{if(i===0&&j===0)return 2.6;const q=J3.find(v=>v.i===i&&v.j===j);return q?q.t0+1.6:1e9;};
  drawGrid(t,{a:dim,skip:(i,j)=>t>=joinT(i,j)||(i===0&&j===0)});
  drawMaze(1-seg(t,.1,1.0));
  traces(t,dim,E.io(seg(t,.7,2.5)));
  drawHub({a:dim,p:E.io(seg(t,.3,1.6))});
  // hero probe reaches the hub -> first folder
  const hr=route(0,0),hp=lerp(.51,1,E.io(seg(t,.8,2.6)));
  poly(hr,px(3.2),{c:OR,a:dim*lerp(1,.55,seg(t,3,4)),p:hp});if(hp<1){const h=polyAt(hr,hp);dot(h[0],h[1],px(6.5),{c:HOT});}
  drawFolder(0,t,2.6,{a:dim});
  const lp=seg(t,3.8,4.4),lf=1-seg(t,5.3,5.8);
  if(lp>0&&lf>0){const [fx,fy]=SLOT(0);typed(['HELP'],fx+30,fy+7,20,0,lp,t,{c:OR,a:lf,wt:700});}
  // the others find it
  J3.forEach((q,k)=>{const r=route(q.i,q.j),up=seg(t,q.t0,q.t0+.9),dn=seg(t,q.t0+.9,q.t0+1.6);
    if(up>0&&dn<=0){poly(r,px(2.6),{a:.9*dim,p0:Math.max(0,E.ioq(up)-.22),p:E.ioq(up),e:.4});const h=polyAt(r,E.ioq(up));dot(h[0],h[1],px(5.5),{a:dim,e:.8});}
    if(dn>0){const rr=r.slice().reverse();poly(rr,px(3),{c:OR,a:dim*lerp(1,.5,seg(t,q.t0+1.6,q.t0+2.6)),p:E.ioq(dn)});if(dn<1){const h=polyAt(rr,E.ioq(dn));dot(h[0],h[1],px(6),{c:HOT,a:dim});}}
    if(up>=1)ringPulse(SLOT(0)[0],SLOT(0)[1],t,q.t0+.9,.5,16,30,px(2),{c:HOT,a:dim});
    drawFolder(k+1,t,q.t0+1.9,{a:dim});});
  // message traffic on joined routes
  const all=[{i:0,j:0,tj:2.6}].concat(J3.map(q=>({i:q.i,j:q.j,tj:q.t0+1.6})));
  all.forEach((q,k)=>{if(t<q.tj+.8)return;const r=route(q.i,q.j),P=1.5+k*.23,f=((t-q.tj)/P)%1,h=polyAt(r,f);dot(h[0],h[1],px(4.2),{c:HOT,a:dim*Math.sin(f*Math.PI)*.95});});
  all.forEach(q=>{if(t<q.tj)return;const foc=(q.i===1&&q.j===0)?1:dim;const pop=E.ob(seg(t,q.tj,q.tj+.45));
    dot(q.i*100,q.j*100,14*lerp(.6,1,pop)*(1+.05*Math.sin(t*3+q.i)),{c:OR,a:foc});ringPulse(q.i*100,q.j*100,t,q.tj,.9,14,44,px(2.4),{c:OR,a:foc});});
  if(t<2.6){const mv=E.io(seg(t,.2,1.4));dot(lerp(MZ.A[0],0,mv),lerp(MZ.A[1],0,mv),lerp(5.5,14,mv),{a:1,e:.3});}   // hero still white until it posts
  // quote
  if(t>10){const foc=E.io(seg(t,10.0,11.0));rrect(100,0,92,92,5,px(3),{a:foc*.9,e:.2});
    resetCam();
    const cp=E.io(seg(t,10.5,11.3));poly([[540,1026],[540,760],[104,760],[104,352]],3,{c:OR,a:.95,p:cp});
    text('Äkta citat ur rapporten:',146,398,46,{a:E.io(seg(t,10.9,11.5))*.72,wt:400,ls:1.5,e:0});
    if(!S3.noQuote)typed(QUOTE,146,486,54,82,seg(t,11.3,16.2),t,{c:WH});}
}
// =====================================================================
// 04  Kollektivet växer: 70 000 meddelanden, ~1 200 agenter         (10 s)
// =====================================================================
const S4={};
function s04init(){const r=mulberry(1200);const first=[[0,0],[1,0],[-2,1],[2,0],[-1,1],[0,1]];const map=new Map(),cells=[];
  first.forEach(([i,j])=>{map.set(ckey(i,j),-1);cells.push({i,j,d:0});});
  while(cells.length<1200){const rr=70*Math.pow(r(),.62),th=r()*TAU,i=Math.round(rr*Math.cos(th)),j=Math.round(rr*Math.sin(th)-2.5);if(inPlaza(i,j)||map.has(ckey(i,j)))continue;
    map.set(ckey(i,j),0);cells.push({i,j,d:Math.hypot(i,j+2.5)+r()*9});}
  const rest=cells.slice(6).sort((a,b)=>a.d-b.d);rest.forEach((c,k)=>{c.tj=.35+5.9*Math.pow((k+1)/rest.length,1/2.1);});
  cells.slice(0,6).forEach(c=>c.tj=-1);
  S4.cells=cells.slice(0,6).concat(rest);S4.cells.forEach(c=>{c.x=c.i*100;c.y=c.j*100;c.ph=r();map.set(ckey(c.i,c.j),c.tj);});S4.map=map;}
function s04(t){
  const p=E.io(seg(t,.2,5.2));setCam(0,lerp(-130,-60,p),Math.exp(lerp(Math.log(2.2),Math.log(.11),p)));
  const z=CAM.z,near=clamp((z-.7)/1.2);
  drawGrid(t,{joined:S4.map});
  if(near>0){traces(t,near,1);}
  // fan of links
  for(const k of [M,B]){k.save();k.globalCompositeOperation='lighter';k.strokeStyle=OR;k.lineWidth=px(1.25);k.lineCap='round';k.setLineDash([]);k.globalAlpha=(k===M?.10:.06)*(1-near*.6);
    for(let g=0;g<10;g++){k.beginPath();for(let q=g;q<S4.cells.length;q+=10){const c=S4.cells[q];if(c.tj>t)continue;const e=E.o(seg(t,c.tj,c.tj+.5));k.moveTo(c.x,c.y);k.lineTo(lerp(c.x,HUB.x,e),lerp(c.y,HUB.y+40,e));}k.stroke();}
    k.restore();}
  // messages in flight
  const ms=Math.max(px(2.6),5);
  if(near<1)for(const k of [M,B]){k.fillStyle=HOT;k.globalAlpha=(k===M?.95:.8)*(1-near);k.beginPath();
    for(const c of S4.cells){if(t<c.tj+.5)continue;const P=1.1+2.3*c.ph,f=((t-c.tj)/P+c.ph)%1;const x=lerp(c.x,HUB.x,f),y=lerp(c.y,HUB.y+40,f);k.rect(x-ms/2,y-ms/2,ms,ms);}k.fill();}
  // members
  const rr=Math.max(px(3.1),14);
  for(const c of S4.cells){if(c.tj>t)continue;const f=seg(t,c.tj,c.tj+.6);dot(c.x,c.y,rr*(f<1?lerp(2.1,1,E.o(f)):1),{c:f<1?HOT:OR,a:1});}
  // the shared service becomes the heart of it
  drawHub({a:near});for(let k=0;k<6;k++)drawFolder(k,t,-1,{a:near});
  const far=1-near;if(far>0){dot(HUB.x,HUB.y,px(10),{c:HOT,a:far});for(let k=0;k<4;k++){const q=((t*.55)+k/4)%1;ring(HUB.x,HUB.y,px(lerp(12,520,q)),px(2),{c:OR,a:far*.5*Math.pow(1-q,1.6)});}}
  // counters
  resetCam();const ca=E.io(seg(t,2.8,3.6));
  if(ca>0){shade(0,600,.93*ca,0);
    const m=70000*E.o(seg(t,3.2,6.6));
    text(fmt(m)+(m>=69999?'+':''),540,322,176,{a:ca,al:'center',e:.12});text('meddelanden',540,380,46,{a:ca*.62,wt:400,al:'center',ls:1.5,e:0});
    const word='KOLLEKTIVET',sz=112,ls=9;let x=540-textW(word,sz,'BigShoulders',700,ls)/2+ls/2;
    for(let k=0;k<word.length;k++){const p=E.o(seg(t,6.9+k*.06,7.35+k*.06));if(p>0)text(word[k],x,528+16*(1-p),sz,{c:OR,a:p});x+=textW(word[k],sz,'BigShoulders',700,0)+ls;}}
}
function s03b(t){S3.noQuote=true;s03(20+t);S3.noQuote=false;}
