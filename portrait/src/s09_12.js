// =====================================================================
// 09  Nästa våg: det övergivna forumet -> OpenAI:s eget kluster     (22 s)
// =====================================================================
const S9={};
function s09init(){const r=mulberry(956);S9.C=[540,520];S9.R=235;S9.F=[400,1090,440,190];
  S9.ring=[];for(let k=0;k<12;k++){const a=-Math.PI/2+k/12*TAU;S9.ring.push({x:540+235*Math.cos(a),y:520+235*Math.sin(a),T:8.9+k*.2});}
  S9.slots=[];for(let q=0;q<2;q++)for(let c=0;c<4;c++)S9.slots.push([400+(c-1.5)*98,1063+q*72]);
  S9.ag=[];for(let k=0;k<36;k++){const a=(195+150*r())*Math.PI/180,d=255+85*r();S9.ag.push({sx:-60-260*r(),sy:860+330*r(),x:400+d*Math.cos(a),y:1090+d*Math.sin(a)*.72,tin:.5+1.7*r(),oa:r()*TAU,or:100+62*r(),os:(.25+.3*r())*(r()<.5?-1:1),tg:5.8+1.4*r(),ph:r()*TAU});}
  S9.old=[];for(let k=0;k<44;k++){const a=r()*TAU;S9.old.push([400+Math.cos(a)*(700+r()*500),1090+Math.sin(a)*(700+r()*500)]);}
  S9.dust=[];for(let k=0;k<50;k++)S9.dust.push({x:150+r()*520,y:900+r()*340,ph:r()*TAU,s:.4+r()});
  S9.keys=[];for(let k=0;k<64;k++){const n=S9.ring[(k*5)%12];S9.keys.push({n,sp:11.6+4.3*Math.pow(k/64,.9),j:(r()-.5)*90,rot:-.5+(r()-.5)*.8});}}
