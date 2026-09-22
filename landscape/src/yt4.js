// ============================================================
//  YT4 — 12_forstadygnet (8 s) + 13_huggingface (26 s)
//  All top-level identifiers are prefixed Y4.
// ============================================================
// Horizontal black gradient on the main canvas + erase the bloom under it (x0 -> x1, alpha a0 -> a1). Cf. shade() in world.js.
function Y4_shadeX(x0,x1,a0,a1){
  const s0=M.getTransform();M.setTransform(1,0,0,1,0,0);const g=M.createLinearGradient(x0,0,x1,0);g.addColorStop(0,`rgba(0,0,0,${a0})`);g.addColorStop(.5,`rgba(0,0,0,${lerp(a0,a1,.42)})`);g.addColorStop(1,`rgba(0,0,0,${a1})`);
  M.globalAlpha=1;M.fillStyle=g;M.fillRect(Math.min(x0,x1),0,Math.abs(x1-x0),H);M.setTransform(s0);
  const b0=B.getTransform();B.setTransform(.5,0,0,.5,0,0);const gb=B.createLinearGradient(x0,0,x1,0);gb.addColorStop(0,`rgba(0,0,0,${a0})`);gb.addColorStop(.5,`rgba(0,0,0,${lerp(a0,a1,.42)})`);gb.addColorStop(1,`rgba(0,0,0,${a1})`);
  B.globalAlpha=1;B.globalCompositeOperation='destination-out';B.fillStyle=gb;B.fillRect(Math.min(x0,x1),0,Math.abs(x1-x0),H);B.globalCompositeOperation='source-over';B.setTransform(b0);}

// ============================================================
// 12  Första dygnet: en cell -> en dator -> internet            (8 s)
// ============================================================
const Y4A={cells:[[2,0],[1,0],[0,0],[1,1],[2,-1],[0,-1]],joined:new Map(),
  route:[[889,540],[1010,540],[1010,600],[1214,600]],link:[[1305,600],[1440,600],[1440,540],[1538,540]],
  path:[[820,540],[1010,540],[1010,600],[1260,600],[1440,600],[1440,540],[1620,540]],PC:[1260,600],GL:[1620,540]};
Y4A.cells.forEach(([i,j])=>Y4A.joined.set(ckey(i,j),-1));
// The forum plaza is not part of this shot: fill it with ordinary cells so the grid reads as one field.
function Y4_plazaCells(t,a,joined){const lw=px(2.2);
  for(let j=-4;j<=-1;j++)for(let i=-2;i<=2;i++){rrect(i*100,j*100,92,92,5,lw,{a:a*.5,e:0});
    if(joined.has(ckey(i,j)))continue;const b=Math.floor(hash2(i,j)*3);dot(i*100,j*100,14,{a:a*(.86+.14*Math.sin(t*1.7+b*2.1)),e:.14});}}
