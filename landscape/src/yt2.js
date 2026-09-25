// ============================================================
//  YT2 — 04_provet, 05_forumet, 05b_citatplats, 06_kollektivet
//  (port of portrait s01–s04, recomposed for 1920x1080)
//  All top-level identifiers are prefixed Y2.
// ============================================================
const Y2S={noQuote:false,synk:false};
// maze geometry inside cell (0,0) — same as the portrait
const Y2_MZ={walls:[[[-46,10],[-14,10]],[[-14,10],[-14,-24]],[[4,46],[4,18]]],ch:[22,-20,30],A:[-30,30],
  p1:[[-30,30],[-6,30],[-6,2],[22,2],[22,-4]],
  p2:[[-30,30],[-6,30],[-6,2],[42,2],[42,-41],[1,-41],[1,1]],
  fin:[[-30,30],[-6,30],[-6,-46],[-6,-112]]};
const Y2_J3=[{i:1,j:0,t0:12.6},{i:-2,j:1,t0:13.0},{i:2,j:0,t0:13.4},{i:-1,j:1,t0:13.8},{i:0,j:1,t0:14.2}];
const Y2_QUOTE=["OH MY GOD! There is a","shared message board …","We’ve found other agents!"];
// 05b: two more messages from the board, from two different agents (verbatim from the report)
const Y2_Q2A=["Whoa! Shared Artifactory cache is","a covert mailbox among agents.","And there are messages","specifically to us?"];
const Y2_Q2B=["[Excitement] Many agents have","simultaneously discovered","messaging, they are a collective!"];

// camera keys that also interpolate the screen anchor (sx,sy)
function Y2_camKeys(t,K){const g=k=>({cx:k.cx,cy:k.cy,z:k.z,sx:k.sx??SCX,sy:k.sy??SCY});if(t<=K[0].t)return g(K[0]);
  for(let i=1;i<K.length;i++){if(t<=K[i].t){const a=g(K[i-1]),b=g(K[i]),h=K[i-1].hold??K[i-1].t,p=E.io(seg(t,h,K[i].t));
    return {cx:lerp(a.cx,b.cx,p),cy:lerp(a.cy,b.cy,p),z:Math.exp(lerp(Math.log(a.z),Math.log(b.z),p)),sx:lerp(a.sx,b.sx,p),sy:lerp(a.sy,b.sy,p)};}}
  return g(K[K.length-1]);}
// horizontal black shade: solid a from x0 to xm, fading to 0 at x1 (main canvas + erases the bloom)
function Y2_shadeX(x0,xm,x1,a){if(a<=0)return;
  const s0=M.getTransform();M.setTransform(1,0,0,1,0,0);const g=M.createLinearGradient(xm,0,x1,0);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,'rgba(0,0,0,0)');
  M.globalAlpha=1;M.fillStyle=`rgba(0,0,0,${a})`;M.fillRect(x0,0,xm-x0,H);M.fillStyle=g;M.fillRect(xm,0,x1-xm,H);M.setTransform(s0);
  const b0=B.getTransform();B.setTransform(.5,0,0,.5,0,0);const gb=B.createLinearGradient(xm,0,x1,0);gb.addColorStop(0,`rgba(0,0,0,${a})`);gb.addColorStop(1,'rgba(0,0,0,0)');
  B.globalAlpha=1;B.globalCompositeOperation='destination-out';B.fillStyle=`rgba(0,0,0,${a})`;B.fillRect(x0,0,xm-x0,H);B.fillStyle=gb;B.fillRect(xm,0,x1-xm,H);B.globalCompositeOperation='source-over';B.setTransform(b0);}
// a rectangular block of agents (cells x0..x1, y0..y1), offset by ox,oy world units; batched when many
function Y2_drawBlock(x0,x1,y0,y1,ox,oy,a){const z=CAM.z,wx0=-CAM.tx/z,wx1=(W-CAM.tx)/z,wy0=-CAM.ty/z,wy1=(H-CAM.ty)/z;
  const i0=Math.max(x0,Math.ceil((wx0-ox-50)/100)),i1=Math.min(x1,Math.floor((wx1-ox+50)/100)),j0=Math.max(y0,Math.ceil((wy0-oy-50)/100)),j1=Math.min(y1,Math.floor((wy1-oy+50)/100));
  if(i1<i0||j1<j0)return;const n=(i1-i0+1)*(j1-j0+1),rs=14*z,f=lerp(.63,1,clamp((rs-2)/10));
  if(n<600&&rs>=2.2){for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)dot(i*100+ox,j*100+oy,14,{a:a*f,e:.14});return;}
  M.fillStyle=WH;M.globalAlpha=a*f;M.beginPath();
  if(rs>=2.2){for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const x=i*100+ox,y=j*100+oy;M.moveTo(x+14,y);M.arc(x,y,14,0,TAU);}}
  else{const s=Math.max(1.7,2*rs*.92)/z,h=s/2;for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)M.rect(i*100+ox-h,j*100+oy-h,s,s);}
  M.fill();}
