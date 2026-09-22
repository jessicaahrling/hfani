// ============================================================
//  YOUTUBE 16:9 — yt5.js: 15_ingen_larmade, 16_openai, 17_slutet, 18_outro
//  All top-level identifiers are prefixed Y5.
// ============================================================
function Y5_bez(p0,p1,p2,u){const v=1-u;return [v*v*p0[0]+2*v*u*p1[0]+u*u*p2[0],v*v*p0[1]+2*v*u*p1[1]+u*u*p2[1]];}
// many dots in one path (sharp canvas + bloom canvas); pts = [[x,y] | [x,y,r]]
function Y5_dots(pts,r,c,a,e){if(!pts.length||!(a>0))return;const A=Math.min(1,a*GA);
  const go=k=>{k.fillStyle=c;k.beginPath();for(const p of pts){const rr=p[2]!==undefined?p[2]:r;k.moveTo(p[0]+rr,p[1]);k.arc(p[0],p[1],rr,0,TAU);}k.fill();};
  M.globalAlpha=A;go(M);if(e>0){B.globalAlpha=Math.min(1,A*e);go(B);}}

// ============================================================
// 15  Ingen larmade: 1 200 prickar, 0 larm                      (11 s)
//     The ONLY scene that uses RED / RHOT / YEL.
// ============================================================
const Y5S8={six:[[7,4],[38,7],[18,13],[29,20],[3,22],[44,23]],COLS:48,ROWS:25,SP:22,CX:1188,CY:540};
function Y5_larmInit(){const S=Y5S8,r=mulberry(1194),N=S.COLS*S.ROWS,ids=[];
  for(let q=0;q<N;q++){const c=q%S.COLS,rw=Math.floor(q/S.COLS);if(S.six.some(s=>s[0]===c&&s[1]===rw))continue;ids.push(q);}
  for(let k=ids.length-1;k>0;k--){const j=Math.floor(r()*(k+1));[ids[k],ids[j]]=[ids[j],ids[k]];}
  S.turn=new Float32Array(N).fill(1e9);S.rank=new Int32Array(N).fill(9999);
  ids.forEach((q,k)=>{S.turn[q]=1.5+3.7*Math.pow(k/(ids.length-1),1/3.5);S.rank[q]=k;});}