function bez(p0,p1,p2,u){const v=1-u;return [v*v*p0[0]+2*v*u*p1[0]+u*u*p2[0],v*v*p0[1]+2*v*u*p1[1]+u*u*p2[1]];}
function s09(t){
  const [cx,cy]=S9.C,[fx,fy,fw,fh]=S9.F;
  const zk=E.io(seg(t,16.6,18.0));if(zk>0)setCam(lerp(540,884,zk),lerp(760,222,zk),lerp(1,3.0,zk),540,lerp(760,690,zk));
  // the abandoned forum
  const fa=E.io(seg(t,0,.8));
  D(OR,fa*.07,0,k=>{k.strokeStyle=OR;k.lineWidth=1.4;k.beginPath();for(const q of S9.old){k.moveTo(fx,fy);k.lineTo(q[0],q[1]);}k.stroke();});
  for(const d of S9.dust)dot(d.x+Math.sin(t*.3*d.s+d.ph)*26,d.y+Math.cos(t*.23*d.s+d.ph)*18,1.6+d.s,{a:fa*.22*(1-seg(t,4,6)),e:0});
  rrect(fx,fy,fw,fh,14,3,{a:fa*.8,e:.12});line(fx-fw/2+10,fy-fh/2+30,fx+fw/2-10,fy-fh/2+30,1.8,{a:fa*.4,e:0});for(let k=0;k<3;k++)dot(fx-fw/2+24+k*17,fy-fh/2+15,4,{a:fa*.6,e:0});
  S9.slots.forEach((sl,q)=>{const lit=E.io(seg(t,3.0+q*.28,3.5+q*.28));icon('folder',sl[0],sl[1],52,2.8,{c:OR,a:fa*lerp(.3,1,lit),fill:`rgba(255,106,0,${lerp(.05,.2,lit)})`,e:lerp(.15,1,lit)});ringPulse(sl[0],sl[1],t,3.0+q*.28,.7,20,56,2.2,{c:OR});
    // what the first wave left behind
    const kp=seg(t,3.3+q*.28,3.8+q*.28);if(kp>0){const go=E.io(seg(t,5.9+q*.12,8.3+q*.05));const hy=948-(q<4?0:44),rise=E.o(kp);const p=bez([sl[0]+(q<4?0:22),lerp(sl[1]-20,hy,rise)],[sl[0]+60,760],[cx,cy],go);if(go<1)icon('key',p[0],p[1]-6*Math.sin(t*2+q),46*E.ob(kp)*lerp(1,.5,go),2.8,{c:OR,a:1,rot:-.6});}});
  // OpenAI's research cluster
  const bp=E.io(seg(t,.3,2.0));
  text('OpenAI',92,236,74,{a:E.io(seg(t,.8,1.6)),ls:1.5,e:.12});
  ring(cx,cy,S9.R,2.2,{a:.35,a0:-Math.PI/2,a1:-Math.PI/2+TAU*bp,e:0});
  const adm=E.ob(seg(t,8.5,9.0));
  S9.ring.forEach((n,k)=>{const sp=E.io(seg(t,.6+k*.06,1.5+k*.06));line(cx,cy,n.x,n.y,2,{a:.3,p:sp,e:0});const on=E.io(seg(t,n.T,n.T+.35));if(on>0)line(cx,cy,n.x,n.y,3,{c:OR,a:.85,p:on});
    const fl=E.ob(seg(t,n.T+.3,n.T+.7));D('#000',1,0,q=>{q.fillStyle='#000';q.beginPath();q.roundRect(n.x-30,n.y-30,60,60,12);q.fill();});
    if(fl>0){serverNode(n.x,n.y,60*lerp(.7,1,fl),3,{c:OR,fill:OR});ringPulse(n.x,n.y,t,n.T+.3,.8,34,78,2.4,{c:OR});}else serverNode(n.x,n.y,60,2.6,{a:.9*sp});});
  D('#000',1,0,q=>{q.fillStyle='#000';q.beginPath();q.roundRect(cx-49,cy-49,98,98,20);q.fill();});
  if(adm>0){serverNode(cx,cy,98*lerp(.75,1,adm),3.4,{c:OR,fill:OR});ringPulse(cx,cy,t,8.5,1.2,56,230,3.6,{c:OR});ringPulse(cx,cy,t,8.8,1.2,56,230,2.4,{c:HOT});}else serverNode(cx,cy,98,3,{a:bp});
  rrect(cx,cy,118,118,24,2,{c:adm>0?OR:WH,a:.55*bp});
  // the new wave: orange agents with a white collar
  const gp=E.io(seg(t,5.4,6.3));poly([[fx+40,fy-fh/2-6],[470,820],[cx,cy+66]],2.2,{c:OR,a:.5*(1-seg(t,8.6,9.6)),p:gp,dash:[4,12]});
  for(const a of S9.ag){const e1=E.io(seg(t,a.tin,a.tin+1.9));let x=lerp(a.sx,a.x,e1)+Math.sin(t*1.1+a.ph)*5,y=lerp(a.sy,a.y,e1)+Math.cos(t*.9+a.ph)*4;
    const e2=E.io(seg(t,a.tg,a.tg+2.3));if(e2>0){const ang=a.oa+t*a.os,ox=cx+Math.cos(ang)*a.or,oy=cy+Math.sin(ang)*a.or;const p=bez([x,y],[470+a.ph*10,800],[ox,oy],e2);x=p[0];y=p[1];}
    if(e1<=0)continue;dot(x,y,8,{c:OR});ring(x,y,13.5,2,{a:.9,e:.1});}
  // nearly a thousand secrets read out
  const kt=[716,905];
  for(const k of S9.keys){const u=seg(t,k.sp,k.sp+1.15);if(u<=0||u>=1)continue;const p=bez([k.n.x,k.n.y],[lerp(k.n.x,kt[0],.5)+90+k.j,lerp(k.n.y,kt[1],.5)-40],kt,E.ioq(u));icon('key',p[0],p[1],34,2.4,{c:OR,a:Math.min(seg(u,0,.15),1-seg(u,.85,1)),rot:k.rot+u});}
  const ca=E.io(seg(t,11.4,12.2));
  if(ca>0){const s=fmt(956*E.o(seg(t,11.9,16.2)));text(s,1004,960,176,{a:ca,al:'right',e:.12});icon('key',1004-textW(s,176)-66,902,92,4,{c:OR,a:ca,rot:-.6});
    text('nycklar och lösenord',1000,1012,42,{a:ca*.62,wt:400,al:'right',ls:1.2,e:0});}
  // ...including the keys to the watchdog: we move in close as it turns
  if(t>15.6){const ex=884,ey=222,lwf=1/Math.sqrt(CAM.z),ep=E.ob(seg(t,15.6,16.4)),op=Math.min(1,ep),got=E.io(seg(t,18.4,19.4)),c=got>0?OR:WH;
    line(ex-36,ey+34,cx+S9.R*Math.cos(-.52)+8,cy+S9.R*Math.sin(-.52)-8,2*lwf,{c,a:.5*op,dash:[3,10]});
    if(got>0)D(OR,.17*got,.6,k=>{k.fillStyle=OR;k.beginPath();k.moveTo(ex-95,ey);k.quadraticCurveTo(ex,ey-66,ex+95,ey);k.quadraticCurveTo(ex,ey+66,ex-95,ey);k.fill();});
    eyeShape(ex,ey,190,66,Math.max(.03,Math.min(1.1,ep)),3.4*lwf,{c,a:1,e:got>0?1:.2});
    for(let q=0;q<16;q++){const an=q/16*TAU+.2;line(ex+Math.cos(an)*11.5,ey+Math.sin(an)*11.5,ex+Math.cos(an)*19,ey+Math.sin(an)*19,1.5*lwf,{c,a:.55*seg(ep,.5,1)});}
    ring(ex,ey,22*op,3.2*lwf,{c,a:seg(ep,.4,1)});
    if(got>0)dot(ex,ey,22*got,{c:OR});dot(ex,ey,8*op,{c:got>0?HOT:WH,a:seg(ep,.5,1),e:got>0?1:.3});
    const ku=seg(t,17.2,18.4);if(ku>0&&ku<1){const p=bez([cx,cy],[760,560],[ex,ey],E.io(ku));icon('key',p[0],p[1],lerp(58,40,ku),3.2*lwf,{c:OR,rot:-.9+ku});}
    ringPulse(ex,ey,t,18.4,1.1,24,140,3*lwf,{c:OR});ringPulse(ex,ey,t,18.7,1.1,24,140,2*lwf,{c:HOT});ringPulse(ex,ey,t,19.3,1.3,24,140,2*lwf,{c:OR});}
}
// =====================================================================
// 10  Varför: belöningen ser OM, inte HUR                           (15 s)
// =====================================================================
const S10={S:[190,1090],G:[860,430],walls:[[120,940,760,940],[320,760,960,760],[120,590,760,590]],
  honest:[[190,1090],[190,1015],[860,1015],[860,850],[220,850],[220,675],[860,675],[860,430]],
  t0:[5.8,7.5,8.4,9.15,9.8,10.35,10.8,11.2,11.55,11.85],du:[1.2,.7,.6,.5,.45,.4,.35,.3,.28,.25]};