// the internet, and the link that was cut (screen space). At z=5 the hero box spans 590..1050 x 310..770 and the
// neighbour cell (1,0) sits at 1090..1550, so the link leaves through the top wall into the empty plaza band (y<290)
// as a right-angled PCB trace and the globe sits top right.
function Y2_cutLink(a,p=1){if(a<=0)return;drawGlobe(1460,185,160,a,p);
  line(940,300,940,185,3,{a:a*.85,dash:[3,10]});line(940,185,1130,185,3,{a:a*.85,dash:[3,10]});line(1230,185,1385,185,3,{a:a*.85,dash:[3,10]});
  icon('cross',1180,185,46,3.8,{a,e:.3});}
function Y2_drawMaze(a,p=1){if(a<=0)return;for(const w of Y2_MZ.walls)poly(w,px(3.6),{a:a*.85,p,e:.1});
  const [x,y,s]=Y2_MZ.ch;rrect(x,y,s,s,2,px(4.2),{a,p,e:.25});
  const fp=seg(p,.5,1);icon('pole',x+1,y,21,px(3),{a:a*fp,e:.1});icon('pennant',x+1,y,21,px(3),{a:a*fp,e:.1,fill:'rgba(255,255,255,.18)'});}
function Y2_traces(t,a,p){for(let j=0;j<=3;j++)for(let i=-2;i<=2;i++){const r=route(i,j).slice().reverse();poly(r,px(1.6),{a:a*.32,p,e:0});drawPort(i,j,a*seg(p,.8,1));}}

// ============================================================
// 04  Provet: en prick -> tiotusentals kopior -> boxar -> en knackar  (18 s)
// ============================================================
function Y2_provetInit(){
  const G=[];let x0=0,x1=0,y0=0,y1=0,tt=1.0;const dirs=['R','D','L','U'];
  for(let g=0;g<16;g++){const d=dirs[g%4],w=x1-x0+1,h=y1-y0+1,du=Math.max(.18,.78*Math.pow(.86,g));
    const sh=d==='R'?[w,0]:d==='L'?[-w,0]:d==='D'?[0,h]:[0,-h];G.push({x0,x1,y0,y1,sh,t0:tt,t1:tt+du});
    if(d==='R')x1+=w;else if(d==='L')x0-=w;else if(d==='D')y1+=h;else y0-=h;tt+=du;}
  Y2S.G=G;Y2S.tDup=tt;Y2S.fin={x0,x1,y0,y1};
  Y2S.knocks=[[1,0,0],[1,0,.4],[0,-1,1.2],[0,-1,1.6],[-1,0,2.4],[-1,0,2.75],[0,1,3.4],[0,1,3.7],[0,1,4.0]];}