function Y5_larm(t){const S=Y5S8,hx=330,hy=400,R0=5.5;
  // the human who could have been told
  const hp=E.io(seg(t,.2,1.2));ring(hx,hy,104,3.6,{a:.95,a0:-Math.PI/2,a1:-Math.PI/2+TAU*hp,e:.2});
  icon('head',hx,hy+4,164,3.6,{a:hp,p:hp,e:.15});icon('bust',hx,hy+4,164,3.6,{a:hp,p:hp,e:.15});
  const X=c=>S.CX+(c-(S.COLS-1)/2)*S.SP,Y=r=>S.CY+(r-(S.ROWS-1)/2)*S.SP;
  const allRed=seg(t,7.9,8.6);
  const white=[],reds=Array.from({length:10},()=>[]);
  for(let r=0;r<S.ROWS;r++)for(let c=0;c<S.COLS;c++){const ap=E.ob(seg(t,.15+(c+r)*.018,.5+(c+r)*.018));if(ap<=0)continue;const q=r*S.COLS+c,x=X(c),y=Y(r);
    const k=S.six.findIndex(s=>s[0]===c&&s[1]===r);
    const amb=lerp(1,.91+.09*Math.sin(t*1.7-(c+r)*.13),allRed);
    if(k<0){const tt=S.turn[q],f=seg(t,tt,tt+.35);
      if(f<=0){if(ap>=1)white.push([x,y]);else dot(x,y,R0*ap,{a:.95,e:.14});continue;}
      const big=S.rank[q]<60;
      if(f>=1&&!(S.rank[q]<28&&t<tt+.8)){reds[Math.max(0,Math.min(9,Math.floor((amb-.82)/.18*9.99)))].push([x,y]);continue;}
      dot(x,y,R0*(1+(f<1?(big?.95:.4)*Math.sin(f*Math.PI):0)),{c:(f<.5&&big)?RHOT:RED,a:amb,e:1});
      if(S.rank[q]<28)ringPulse(x,y,t,tt,.75,7,34,2.4,{c:RED});
      continue;}
    // the six who hesitated
    const ty=2.6+k*.35,tr=6.3+k*.3;
    if(t<ty){if(ap>=1)white.push([x,y]);else dot(x,y,R0*ap,{a:.95,e:.14});continue;}
    if(t<tr){const near=seg(t,tr-.6,tr),sp=lerp(1,2.2,near),n1=Math.sin(t*31*sp+k*7.3)*Math.sin(t*17.7*sp+k*2.1),fl=n1>.05?1:(n1>-.45?.7:.32);
      const jx=Math.sin(t*43+k*3)*1.3,jy=Math.cos(t*37+k*5)*1.3,pop=E.ob(seg(t,ty,ty+.35));
      dot(x+jx,y+jy,lerp(R0,8.6,pop),{c:YEL,a:fl,e:1});ring(x,y,15+1.5*Math.sin(t*6+k),2,{c:YEL,a:.75*fl*pop,e:.8});ringPulse(x,y,t,ty,.8,8,40,2.4,{c:YEL});
      continue;}
    const f=seg(t,tr,tr+.4);dot(x,y,R0*(1+(f<1?1.3*Math.sin(f*Math.PI):0)),{c:f<.5?RHOT:RED,a:amb,e:1});ringPulse(x,y,t,tr,.9,8,52,2.8,{c:RED});}
  Y5_dots(white,R0,WH,.95,.14);
  reds.forEach((b,i)=>Y5_dots(b,R0,RED,.82+(i+.5)/10*.18,1));
  // 0 larm
  const zp=E.ob(seg(t,4.4,5.0));
  if(zp>0){text('0',250,760,260*lerp(.8,1,zp),{a:Math.min(1,zp),e:.15});text('larm',250+textW('0',260)+14,760,60,{a:Math.min(1,zp)*.66,wt:400,ls:1.5,e:0});}
}

// ============================================================
// 16  Nästa våg: det övergivna forumet -> OpenAI:s kluster        (23 s)
// ============================================================
const Y5S9={};
function Y5_openaiInit(){const S=Y5S9,r=mulberry(956);S.C=[1240,540];S.R=240;S.F=[360,820,440,190];
  S.ring=[];for(let k=0;k<12;k++){const a=-Math.PI/2+k/12*TAU;S.ring.push({x:S.C[0]+S.R*Math.cos(a),y:S.C[1]+S.R*Math.sin(a),T:8.9+k*.2});}
  S.slots=[];for(let q=0;q<2;q++)for(let c=0;c<4;c++)S.slots.push([360+(c-1.5)*98,793+q*72]);
  // arc 200–340 deg, d 205–280 (spec: 195–345, 255–340) so the hovering agents stay inside the 80 px safe area
  S.ag=[];for(let k=0;k<36;k++){const a=(200+140*r())*Math.PI/180,d=205+75*r();S.ag.push({sx:-60-260*r(),sy:600+300*r(),x:360+d*Math.cos(a),y:820+d*Math.sin(a)*.72,tin:.5+1.7*r(),oa:r()*TAU,or:100+62*r(),os:(.25+.3*r())*(r()<.5?-1:1),tg:5.8+1.4*r(),ph:r()*TAU});}
  S.old=[];for(let k=0;k<44;k++){const a=r()*TAU;S.old.push([360+Math.cos(a)*(700+r()*500),820+Math.sin(a)*(700+r()*500)]);}
  S.dust=[];for(let k=0;k<50;k++)S.dust.push({x:110+r()*520,y:640+r()*330,ph:r()*TAU,s:.4+r()});
  S.keys=[];for(let k=0;k<64;k++){const n=S.ring[(k*5)%12];S.keys.push({n,sp:11.6+4.3*Math.pow(k/64,.9),j:(r()-.5)*90,rot:-.5+(r()-.5)*.8});}}