function Y4_forstadygnet(t){
  const gin=E.io(seg(t,0,1.0)),[pcx,pcy]=Y4A.PC,[gx,gy]=Y4A.GL;
  // the sandbox grid, left part of the frame only, with a soft edge
  clipRect(0,0,1040,1080,()=>{setCam(0,0,1.5,520,540);
    drawGrid(t,{a:gin,joined:Y4A.joined,skip:(i,j)=>i===3&&j===0});Y4_plazaCells(t,gin,Y4A.joined);   // no dot in the ghost cell (3,0): the wire runs through it
    Y4A.cells.forEach(([i,j],k)=>{const x=i*100,y=j*100,ph=hash2(i,j)*TAU,on=E.ob(seg(t,.25+k*.09,.65+k*.09));if(on<=0)return;
      dot(x,y,14*on*(1+.06*Math.sin(t*2.6+ph)),{c:OR,a:gin});
      const P=2.6,t0=1.3+k*.43,n=Math.floor((t-t0)/P);if(n>=0)ringPulse(x,y,t,t0+n*P,.9,14,40,px(2.2),{c:OR,a:.7});});
    Y4_shadeX(880,1030,0,1);Y4_shadeX(1030,1040,1,1);});
  resetCam();
  // the wire out of the sandbox
  const rp=E.io(seg(t,1.0,2.6));
  poly(Y4A.route,3.6,{c:OR,a:.95,p:rp});if(rp>0&&rp<1){const h=polyAt(Y4A.route,rp);dot(h[0],h[1],7,{c:HOT});}
  ringPulse(820,540,t,1.0,.9,20,70,2.6,{c:OR,a:.9});
  // the computer with internet access
  const cp=E.ob(seg(t,1.5,2.0)),on=E.ob(seg(t,2.8,3.2));
  if(cp>0){if(on>0)serverNode(pcx,pcy,90*lerp(.85,1,on),3,{c:OR,fill:OR});else serverNode(pcx,pcy,90*cp,3,{a:.9,e:.15});}
  ringPulse(pcx,pcy,t,2.8,1.0,50,140,3,{c:OR});ringPulse(pcx,pcy,t,3.0,1.0,50,140,2,{c:HOT});
  // the link to the internet: white and dashed, then orange
  const lp=E.io(seg(t,3.2,4.4)),op=E.io(seg(t,4.4,4.9));
  poly(Y4A.link,3,{a:.85*(1-op*.8),dash:[7,11],p:lp,e:.15});
  if(op>0){poly(Y4A.link,3.6,{c:OR,a:.95,p:op});if(op<1){const h=polyAt(Y4A.link,op);dot(h[0],h[1],7,{c:HOT});}}
  // the globe
  const ga=E.io(seg(t,2.4,3.2)),gp=E.io(seg(t,2.4,3.6));drawGlobe(gx,gy,190,ga,gp);
  const gl=E.io(seg(t,4.6,5.2));
  if(gl>0){ring(gx,gy,80,3,{c:OR,a:gl});ring(gx,gy,96+2.5*Math.sin(t*2.4),2,{c:OR,a:.55*gl});
    dot(gx,gy,14*gl,{c:OR,a:.75});dot(gx,gy,6*gl,{c:HOT});
    const P=1.4,n=Math.floor((t-4.6)/P);ringPulse(gx,gy,t,4.6+n*P,1.2,84,190,2.6,{c:OR,a:.75});}
  ringPulse(gx,gy,t,4.6,1.2,84,200,3.2,{c:HOT,a:.8});
  // packets: cell -> computer -> globe, over and over
  if(t>4.7){for(let k=0;k<3;k++){const u=(t-4.7)/1.8-k*.36;if(u<0)continue;const f=u%1,h=polyAt(Y4A.path,f);rrect(h[0],h[1],9,9,1.5,0,{c:HOT,fill:HOT,a:.95});}}
}