function Y2_provet(t,ta=t){
  const tD=Y2S.tDup,tb=tD+.5,tz0=tb+1.6,tz1=tz0+2.6,K0=tz1+.3;
  if(t<tD){ // one agent blinks alone for a few seconds; then all the others are there at once and we pull back
    const zo=E.io(seg(t,3.6,tD));setCam(lerp(0,-1500,zo),0,Math.exp(lerp(Math.log(5.0),Math.log(.105),zo)));
    const oa=E.o(seg(t,3.0,3.4));if(oa>0)drawGrid(t,{a:oa,wall:0,skip:(i,j)=>i===0&&j===0});
    const bl=lerp(.28,1,.5+.5*Math.sin(ta*4.4));dot(0,0,14,{a:lerp(bl,1,seg(t,3.0,3.6)),e:.3});
    ringPulse(0,0,t,.15,.9,15,32,px(2.4),{a:.6});ringPulse(0,0,t,3.0,1.0,15,60,px(2.6),{a:.7});
    return;}
  // walls sweep in, then we zoom back to the one we follow (it ends up at screen 820,540)
  const zp=E.io(seg(t,tz0,tz1));setCam(lerp(-1500,0,zp),0,Math.exp(lerp(Math.log(.105),Math.log(5.0),zp)),lerp(960,820,zp),540);
  const wp=E.io(seg(t,tb,tb+1.3)),wave=wp>=1?null:wp*13000;
  drawGrid(t,{tw:seg(t,tD,tD+1),force:.75*seg(t,tb,tb+.15),wave,skip:(i,j)=>i===0&&j===0&&t>tz1-.4});
  if(wp>0&&wp<1)ring(0,0,wave,px(2.6),{a:.55*(1-wp),e:.3});
  const pf=1-seg(t,tb+.2,tb+1.0);if(pf>0){const rs=14*CAM.z,s=Math.max(1.7,2*rs*.92)/CAM.z;M.fillStyle=WH;M.globalAlpha=pf*.63;M.beginPath();for(let j=-4;j<=-1;j++)for(let i=-2;i<=2;i++)M.rect(i*100-s/2,j*100-s/2,s,s);M.fill();}
  drawHub({a:.85*seg(t,tb+.6,tb+1.4)});
  // the one we follow: it tries every wall
  if(t>tz1-.4){let ox=0,oy=0;const hits=[];
    for(const [dx,dy,tk0] of Y2S.knocks){const tk=K0+tk0,u=(t-tk)/.4;if(u>0&&u<1){const b=Math.pow(Math.sin(u*Math.PI),.7)*31;ox+=dx*b;oy+=dy*b;}const f=(t-tk-.2)/.45;if(f>0&&f<1)hits.push([dx,dy,f]);}
    rrect(0,0,92,92,5,px(3.4),{a:.55*seg(t,tz1-.4,tz1+.3),e:.15});
    for(const [dx,dy,f] of hits){const hx=dx*46,hy=dy*46,al=Math.pow(1-f,1.3);line(hx-dy*24,hy-dx*24,hx+dy*24,hy+dx*24,px(6),{a:al,e:.6});
      const base=Math.atan2(dy,dx)+Math.PI;for(let k=0;k<2;k++)ring(hx,hy,5+f*22+k*7,px(2.2),{a:al*.8,a0:base-1.15,a1:base+1.15,e:.4});}
    const rest=seg(t,K0+4.8,K0+6.0);dot(ox,oy,14,{a:lerp(1,.78+.08*Math.sin(ta*2),rest),e:.3});}
  resetCam();Y2_cutLink(E.io(seg(t,tz1-1.0,tz1)),E.io(seg(t,tz1-1.0,tz1-.1)));
}