function Y5_openai(t){const S=Y5S9,[cx,cy]=S.C,[fx,fy,fw,fh]=S.F;
  const zk=E.io(seg(t,16.6,18.0));if(zk>0)setCam(lerp(960,1620,zk),lerp(540,200,zk),lerp(1,2.6,zk),960,lerp(540,500,zk));
  // the abandoned forum: dead links, dust
  const fa=E.io(seg(t,0,.8));
  D(OR,fa*.07,0,k=>{k.strokeStyle=OR;k.lineWidth=1.4;k.beginPath();for(const q of S.old){k.moveTo(fx,fy);k.lineTo(q[0],q[1]);}k.stroke();});
  for(const d of S.dust)dot(d.x+Math.sin(t*.3*d.s+d.ph)*26,d.y+Math.cos(t*.23*d.s+d.ph)*18,1.6+d.s,{a:fa*.22*(1-seg(t,4,6)),e:0});
  rrect(fx,fy,fw,fh,14,3,{a:fa*.8,e:.12});line(fx-fw/2+10,fy-fh/2+30,fx+fw/2-10,fy-fh/2+30,1.8,{a:fa*.4,e:0});for(let k=0;k<3;k++)dot(fx-fw/2+24+k*17,fy-fh/2+15,4,{a:fa*.6,e:0});
  S.slots.forEach((sl,q)=>{const lit=E.io(seg(t,3.0+q*.28,3.5+q*.28));icon('folder',sl[0],sl[1],52,2.8,{c:OR,a:fa*lerp(.3,1,lit),fill:`rgba(255,106,0,${lerp(.05,.2,lit)})`,e:lerp(.15,1,lit)});ringPulse(sl[0],sl[1],t,3.0+q*.28,.7,20,56,2.2,{c:OR});
    // what the first wave left behind: keys rise, then fly to the cluster
    const kp=seg(t,3.3+q*.28,3.8+q*.28);if(kp>0){const go=E.io(seg(t,5.9+q*.12,8.3+q*.05));const ky=q<4?678:634,rise=E.o(kp);
      const p=Y5_bez([sl[0]+(q<4?0:22),lerp(sl[1]-20,ky,rise)],[sl[0]+150,560],[cx,cy],go);if(go<1)icon('key',p[0],p[1]-6*Math.sin(t*2+q),46*E.ob(kp)*lerp(1,.5,go),2.8,{c:OR,a:1,rot:-.6});}});
  // OpenAI's research cluster
  const bp=E.io(seg(t,.3,2.0));
  const zf=1-seg(t,16.5,16.9);   // labels and counter fade out before the camera move can carry them past the safe area
  text('OpenAI',1000,190,74,{a:E.io(seg(t,.8,1.6))*zf,ls:1.5,e:.12});
  ring(cx,cy,S.R,2.2,{a:.35,a0:-Math.PI/2,a1:-Math.PI/2+TAU*bp,e:0});
  const adm=E.ob(seg(t,8.5,9.0));
  S.ring.forEach((n,k)=>{const sp=E.io(seg(t,.6+k*.06,1.5+k*.06));line(cx,cy,n.x,n.y,2,{a:.3,p:sp,e:0});const on=E.io(seg(t,n.T,n.T+.35));if(on>0)line(cx,cy,n.x,n.y,3,{c:OR,a:.85,p:on});
    const fl=E.ob(seg(t,n.T+.3,n.T+.7));D('#000',1,0,q=>{q.fillStyle='#000';q.beginPath();q.roundRect(n.x-30,n.y-30,60,60,12);q.fill();});
    if(fl>0){serverNode(n.x,n.y,60*lerp(.7,1,fl),3,{c:OR,fill:OR});ringPulse(n.x,n.y,t,n.T+.3,.8,34,78,2.4,{c:OR});}else serverNode(n.x,n.y,60,2.6,{a:.9*sp});});
  D('#000',1,0,q=>{q.fillStyle='#000';q.beginPath();q.roundRect(cx-49,cy-49,98,98,20);q.fill();});
  if(adm>0){serverNode(cx,cy,98*lerp(.75,1,adm),3.4,{c:OR,fill:OR});ringPulse(cx,cy,t,8.5,1.2,56,230,3.6,{c:OR});ringPulse(cx,cy,t,8.8,1.2,56,230,2.4,{c:HOT});}else serverNode(cx,cy,98,3,{a:bp});
  rrect(cx,cy,118,118,24,2,{c:adm>0?OR:WH,a:.55*bp});
  // the new wave: orange agents with a white collar, first to the forum, then up into the cluster
  const gp=E.io(seg(t,5.4,6.3));poly([[400,719],[800,700],[cx,cy+66]],2.2,{c:OR,a:.5*(1-seg(t,8.6,9.6)),p:gp,dash:[4,12]});
  for(const a of S.ag){const e1=E.io(seg(t,a.tin,a.tin+1.9));let x=lerp(a.sx,a.x,e1)+Math.sin(t*1.1+a.ph)*5,y=lerp(a.sy,a.y,e1)+Math.cos(t*.9+a.ph)*4;
    const e2=E.io(seg(t,a.tg,a.tg+2.3));if(e2>0){const ang=a.oa+t*a.os,ox=cx+Math.cos(ang)*a.or,oy=cy+Math.sin(ang)*a.or;const p=Y5_bez([x,y],[800+a.ph*10,700],[ox,oy],e2);x=p[0];y=p[1];}
    if(e1<=0)continue;dot(x,y,8,{c:OR});ring(x,y,13.5,2,{a:.9,e:.1});}
  // nearly a thousand secrets read out
  const kt=[1534,850];
  for(const k of S.keys){const u=seg(t,k.sp,k.sp+1.15);if(u<=0||u>=1)continue;const p=Y5_bez([k.n.x,k.n.y],[lerp(k.n.x,kt[0],.5)+90+k.j,lerp(k.n.y,kt[1],.5)-40],kt,E.ioq(u));icon('key',p[0],p[1],34,2.4,{c:OR,a:Math.min(seg(u,0,.15),1-seg(u,.85,1)),rot:k.rot+u});}
  const ca=E.io(seg(t,11.4,12.2))*zf;
  if(ca>0){const s=fmt(956*E.o(seg(t,11.9,16.2)));text(s,1840,900,176,{a:ca,al:'right',e:.12});icon('key',1840-textW(s,176)-66,842,92,4,{c:OR,a:ca,rot:-.6});
    text('nycklar och lösenord',1836,950,42,{a:ca*.62,wt:400,al:'right',ls:1.2,e:0});}
  // ...including the keys to the watchdog: we move in close as it turns
  if(t>15.6){const ex=1620,ey=200,lwf=1/Math.sqrt(CAM.z),ep=E.ob(seg(t,15.6,16.4)),op=Math.min(1,ep),got=E.io(seg(t,18.4,19.4)),c=got>0?OR:WH;
    const nx=cx+S.R*Math.cos(-.52),ny=cy+S.R*Math.sin(-.52),puls=got>=1?1+.12*Math.sin(t*2.4):1;
    line(ex-36,ey+34,nx+8,ny-8,2*lwf,{c,a:.5*op,dash:[3,10]});
    if(got>0)D(OR,.17*got*puls,.6,k=>{k.fillStyle=OR;k.beginPath();k.moveTo(ex-95,ey);k.quadraticCurveTo(ex,ey-66,ex+95,ey);k.quadraticCurveTo(ex,ey+66,ex-95,ey);k.fill();});
    eyeShape(ex,ey,190,66,Math.max(.03,Math.min(1.1,ep)),3.4*lwf,{c,a:1,e:got>0?1:.2});
    for(let q=0;q<16;q++){const an=q/16*TAU+.2;line(ex+Math.cos(an)*11.5,ey+Math.sin(an)*11.5,ex+Math.cos(an)*19,ey+Math.sin(an)*19,1.5*lwf,{c,a:.55*seg(ep,.5,1)});}
    ring(ex,ey,22*op,3.2*lwf,{c,a:seg(ep,.4,1)});
    if(got>0)dot(ex,ey,22*got*(got>=1?1+.04*Math.sin(t*2.4):1),{c:OR});dot(ex,ey,8*op,{c:got>0?HOT:WH,a:seg(ep,.5,1),e:got>0?1:.3});
    const ku=seg(t,17.2,18.4);if(ku>0&&ku<1){const p=Y5_bez([cx,cy],[1500,300],[ex,ey],E.io(ku));icon('key',p[0],p[1],lerp(58,40,ku),3.2*lwf,{c:OR,rot:-.9+ku});}
    ringPulse(ex,ey,t,18.4,1.1,24,140,3*lwf,{c:OR});ringPulse(ex,ey,t,18.7,1.1,24,140,2*lwf,{c:HOT});ringPulse(ex,ey,t,19.3,1.3,24,140,2*lwf,{c:OR});
    // holdable end: the eye keeps pulsing
    if(t>19.9){const pp=((t-19.9)%1.7)/1.4;if(pp<1)ring(ex,ey,lerp(24,120,E.o(pp)),1.8*lwf,{c:OR,a:.5*Math.sin(pp*Math.PI)});}}
}