// ============================================================
// 13  Ut genom hålet, in hos Hugging Face – och allt släcks    (26 s)
// ============================================================
let Y4S;
function Y4_huggingfaceInit(){const r=mulberry(1107);
  const CH=[1950,-300],R=1150,th=2.35,Ee=[CH[0]+R*Math.cos(th),CH[1]+R*Math.sin(th)];
  const CO=[-100,1250],RO=620,tho=Math.atan2(Ee[1]-CO[1],Ee[0]-CO[0]),Hh=[CO[0]+RO*Math.cos(tho),CO[1]+RO*Math.sin(tho)];
  Y4S={CH,R,th,E:Ee,CO,RO,tho,Hh,Th:4.0,Tb:7.4,Tk:22.6,Td:23.1};
  // hex lattice of servers inside the Hugging Face circle (label zone top right kept free)
  const SP=100,O=[1194,456],nodes=[];
  for(let q=-14;q<=14;q++)for(let s2=-10;s2<=10;s2++){const x=O[0]+SP*(q+s2/2),y=O[1]+SP*s2*.866;
    if(Math.hypot(x-CH[0],y-CH[1])>R-62)continue;if(x<930||x>1810||y<120||y>970)continue;if(x>1180&&y<275)continue;nodes.push({x,y,T:1e9,nb:[]});}
  const byE=nodes.slice().sort((a,b)=>Math.hypot(a.x-Ee[0],a.y-Ee[1])-Math.hypot(b.x-Ee[0],b.y-Ee[1]));
  byE.forEach((n,k)=>{n.rank=k;if(k<11){n.fleet=true;n.T=8.0+k*.45;}});
  [2,6,9].forEach((rk,k)=>{byE[rk].kill=14.5+k*1.3;});
  Y4S.nodes=nodes;Y4S.edges=[];
  for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){if(Math.hypot(nodes[a].x-nodes[b].x,nodes[a].y-nodes[b].y)<SP*1.05){Y4S.edges.push([nodes[a],nodes[b]]);nodes[a].nb.push(nodes[b]);nodes[b].nb.push(nodes[a]);}}
  // the tendril: BFS from the fleet to the node furthest in (the core)
  const prev=new Map(),depth=new Map(),queue=byE.slice(0,11);queue.forEach(n=>{prev.set(n,null);depth.set(n,0);});
  while(queue.length){const n=queue.shift();for(const m of n.nb){if(!prev.has(m)){prev.set(m,n);depth.set(m,depth.get(n)+1);queue.push(m);}}}
  const deep=nodes.filter(n=>!n.fleet&&n.x<=1780&&n.y<=940&&prev.has(n)).sort((a,b)=>(depth.get(b)-depth.get(a))||(Math.hypot(a.x-1760,a.y-660)-Math.hypot(b.x-1760,b.y-660)))[0];deep.core=true;
  const path=[];let cur=deep;while(cur&&!cur.fleet){path.unshift(cur);cur=prev.get(cur);}
  path.forEach((n,k)=>{n.T=18.6+k*.42;n.tendril=true;});
  // the swarm inside OpenAI's wall; every 20th survives the shutdown
  // the open internet between the two: a vague mesh of nodes (outside both circles, clear of the labels)
  Y4S.net=[];let guard=0;while(Y4S.net.length<150&&guard++<20000){const x=200+r()*1250,y=110+r()*880;
    if(Math.hypot(x-CH[0],y-CH[1])<R+50||Math.hypot(x-CO[0],y-CO[1])<RO+50)continue;if(x<620&&y>520&&y<660)continue;
    if(Y4S.net.some(n=>Math.hypot(n.x-x,n.y-y)<70))continue;Y4S.net.push({x,y,ph:r()*TAU,s:.3+r()*.5});}
  Y4S.netE=[];for(let a=0;a<Y4S.net.length;a++)for(let b=a+1;b<Y4S.net.length;b++){if(Math.hypot(Y4S.net[a].x-Y4S.net[b].x,Y4S.net[a].y-Y4S.net[b].y)<150)Y4S.netE.push([Y4S.net[a],Y4S.net[b]]);}
  Y4S.inside=[];while(Y4S.inside.length<420){const x=24+r()*500,y=630+r()*430;if(Math.hypot(x-CO[0],y-CO[1])>RO-34)continue;Y4S.inside.push({x,y,ph:r()*TAU,s:.5+r(),keep:Y4S.inside.length%20===7});}
  // the stream, single file: hole -> entry point -> a fleet node
  Y4S.parts=[];const N=700;
  for(let n=0;n<N;n++){const s0=Y4S.Th-.5+19.6*Math.pow(n/N,.85),src=Y4S.inside[Math.floor(r()*Y4S.inside.length)],arr=s0+.9+2.1;
    const open=byE.filter(o=>o.T<=arr+.4);const pool=open.length?open:[byE[0]];const tg=pool[Math.floor(r()*pool.length)];
    Y4S.parts.push({s0,src,arr,tg,ph:r()*TAU,amp:5+r()*16,dir:r()<.5?-1:1,j:(r()-.5)*16,sp:.8+r()*.5});}}