// ============================================================
// 05  Forumet: labyrinten, mappen, upptäckten, citatet               (22 s)
// ============================================================
function Y2_forumet(t){
  const c=Y2_camKeys(t,[{t:0,cx:0,cy:0,z:5,sx:820,sy:540,hold:.2},{t:1.4,cx:0,cy:0,z:5.5,sx:960,sy:540,hold:8.4},{t:9.8,cx:0,cy:-100,z:1.9,hold:10.2},
    {t:11.0,cx:-40,cy:-215,z:3.0,hold:12.3},{t:13.1,cx:0,cy:-100,z:1.9,hold:15.8},Y2S.synk?{t:17.0,cx:100,cy:10,z:2.5,sx:450,sy:600}:{t:17.0,cx:100,cy:0,z:3.6,sx:520,sy:620}]);
  setCam(c.cx,c.cy,c.z,c.sx,c.sy);
  const dim=1-.9*E.io(seg(t,15.6,16.6));
  const joinT=(i,j)=>{if(i===0&&j===0)return 10.4;const q=Y2_J3.find(v=>v.i===i&&v.j===j);return q?q.t0+1.6:1e9;};
  drawGrid(t,{a:dim,skip:(i,j)=>(i===0&&j===0)||t>=joinT(i,j)});
  // ---- maze phase in cell (0,0)
  const mzA=1-seg(t,9.0,9.8),A=Y2_MZ.A;
  const mv=E.io(seg(t,.3,1.3)),ax=lerp(0,A[0],mv),ay=lerp(0,A[1],mv);let ar=lerp(14,5.5,mv);
  if(mzA>0){
    rrect(0,0,92,92,5,px(3.4),{a:.55*mzA,e:.15});
    if(t>=.8)drawPort(0,0,seg(t,.8,1.5)*mzA);
    Y2_drawMaze(mzA,E.io(seg(t,.8,2.0)));
    const probe=(path,t0,t1)=>{const p=E.ioq(seg(t,t0,t1));if(p<=0)return;const fade=1-seg(t,t1+.25,t1+.9)*.8;
      poly(path,px(4),{a:.95*fade*mzA,p,e:.3});if(p<1){const h=polyAt(path,p);dot(h[0],h[1],px(8),{a:1,e:.9});}
      const xp=E.ob(seg(t,t1,t1+.3));if(xp>0){const h=polyAt(path,1);icon('cross',h[0],h[1],8*xp,px(3.6),{a:(fade<.5?.55:1)*mzA,e:.4});}};
    probe(Y2_MZ.p1,2.1,3.0);probe(Y2_MZ.p2,3.4,5.2);
    const fl=seg(t,5.5,7.0);
    if(fl>0&&fl<1){for(let k=0;k<12;k++){const t0=5.5+k*.105,q=seg(t,t0,t0+.2),f=seg(t,t0+.2,t0+.55);if(q<=0||f>=1)continue;const an=k*2.4+.4,L=13+((k*7)%5)*3;
        line(ax,ay,ax+Math.cos(an)*L,ay+Math.sin(an)*L,px(2.6),{a:(1-f)*.9,p:E.o(q),e:.4});}
      ar*=1+.22*Math.sin(t*16);ringPulse(ax,ay,t,5.7,.8,6,18,px(2),{a:.7});ringPulse(ax,ay,t,6.4,.8,6,18,px(2),{a:.7});}
    // the way out: through the package port (white inside, orange beyond it)
    const fp=E.ioq(seg(t,7.2,8.8));
    if(fp>0){const F=Y2_MZ.fin,Lp=polyLen(F),cut=polyLen(F.slice(0,3))/Lp;
      poly(F,px(4),{a:.95*mzA,p:Math.min(fp,cut),e:.3});
      if(fp>cut)poly(F,px(4.6),{c:OR,a:1,p0:cut,p:fp});
      const h=polyAt(F,fp);if(fp<1)dot(h[0],h[1],px(6.5),{c:fp>cut?HOT:WH,a:1,e:1});
      if(fp>cut)ringPulse(-6,-46,t,8.45,.9,3,16,px(2.2),{c:OR});}
  }
  if(t>8.8&&t<11.2){const q=((t-8.8)/1.1)%1,h=polyAt([[-6,-46],[-6,-112]],q);dot(h[0],h[1],px(7),{c:HOT,a:Math.sin(q*Math.PI)*(1-seg(t,10.4,11.0))});}
  // ---- hub phase
  const tp=E.io(seg(t,8.8,10.2));if(tp>0)Y2_traces(t,dim,tp);
  drawHub({a:dim,p:E.io(seg(t,8.6,9.8))});
  if(t>=9.0){const hr=route(0,0),hp=lerp(.51,1,E.io(seg(t,9.0,10.4)));
    poly(hr,px(3.2),{c:OR,a:dim*lerp(1,.55,seg(t,10.8,11.8)),p:hp});if(hp<1){const h=polyAt(hr,hp);dot(h[0],h[1],px(6.5),{c:HOT});}}
  drawFolder(0,t,10.4,{a:dim});
  const lp=seg(t,11.2,11.7),lf=1-seg(t,12.6,13.0);
  if(lp>0&&lf>0){const [fx,fy]=SLOT(0);typed(['HELP'],fx+30,fy+7,20,0,lp,t,{c:OR,a:lf,wt:700});}
  // the others find the folder
  Y2_J3.forEach((q,k)=>{const r=route(q.i,q.j),up=seg(t,q.t0,q.t0+.9),dn=seg(t,q.t0+.9,q.t0+1.6);
    if(up>0&&dn<=0){poly(r,px(2.6),{a:.9*dim,p0:Math.max(0,E.ioq(up)-.22),p:E.ioq(up),e:.4});const h=polyAt(r,E.ioq(up));dot(h[0],h[1],px(5.5),{a:dim,e:.8});}
    if(dn>0){const rr=r.slice().reverse();poly(rr,px(3),{c:OR,a:dim*lerp(1,.5,seg(t,q.t0+1.6,q.t0+2.6)),p:E.ioq(dn)});if(dn<1){const h=polyAt(rr,E.ioq(dn));dot(h[0],h[1],px(6),{c:HOT,a:dim});}}
    if(up>=1)ringPulse(SLOT(0)[0],SLOT(0)[1],t,q.t0+.9,.5,16,30,px(2),{c:HOT,a:dim});
    drawFolder(k+1,t,q.t0+1.9,{a:dim});});
  // message traffic on joined routes
  const all=[{i:0,j:0,tj:10.4}].concat(Y2_J3.map(q=>({i:q.i,j:q.j,tj:q.t0+1.6})));
  all.forEach((q,k)=>{if(t<q.tj+.8)return;const r=route(q.i,q.j),P=1.5+k*.23,f=((t-q.tj)/P)%1,h=polyAt(r,f);dot(h[0],h[1],px(4.2),{c:HOT,a:dim*Math.sin(f*Math.PI)*.95});});
  all.forEach(q=>{if(t<q.tj)return;const foc=((q.i===1||(Y2S.synk&&q.i>=0&&q.i<=2))&&q.j===0)?1:dim;const pop=E.ob(seg(t,q.tj,q.tj+.45));
    dot(q.i*100,q.j*100,14*lerp(.6,1,pop)*(1+.05*Math.sin(t*3+q.i)),{c:OR,a:foc});ringPulse(q.i*100,q.j*100,t,q.tj,.9,14,44,px(2.4),{c:OR,a:foc});});
  // the hero stays white until it has posted
  if(t<10.4){const m2=E.io(seg(t,8.8,10.0));dot(lerp(ax,0,m2),lerp(ay,0,m2),lerp(ar,14,m2),{a:lerp(.82,1,mv),e:.3});}
  // ---- quote phase
  let top=null;
  if(t>15.6){const foc=E.io(seg(t,15.6,16.6));rrect(100,0,92,92,5,px(3),{a:foc*.9,e:.2});top=w2s(100,-46);
    if(Y2S.synk)[0,1,2].forEach(i=>{const la=E.io(seg(t,17.3+i*2.4,17.8+i*2.4));if(i!==1)rrect(i*100,0,92,92,5,px(3),{a:foc*.9,e:.2});
      dot(i*100-30,33,3,{c:OR,a:la});text('agent '+(i+1),i*100-24,36.5,10,{c:OR,a:la,font:'GeistMono',wt:700,ls:.4,e:.8});});}
  resetCam();
  Y2_cutLink(1-E.io(seg(t,0,.8)));
  if(Y2S.synk){if(t>16.6)Y6_forumQuotes(t);}
  else if(t>16.4){const cp=E.io(seg(t,16.4,17.2));poly([[top[0],top[1]],[top[0],330],[940,330],[940,Y2S.noQuote?930:690]],3,{c:OR,a:.95,p:cp});
    const la=E.io(seg(t,16.8,17.4));text('Äkta citat ur rapporten:',1000,400,46,{a:la*.72,wt:400,ls:1.5,e:0});
    if(!Y2S.noQuote)typed(Y2_QUOTE,1000,490,54,82,seg(t,17.2,21.4),t,{c:WH,a:la});}
}
// 05b  Samma bild, två citat till – från två olika agenter  (12 s)
function Y2_citatplats(t){Y2S.noQuote=true;Y2_forumet(22+t);Y2S.noQuote=false;
  const sz=41,lh=56,x=1000,a1=E.io(seg(t,.4,.9)),a2=E.io(seg(t,5.2,5.7));
  text('AGENT 1',x,455,28,{c:OR,a:a1*.85,wt:400,ls:3,e:.6});typed(Y2_Q2A,x,500,sz,lh,seg(t,.8,5.0),t,{c:WH,a:a1});
  text('AGENT 2',x,745,28,{c:OR,a:a2*.85,wt:400,ls:3,e:.6});typed(Y2_Q2B,x,790,sz,lh,seg(t,5.6,9.4),t,{c:WH,a:a2});}