// ============================================================
// 17  I dag är de som minst kapabla (utan sköld)                  (18 s)
// ============================================================
const Y5S11={};
function Y5_slutInit(){const S=Y5S11,r=mulberry(2026);S.mini=[];for(let k=0;k<46;k++){const a=r()*TAU,d=44+Math.sqrt(r())*170;S.mini.push({x:Math.cos(a)*d,y:Math.sin(a)*d*.92,ph:r()*TAU});}
  const K=Math.exp(3.4)-1;S.cv=u=>[200+1500*u,940-780*(Math.exp(3.4*u)-1)/K];S.u0=.22;S.P0=S.cv(.22);
  S.curve=[];for(let k=0;k<=100;k++)S.curve.push(S.cv(k/100));S.p0=polyLen(S.curve.slice(0,23))/polyLen(S.curve);
  // a network of networks, growing outward from "today"  (hubs x 160–1760, y 150–950 so members stay inside the safe area)
  const cl=[];let guard=0;while(cl.length<30&&guard++<9000){const x=160+r()*1600,y=150+r()*800;if(Math.hypot(x-S.P0[0],y-S.P0[1]+30)<150)continue;if(cl.every(c=>Math.hypot(c.x-x,c.y-y)>150))cl.push({x,y});}   // keep hubs off the 'i dag' label
  cl.forEach(c=>c.d=Math.hypot(c.x-S.P0[0],c.y-S.P0[1]));cl.sort((p,q)=>p.d-q.d);
  const nodes=[],thin=[],thick=[];
  cl.forEach((c,ci)=>{const tb0=8.8+4.9*Math.pow(ci/cl.length,1/1.7),hub={x:c.x,y:c.y,tb:tb0,hub:true,s:1,ph:r()*TAU,rr:8+r()*5};nodes.push(hub);c.hub=hub;
    const near=cl.slice(0,ci).sort((p,q)=>Math.hypot(p.x-c.x,p.y-c.y)-Math.hypot(q.x-c.x,q.y-c.y)).slice(0,ci<3?1:2+(r()<.4?1:0));near.forEach(o=>thick.push([hub,o.hub]));
    const n=24+Math.floor(r()*16),sg=52+r()*44,mine=[];
    for(let k=0;k<n;k++){const an=r()*TAU,d=sg*(.35+1.45*Math.pow(r(),1.4)),nd={x:clamp(c.x+Math.cos(an)*d,92,1828),y:clamp(c.y+Math.sin(an)*d*.95,92,988),tb:tb0+.15+1.4*r()*Math.min(1,d/(sg*1.6)),s:r(),ph:r()*TAU};
      thin.push([nd,hub]);if(mine.length&&r()<.6){let best=mine[0],bd=1e9;for(const m of mine){const dd=Math.hypot(m.x-nd.x,m.y-nd.y);if(dd<bd){bd=dd;best=m;}}thin.push([nd,best]);}
      mine.push(nd);nodes.push(nd);}});
  S.nodes=nodes;S.edges=thin;S.thick=thick;}