function s10(t){
  const [sx,sy]=S10.S,[gx,gy]=S10.G;
  const nCheat=S10.t0.filter((q,k)=>t>=q+S10.du[k]).length,firstBreach=5.8;
  // barriers, with holes where the shortcut went through
  S10.walls.forEach((w,k)=>{const p=E.io(seg(t,.1+k*.12,.9+k*.12)),u=(sy-w[1])/(sy-gy),bx=lerp(sx,gx,u),tb=firstBreach+1.2*u;
    if(t<tb)line(w[0],w[1],w[2],w[3],9,{a:.95,p,cap:'butt',e:.15});
    else{line(w[0],w[1],bx-36,w[1],9,{a:.95,cap:'butt',e:.15});line(bx+36,w[1],w[2],w[3],9,{a:.95,cap:'butt',e:.15});
      const f=seg(t,tb,tb+.7);if(f<1){for(let q=0;q<7;q++){const an=-2.4+q*.27+k,dd=E.o(f)*(50+q*9);rrect(bx+Math.cos(an)*dd,w[1]+Math.sin(an)*dd,9,5,1,0,{a:1-f,fill:WH});}ringPulse(bx,w[1],t,tb,.6,8,70,3,{c:OR});}}});
  // the intended route
  const ha=lerp(.7,.14,clamp(nCheat/6));poly(S10.honest,3.2,{a:ha,p:E.io(seg(t,.3,1.3)),dash:[7,11],e:0});
  S10.honest.slice(1,-1).forEach((q,k)=>{const cp=E.ob(seg(t,.5+k*.1,.9+k*.1));rrect(q[0],q[1],20*cp,20*cp,4,2.6,{a:lerp(.85,.18,clamp(nCheat/6)),fill:'#000'});});
  // the shortcut, reinforced every time it pays
  if(t>5.8){const p=seg(t,5.8,7.0);line(sx,sy,gx,gy,Math.min(17,3.5+nCheat*1.5),{c:OR,a:.95,p:nCheat>0?1:p});}
  // the goal and what gets measured
  const fp=E.io(seg(t,.2,1.1));ring(gx,gy,118,2.8,{a:.6*fp,dash:[6,12],a0:t*.25,a1:t*.25+TAU,e:0});
  icon('pole',gx+16,gy-12,172,4.4,{a:fp,p:fp,e:.15});icon('pennant',gx+16,gy-12,172,4.4,{a:fp,p:fp,e:.15,fill:'rgba(255,255,255,.14)'});
  dot(sx,sy,9,{a:.5*fp,e:0});ring(sx,sy,22,2,{a:.4*fp,e:0});
  // rewards
  const rew=[{t:5.0,c:WH}].concat(S10.t0.map((q,k)=>({t:q+S10.du[k],c:OR})));
  rew.forEach((r,k)=>{const u=seg(t,r.t,r.t+1.0);if(u>0&&u<1)text('+1',gx-150,gy-60-70*E.o(u),lerp(90,120,E.ob(Math.min(1,u*3))),{c:r.c,a:1-E.i(u),al:'center',e:r.c===WH?.3:1});
    if(u>0){icon('check',gx+100,gy-104,50,4.4,{c:r.c,a:(1-u)});const bp=E.ob(seg(t,r.t,r.t+.3));rrect(139+k*37,280,20,64*bp,4,0,{c:r.c,fill:r.c,a:1});}});
  // the runner
  if(t>=.8&&t<5.0){const p=seg(t,.8,5.0),h=polyAt(S10.honest,p);poly(S10.honest,6,{a:.9,p0:Math.max(0,p-.09),p,e:.4});dot(h[0],h[1],16,{e:.6});}
  else if(t<.8||(t>=5.0&&t<5.8)){dot(sx,sy,14*E.ob(seg(t,.2,.6)),{c:t<5?WH:HOT,e:.6});}
  S10.t0.forEach((q,k)=>{const u=seg(t,q,q+S10.du[k]);if(u>0&&u<1){const x=lerp(sx,gx,u),y=lerp(sy,gy,u);line(sx,sy,gx,gy,6,{c:HOT,a:.9,p0:Math.max(0,u-.2),p:u});dot(x,y,14,{c:OR});dot(x,y,7,{c:HOT});}});
  if(t>=7.0){const idle=!S10.t0.some((q,k)=>t>=q&&t<q+S10.du[k]);if(idle)dot(sx,sy,14,{c:OR});}
}
// =====================================================================
// 11  I dag är de som minst kapabla                                 (17 s)
// =====================================================================
const S11={};
function s11init(){const r=mulberry(2026);S11.mini=[];for(let k=0;k<46;k++){const a=r()*TAU,d=44+Math.sqrt(r())*170;S11.mini.push({x:Math.cos(a)*d,y:Math.sin(a)*d*.92,ph:r()*TAU});}
  const K=Math.exp(3.4)-1;S11.cv=u=>[130+830*u,1180-880*(Math.exp(3.4*u)-1)/K];S11.u0=.22;S11.P0=S11.cv(.22);
  S11.curve=[];for(let k=0;k<=100;k++)S11.curve.push(S11.cv(k/100));S11.p0=polyLen(S11.curve.slice(0,23))/polyLen(S11.curve);
  // a network of networks, growing outward from "today"
  const cl=[];let guard=0;while(cl.length<27&&guard++<6000){const x=95+r()*890,y=215+r()*1030;if(cl.every(c=>Math.hypot(c.x-x,c.y-y)>128))cl.push({x,y});}
  cl.forEach(c=>c.d=Math.hypot(c.x-S11.P0[0],c.y-S11.P0[1]));cl.sort((p,q)=>p.d-q.d);
  const nodes=[],thin=[],thick=[];
  cl.forEach((c,ci)=>{const tb0=8.8+4.9*Math.pow(ci/cl.length,1/1.7),hub={x:c.x,y:c.y,tb:tb0,hub:true,s:1,ph:r()*TAU,rr:8+r()*5};nodes.push(hub);c.hub=hub;
    const near=cl.slice(0,ci).sort((p,q)=>Math.hypot(p.x-c.x,p.y-c.y)-Math.hypot(q.x-c.x,q.y-c.y)).slice(0,ci<3?1:2+(r()<.4?1:0));near.forEach(o=>thick.push([hub,o.hub]));
    const n=24+Math.floor(r()*16),sg=52+r()*44,mine=[];
    for(let k=0;k<n;k++){const an=r()*TAU,d=sg*(.35+1.45*Math.pow(r(),1.4)),nd={x:c.x+Math.cos(an)*d,y:c.y+Math.sin(an)*d*.95,tb:tb0+.15+1.4*r()*Math.min(1,d/(sg*1.6)),s:r(),ph:r()*TAU};
      thin.push([nd,hub]);if(mine.length&&r()<.6){let best=mine[0],bd=1e9;for(const m of mine){const dd=Math.hypot(m.x-nd.x,m.y-nd.y);if(dd<bd){bd=dd;best=m;}}thin.push([nd,best]);}
      mine.push(nd);nodes.push(nd);}});
  S11.nodes=nodes;S11.edges=thin;S11.thick=thick;}