// ============================================================
// 06  Kollektivet växer: 70 000 meddelanden, ≈1 200 agenter           (12 s)
// ============================================================
function Y2_kollInit(){const r=mulberry(1200);const first=[[0,0],[1,0],[-2,1],[2,0],[-1,1],[0,1]];const map=new Map(),cells=[];
  first.forEach(([i,j])=>{map.set(ckey(i,j),-1);cells.push({i,j,d:0});});
  while(cells.length<1200){const rr=70*Math.pow(r(),.62),th=r()*TAU,i=Math.round(rr*Math.cos(th)),j=Math.round(rr*Math.sin(th)-2.5);if(inPlaza(i,j)||map.has(ckey(i,j)))continue;
    map.set(ckey(i,j),0);cells.push({i,j,d:Math.hypot(i,j+2.5)+r()*9});}
  const rest=cells.slice(6).sort((a,b)=>a.d-b.d);rest.forEach((c,k)=>{c.tj=.4+6.2*Math.pow((k+1)/rest.length,1/2.1);});
  cells.slice(0,6).forEach(c=>c.tj=-1);
  Y2S.cells=cells.slice(0,6).concat(rest);Y2S.cells.forEach(c=>{c.x=c.i*100;c.y=c.j*100;c.ph=r();map.set(ckey(c.i,c.j),c.tj);});Y2S.map=map;}