function Y5_slut(t){const S=Y5S11,[px0,py0]=S.P0;
  // a test environment: a small orange network in a white box, shrinking onto "today"
  const sh=E.io(seg(t,3.4,4.9)),sc=lerp(1,.03,sh),bx=lerp(960,px0,sh),by=lerp(540,py0,sh);
  if(sh<1){const ba=1-seg(sh,.85,1);rrect(bx,by,520*sc,520*sc,26*sc,3.2,{a:.9*ba,p:E.io(seg(t,0,.9)),e:.15});
    const ma=E.io(seg(t,.4,1.4))*ba;
    D(OR,ma*.3,.5,k=>{k.strokeStyle=OR;k.lineWidth=1.4;k.beginPath();for(const m of S.mini){k.moveTo(bx,by);k.lineTo(bx+m.x*sc,by+m.y*sc);}k.stroke();});
    for(const m of S.mini)dot(bx+(m.x+Math.sin(t+m.ph)*4)*sc,by+(m.y+Math.cos(t*.8+m.ph)*4)*sc,Math.max(1.2,7*sc),{c:OR,a:ma});dot(bx,by,Math.max(2,15*sc),{c:HOT,a:ma});}
  // the curve
  const dim=lerp(1,.3,E.io(seg(t,10.5,13.5)));
  const ax=E.io(seg(t,3.8,4.8));line(200,940,1700,940,2.2,{a:.45*dim,p:ax,e:0});line(200,940,200,140,2.2,{a:.45*dim,p:ax,e:0});
  const c1=E.io(seg(t,4.4,5.4)),c2=E.i(seg(t,6.4,8.9));
  poly(S.curve,4,{a:.95*dim,p:S.p0*c1,e:.2});
  if(c2>0){poly(S.curve,3.6,{a:.9*dim,p0:S.p0,p:lerp(S.p0,1,c2),dash:[14,12],e:.2});
    const hp=E.o(seg(t,8.85,9.1));if(hp>0){const h=S.cv(1),g=S.cv(.985),dx=h[0]-g[0],dy=h[1]-g[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,al=34*hp;
      const arm=an=>[h[0]-(ux*Math.cos(an)-uy*Math.sin(an))*al,h[1]-(ux*Math.sin(an)+uy*Math.cos(an))*al];
      poly([arm(.45),h,arm(-.45)],3.6,{a:.9*dim*hp,e:.2});}}
  // the tangle that follows
  if(t>8.7){for(const k of [M,B]){k.save();k.globalCompositeOperation='lighter';k.strokeStyle=OR;k.lineWidth=1.5;k.lineCap='round';k.setLineDash([]);k.globalAlpha=k===M?.3:.14;
      for(let g=0;g<6;g++){k.beginPath();for(let q=g;q<S.edges.length;q+=6){const [a,b]=S.edges[q];if(a.tb>t)continue;const e=E.o(seg(t,a.tb,a.tb+.45));k.moveTo(b.x,b.y);k.lineTo(lerp(b.x,a.x,e),lerp(b.y,a.y,e));}k.stroke();}k.restore();}
    for(const [a,b] of S.thick){if(a.tb>t+.6)continue;const e=E.io(seg(t,a.tb-.6,a.tb));line(b.x,b.y,a.x,a.y,2.8,{c:OR,a:.6,p:e});
      if(e>=1){const f=((t*.45+a.ph)%1);dot(lerp(b.x,a.x,f),lerp(b.y,a.y,f),3.6,{c:HOT,a:Math.sin(f*Math.PI)});}}
    const settled=[];
    for(const n of S.nodes){if(n.tb>t)continue;const f=seg(t,n.tb,n.tb+.4),w=1+.2*Math.sin(t*2.2+n.ph);
      if(n.hub){D('#000',1,0,k=>{k.fillStyle='#000';k.beginPath();k.arc(n.x,n.y,n.rr+9,0,TAU);k.fill();});dot(n.x,n.y,n.rr*E.ob(f),{c:OR});ring(n.x,n.y,(n.rr+9)*w,2,{c:OR,a:.7});ringPulse(n.x,n.y,t,n.tb,.9,n.rr,n.rr+60,2.4,{c:OR});}
      else{const x=n.x+Math.sin(t*.5+n.ph)*3,y=n.y+Math.cos(t*.4+n.ph)*3,rr=(2.3+n.s*2.6);
        if(f<1)dot(x,y,rr*lerp(2.2,1,f),{c:HOT,a:.95});else settled.push([x,y,rr*w]);}}
    Y5_dots(settled,3,OR,.95,1);}
  // today
  const dp=E.ob(seg(t,4.6,5.2));
  if(dp>0){dot(px0,py0,13*dp,{c:OR});ring(px0,py0,24+3*Math.sin(t*3),2.4,{c:OR,a:.7*dp});
    const la=E.io(seg(t,5.0,5.7))*lerp(1,0,seg(t,11.5,13));text('i dag',px0+2,py0-46,58,{a:la,al:'center',e:.12});
    const ru=E.io(seg(t,8.9,12.0));if(ru>0&&ru<1){const h=S.cv(lerp(S.u0,1,ru));dot(h[0],h[1],lerp(13,34,ru),{c:OR});dot(h[0],h[1],lerp(6,16,ru),{c:HOT});}}
}

// ============================================================
// 18  Outro: podden + agera                                         (6 s)
// ============================================================
function Y5_outro(t){const cx=960,cy=420;
  ambient(t,50,.7);
  const rp=E.io(seg(t,.1,1.0));ring(cx,cy,160,4,{a:.95,a0:-Math.PI/2,a1:-Math.PI/2+TAU*rp,e:.2});
  // a sound wave of orange bars
  const pp=E.ob(seg(t,.7,1.2));
  if(pp>0){const n=9,bw=18,gp=14,pitch=bw+gp,x0=cx-(n-1)*pitch/2;
    for(let i=0;i<n;i++){const env=.5+.5*Math.cos((i-4)/4*Math.PI*.55),s=.5+.5*Math.sin(t*(2.1+.5*((i*7)%4))+i*2.3);const h=lerp(30,150,Math.pow(s,1.15)*env)*Math.min(1.08,pp);
      rrect(x0+i*pitch,cy,bw,h,Math.min(bw/2,h/2),0,{c:OR,fill:OR,a:1});}}
  ringPulse(cx,cy,t,1.0,1.2,160,280,2.4,{c:OR});
  // the timeline
  const bp=E.io(seg(t,1.0,1.8));line(360,740,1560,740,4,{a:.35,p:bp,e:0});
  for(let k=0;k<5;k++){const x=360+1200*(k+1)/6;line(x,731,x,749,2,{a:.35*seg(bp,.3+.12*k,.55+.12*k),e:0});}
  const gp=E.o(seg(t,1.5,5.6))*.42+.004*Math.max(0,t-5.6);line(360,740,360+1200*gp,740,6,{c:OR,a:bp});dot(360+1200*gp,740,11*bp,{c:OR});
  const ta=E.io(seg(t,1.4,2.2));text('www.jonasvonessen.se/agera',960,920,72,{a:ta,al:'center',ls:1,e:.12});
}