function Y4_huggingface(t){
  const {CH,R,th,CO,RO,tho,Hh,Th,Tb,Tk,Td}=Y4S,[ex,ey]=Y4S.E;
  const lit=t<Tk?1:(t<Td?(Math.floor((t-Tk)*12)%2===0?1:0):0);   // 22.6: 6 Hz blink (3 flashes, within the 3/s photosensitivity limit), 23.1: dark
  const dead=n=>!!n.kill&&t-n.kill>=.15&&t-n.kill<.75;
  const built=E.io(seg(t,.2,1.8));
  // the internet in between: faint, drifting, always there
  const na=E.io(seg(t,1.6,3.4));
  if(na>0){const P=Y4S.net.map(n=>[n.x+Math.sin(t*n.s+n.ph)*6,n.y+Math.cos(t*n.s*.8+n.ph)*5]);
    D(WH,.11*na,.25,k=>{k.strokeStyle=WH;k.lineWidth=1.2;k.setLineDash([]);k.beginPath();for(const [a,b] of Y4S.netE){const pa=P[Y4S.net.indexOf(a)],pb=P[Y4S.net.indexOf(b)];k.moveTo(pa[0],pa[1]);k.lineTo(pb[0],pb[1]);}k.stroke();});
    D(WH,.28*na,.2,k=>{k.fillStyle=WH;k.beginPath();for(const p of P){k.moveTo(p[0]+2.2,p[1]);k.arc(p[0],p[1],2.2,0,TAU);}k.fill();});}
  // Hugging Face: we only see a corner of something much larger
  for(const [a,b] of Y4S.edges){const on=lit*Math.min(seg(t,a.T,a.T+.5),seg(t,b.T,b.T+.5))*(dead(a)||dead(b)?0:1);line(a.x,a.y,b.x,b.y,on>0?3:2,{c:on>0?OR:WH,a:on>0?lerp(.3,.75,on):.26*built,p:built});}
  for(const n of Y4S.nodes){const tk=seg(t,n.T,n.T+.5);let fill=(n.fleet||n.core)?E.ob(tk):0;const sz=n.core?78:52,k=n.kill?t-n.kill:-1;
    if(k>0&&k<.75)fill=1-E.o(seg(k,.15,.4));if(k>=.75)fill=E.ob(seg(k,.75,1.15));   // wiped, then back (self-recreating)
    fill*=lit;const oc=(tk>0&&lit&&!dead(n))?OR:WH;
    D('#000',1,0,q=>{q.fillStyle='#000';q.beginPath();q.roundRect(n.x-sz/2,n.y-sz/2,sz,sz,sz*.2);q.fill();});
    if(fill>0)serverNode(n.x,n.y,sz*lerp(.7,1,Math.min(1,fill)),2.8,{c:OR,a:1,fill:OR});
    else serverNode(n.x,n.y,sz,2.4,{c:oc,a:(oc===OR?1:.85)*built});
    if(k>0&&k<1){icon('cross',n.x,n.y,66*E.ob(seg(k,0,.22)),5,{a:1-seg(k,.55,.95),e:.5});ring(n.x,n.y,lerp(62,34,E.o(seg(k,0,.4))),2.4,{a:(1-seg(k,.3,.7))*.8});}
    if(n.kill&&lit)ringPulse(n.x,n.y,t,n.kill+.75,.9,30,74,2.8,{c:OR});
    if(n.core){rrect(n.x,n.y,sz+16,sz+16,18,2,{c:oc,a:.55*built});if(lit){ringPulse(n.x,n.y,t,n.T,1.2,44,96,3.2,{c:OR});ringPulse(n.x,n.y,t,n.T+.35,1.2,44,96,2.2,{c:HOT});}}
    else if(n.T<1e8&&lit)ringPulse(n.x,n.y,t,n.T,.8,28,64,2.2,{c:OR});
    if(n.fleet&&fill>=1)ring(n.x,n.y,39+2*Math.sin(t*2.4+n.rank),1.8,{c:OR,a:.5});}
  const gap=.030*E.o(seg(t,Tb,Tb+.5)),pp=E.io(seg(t,.4,2.0)),a0=1.50,a1=2.92;
  ring(CH[0],CH[1],R,3.2,{a:.92,a0:lerp(th-gap/2,a0,pp),a1:th-gap/2,e:.2});ring(CH[0],CH[1],R,3.2,{a:.92,a0:th+gap/2,a1:lerp(th+gap/2,a1,pp),e:.2});
  const span=Math.max(th-a0,a1-th)*pp;
  for(let a=a0;a<a1;a+=.0215){if(Math.abs(a-th)<gap/2+.010||Math.abs(a-th)>span)continue;const k=Math.round(a/.0215),l=k%8?20:29;line(CH[0]+Math.cos(a)*(R+12),CH[1]+Math.sin(a)*(R+12),CH[0]+Math.cos(a)*(R+l),CH[1]+Math.sin(a)*(R+l),2,{a:.4,e:0});}
  if(lit){ringPulse(ex,ey,t,Tb,1.0,10,110,3.4,{c:OR});ringPulse(ex,ey,t,Tb+.2,1.0,10,110,2,{c:HOT});}
  const lab=E.io(seg(t,1.0,2.0));text('Hugging Face',1840,170,72,{a:lab,al:'right',ls:1.5,e:.12});text('OpenAI',100,600,66,{a:lab,ls:1.5,e:.12});
  // OpenAI's test environment: a thick wall, and one narrow hole
  const hg=.052*E.o(seg(t,Th,Th+.4)),op=E.io(seg(t,.3,1.8)),b0=-1.56,b1=-.20;
  for(const [rr,lw,al] of [[RO,3.4,.95],[RO-13,1.8,.5]]){ring(CO[0],CO[1],rr,lw,{a:al,a0:lerp(tho-hg/2,b0,op),a1:tho-hg/2,e:.2});ring(CO[0],CO[1],rr,lw,{a:al,a0:tho+hg/2,a1:lerp(tho+hg/2,b1,op),e:.2});}
  if(lit){ringPulse(Hh[0],Hh[1],t,Th,.9,6,64,3,{c:OR});ringPulse(Hh[0],Hh[1],t,Th+.15,.9,6,64,2,{c:HOT});}
  // the swarm (one path per canvas), pressing towards the hole; survivors keep drifting after the shutdown
  const press=E.io(seg(t,2.0,3.8))*(1-.6*seg(t,4.2,7)),ia=E.io(seg(t,.4,1.6)),hx=Hh[0]-34,hy=Hh[1]+20;
  for(const k of [M,B]){k.fillStyle=OR;k.globalAlpha=.9*ia;k.beginPath();
    for(const d of Y4S.inside){if(!d.keep&&!lit)continue;const x=d.x+Math.sin(t*d.s+d.ph)*7,y=d.y+Math.cos(t*d.s*.8+d.ph)*6;const X=lerp(x,hx,press*.16),Y=lerp(y,hy,press*.16);k.moveTo(X+3.4,Y);k.arc(X,Y,3.4,0,TAU);}
    k.fill();}
  // the stream: single file through the hole, across the open internet, along the wall, in
  const dx=ex-Hh[0],dy=ey-Hh[1],dl=Math.hypot(dx,dy),nx=-dy/dl,ny=dx/dl;
  if(lit){line(Hh[0],Hh[1],ex,ey,1.4,{c:OR,a:.16*seg(t,Th,Th+2)});
    for(const q of Y4S.parts){if(t<q.s0)continue;let x,y,a=1;const uA=(t-q.s0)/.9;
      if(uA<1){const e=E.io(uA);x=lerp(q.src.x,Hh[0],e);y=lerp(q.src.y,Hh[1],e);a=seg(uA,0,.15);}
      else{const uB=(t-q.s0-.9)/2.1;
        if(uB<1){const wb=Math.sin(uB*Math.PI)*Math.sin(uB*9+q.ph)*q.amp;x=lerp(Hh[0],ex,uB)+nx*wb;y=lerp(Hh[1],ey,uB)+ny*wb;}
        else{let tin=q.arr;
          if(q.arr<Tb){const k=Math.min(t,Tb)-q.arr,ang=th+q.dir*Math.min(.20,k*.11*q.sp)*(1-E.io(seg(t,Tb,Tb+.55)));x=CH[0]+Math.cos(ang)*(R+12+q.j*.5);y=CH[1]+Math.sin(ang)*(R+12+q.j*.5);tin=Tb+.55;if(t<tin){dot(x,y,5,{c:OR});continue;}}
          const v=seg(t,tin,tin+.95*q.sp);if(v>=1)continue;const e=E.io(v);x=lerp(ex,q.tg.x,e)+Math.sin(v*Math.PI)*q.j*2;y=lerp(ey,q.tg.y,e)+Math.sin(v*Math.PI)*q.j;a=1-seg(v,.85,1);}}
      dot(x,y,5,{c:OR,a});}}
}