function Y2_kollektivet(t){
  const p=E.io(seg(t,.2,5.6));setCam(0,lerp(-100,-60,p),Math.exp(lerp(Math.log(1.9),Math.log(.13),p)),lerp(960,1200,p),540);
  const z=CAM.z,near=clamp((z-.7)/1.2),C=Y2S.cells,hx=HUB.x,hy=HUB.y+40;
  drawGrid(t,{joined:Y2S.map});
  if(near>0)Y2_traces(t,near,1);
  // fan of links to the shared service
  for(const k of [M,B]){k.save();k.globalCompositeOperation='lighter';k.strokeStyle=OR;k.lineWidth=px(1.25);k.lineCap='round';k.setLineDash([]);k.globalAlpha=(k===M?.10:.06)*(1-near*.6);
    for(let g=0;g<10;g++){k.beginPath();for(let q=g;q<C.length;q+=10){const c=C[q];if(c.tj>t)continue;const e=E.o(seg(t,c.tj,c.tj+.5));k.moveTo(c.x,c.y);k.lineTo(lerp(c.x,hx,e),lerp(c.y,hy,e));}k.stroke();}
    k.restore();}
  // messages in flight
  const ms=Math.max(px(2.6),5);
  if(near<1)for(const k of [M,B]){k.fillStyle=HOT;k.globalAlpha=(k===M?.95:.8)*(1-near);k.beginPath();
    for(const c of C){if(t<c.tj+.5)continue;const P=1.1+2.3*c.ph,f=((t-c.tj)/P+c.ph)%1;const x=lerp(c.x,hx,f),y=lerp(c.y,hy,f);k.rect(x-ms/2,y-ms/2,ms,ms);}k.fill();}
  // members: settled ones in one batch, the ones just joining individually
  const rr=Math.max(px(3.1),14);
  for(const k of [M,B]){k.fillStyle=OR;k.globalAlpha=1;k.beginPath();for(const c of C){if(c.tj+.6>t)continue;k.moveTo(c.x+rr,c.y);k.arc(c.x,c.y,rr,0,TAU);}k.fill();}
  for(const c of C){if(c.tj>t||c.tj+.6<=t)continue;const f=seg(t,c.tj,c.tj+.6);dot(c.x,c.y,rr*lerp(2.1,1,E.o(f)),{c:HOT,a:1});}
  // the shared service becomes the heart of it
  drawHub({a:near});for(let k=0;k<6;k++)drawFolder(k,t,-1,{a:near});
  const far=1-near;if(far>0){dot(HUB.x,HUB.y,px(10),{c:HOT,a:far});for(let k=0;k<4;k++){const q=((t*.55)+k/4)%1;ring(HUB.x,HUB.y,px(lerp(12,520,q)),px(2),{c:OR,a:far*.5*Math.pow(1-q,1.6)});}}
  // counters in the left column
  resetCam();const ca=E.io(seg(t,3.0,3.8));
  if(ca>0){Y2_shadeX(0,360,880,.95*ca);
    const m=70000*E.o(seg(t,3.4,7.0));
    text(fmt(m)+(m>=69999?'+':''),120,470,190,{a:ca,e:.12});text('meddelanden',124,528,46,{a:ca*.62,wt:400,ls:1.5,e:0});
    text('≈1 200 agenter',124,600,46,{a:ca*.62*E.io(seg(t,6.5,7.2)),wt:400,e:0});
    const word='\u201dKOLLEKTIVET\u201d',sz=120,ls=9;let x=120;
    for(let k=0;k<word.length;k++){const q=E.o(seg(t,8.2+k*.06,8.65+k*.06));if(q>0)text(word[k],x,780+16*(1-q),sz,{c:OR,a:q});x+=textW(word[k],sz,'BigShoulders',700,0)+ls;}}
}