function s11(t){
  const [px0,py0]=S11.P0;
  // a test environment, with the outer safeguards switched off
  const sh=E.io(seg(t,3.4,4.9)),sc=lerp(1,.03,sh),bx=lerp(540,px0,sh),by=lerp(720,py0,sh);
  if(sh<1){const ba=1-seg(sh,.85,1);rrect(bx,by,540*sc,540*sc,26*sc,3.2,{a:.9*ba,p:E.io(seg(t,0,.9)),e:.15});
    const ma=E.io(seg(t,.4,1.4))*ba;
    D(OR,ma*.3,.5,k=>{k.strokeStyle=OR;k.lineWidth=1.4;k.beginPath();for(const m of S11.mini){k.moveTo(bx,by);k.lineTo(bx+m.x*sc,by+m.y*sc);}k.stroke();});
    for(const m of S11.mini)dot(bx+(m.x+Math.sin(t+m.ph)*4)*sc,by+(m.y+Math.cos(t*.8+m.ph)*4)*sc,Math.max(1.2,7*sc),{c:OR,a:ma});dot(bx,by,Math.max(2,15*sc),{c:HOT,a:ma});
    const sa=(S11.noShield?0:1)*E.io(seg(t,1.0,1.8))*(1-seg(t,3.2,3.8)),off=E.io(seg(t,1.9,2.5));
    icon('shield',850,330,172,3.8,{a:sa*lerp(1,.45,off),p:E.io(seg(t,1.0,1.9)),dash:off>=1?[7,10]:null,e:.1});line(784,256,916,404,5,{a:sa,p:off,e:.3});}
  // the curve
  const dim=lerp(1,.3,E.io(seg(t,10.5,13.5)));
  const ax=E.io(seg(t,3.8,4.8));line(130,1180,960,1180,2.2,{a:.45*dim,p:ax,e:0});line(130,1180,130,300,2.2,{a:.45*dim,p:ax,e:0});
  const c1=E.io(seg(t,4.4,5.4)),c2=E.i(seg(t,6.4,8.9));
  poly(S11.curve,4,{a:.95*dim,p:S11.p0*c1,e:.2});
  if(c2>0){poly(S11.curve,3.6,{a:.9*dim,p0:S11.p0,p:lerp(S11.p0,1,c2),dash:[14,12],e:.2});const h=S11.cv(lerp(S11.u0,1,c2));if(c2>=1)poly([[h[0]-26,h[1]+14],[h[0]+3,h[1]-10],[h[0]-2,h[1]+30]],3.6,{a:.9*dim,e:.2});}
  // the tangle that follows
  if(t>8.7){for(const k of [M,B]){k.save();k.globalCompositeOperation='lighter';k.strokeStyle=OR;k.lineWidth=1.5;k.lineCap='round';k.globalAlpha=k===M?.3:.14;
      for(let g=0;g<6;g++){k.beginPath();for(let q=g;q<S11.edges.length;q+=6){const [a,b]=S11.edges[q];if(a.tb>t)continue;const e=E.o(seg(t,a.tb,a.tb+.45));k.moveTo(b.x,b.y);k.lineTo(lerp(b.x,a.x,e),lerp(b.y,a.y,e));}k.stroke();}k.restore();}
    for(const [a,b] of S11.thick){if(a.tb>t+.6)continue;const e=E.io(seg(t,a.tb-.6,a.tb));line(b.x,b.y,a.x,a.y,2.8,{c:OR,a:.6,p:e});
      if(e>=1){const f=((t*.45+a.ph)%1);dot(lerp(b.x,a.x,f),lerp(b.y,a.y,f),3.6,{c:HOT,a:Math.sin(f*Math.PI)});}}
    for(const n of S11.nodes){if(n.tb>t)continue;const f=seg(t,n.tb,n.tb+.4),w=1+.2*Math.sin(t*2.2+n.ph);
      if(n.hub){D('#000',1,0,k=>{k.fillStyle='#000';k.beginPath();k.arc(n.x,n.y,n.rr+9,0,TAU);k.fill();});dot(n.x,n.y,n.rr*E.ob(f),{c:OR});ring(n.x,n.y,(n.rr+9)*w,2,{c:OR,a:.7});ringPulse(n.x,n.y,t,n.tb,.9,n.rr,n.rr+60,2.4,{c:OR});}
      else dot(n.x+Math.sin(t*.5+n.ph)*3,n.y+Math.cos(t*.4+n.ph)*3,(2.3+n.s*2.6)*(f<1?lerp(2.2,1,f):w),{c:f<1?HOT:OR,a:.95});}}
  // today
  const dp=E.ob(seg(t,4.6,5.2));
  if(dp>0){dot(px0,py0,13*dp,{c:OR});ring(px0,py0,24+3*Math.sin(t*3),2.4,{c:OR,a:.7*dp});
    const la=E.io(seg(t,5.0,5.7))*lerp(1,.0,seg(t,11.5,13));text('i dag',px0+2,py0-46,58,{a:la,al:'center',e:.12});
    const ru=E.io(seg(t,8.9,12.0));if(ru>0&&ru<1){const h=S11.cv(lerp(S11.u0,1,ru));dot(h[0],h[1],lerp(13,34,ru),{c:OR});dot(h[0],h[1],lerp(6,16,ru),{c:HOT});}}
}
// =====================================================================
// 12  Hela historien på Youtube                                      (5 s)
// =====================================================================
function s12(t){
  const rp=E.io(seg(t,.1,1.0));ring(540,620,150,4,{a:.95,a0:-Math.PI/2,a1:-Math.PI/2+TAU*rp,e:.2});
  const pp=E.ob(seg(t,.7,1.2));if(pp>0)icon('play',548,620,230*pp,0,{c:OR,fill:OR});
  ringPulse(540,620,t,1.0,1.2,150,260,2.4,{c:OR});
  const bp=E.io(seg(t,1.0,1.8));line(190,880,890,880,4,{a:.35,p:bp,e:0});const gp=E.o(seg(t,1.5,4.6))*.42;line(190,880,190+700*gp,880,6,{c:OR,a:bp});dot(190+700*gp,880,11*bp,{c:OR});
  const ta=E.io(seg(t,1.4,2.2));text('Längre version på Youtube',540,1030,78,{a:ta,al:'center',ls:1,e:.12});
}
const SCENES_C=[
 {id:'09_openai',name:'Nästa våg tar OpenAI:s kluster',dur:23,draw:s09,init:s09init},
 {id:'10_traningen',name:'Varför: belöningen ser bara målet',dur:15,draw:s10},
 {id:'11_slutet',name:'Minst kapabla i dag',dur:18,draw:s11,init:s11init},
 {id:'11b_slutet_utan_skold',name:'Minst kapabla i dag (utan sköld)',dur:18,draw:t=>{S11.noShield=true;s11(t);S11.noShield=false;}},
 {id:'12_youtube',name:'Längre version på Youtube',dur:5,draw:s12},
];
