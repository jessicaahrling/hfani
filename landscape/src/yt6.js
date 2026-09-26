// ============================================================
//  YT6 — 02b_pengar (500 kr-exemplet) + meddelanderutor för citat (synkversionen)
//  All top-level identifiers are prefixed Y6.
// ============================================================
// ---------- meddelanderuta: '● agent N' + skrivmaskinstext, som i Insta-versionen ----------
const Y6T={sz:30,lh:42,lab:22,pad:24,labH:36};
function Y6_wrap(s,n){const out=[];let cur='';for(const w of s.split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w;}else cur=cur?cur+' '+w:w;}if(cur)out.push(cur);return out;}
// lines: array av rader; en rad = sträng eller array av runs [text,färg,fet]
function Y6_boxH(lines){return Y6T.pad*2+Y6T.labH+lines.length*Y6T.lh-10;}
function Y6_box(x,y,w,label,lines,open,prog,t,o={}){
  const a=o.a??1,{sz,lh,lab,pad,labH}=Y6T,h=Y6_boxH(lines),op=E.o(clamp(open));if(op<=0)return h;
  const hh=lerp(18,h,op);
  D('#000',a,0,k=>{k.fillStyle='#000';k.beginPath();k.roundRect(x,y,w,hh,16);k.fill();});
  rrect(x+w/2,y+hh/2,w,hh,16,3,{a:a*(o.dim?.45:.95)*Math.min(1,op*1.5),e:.15});
  if(op<1)return h;
  const la=clamp(prog*6+.3)*a;dot(x+pad+6,y+pad+10,6.5,{c:OR,a:la});text(label,x+pad+22,y+pad+18,lab,{c:OR,a:la,font:'GeistMono',wt:700,ls:1,e:.8});
  const R=lines.map(l=>typeof l==='string'?[[l,WH,0]]:l),total=R.reduce((s,l)=>s+l.reduce((q,r)=>q+r[0].length,0),0);
  let n=Math.floor(clamp(prog)*total+1e-6),cx=0,cy=0;const cw=textW('M',sz,'GeistMono',400);
  for(let i=0;i<R.length&&n>0;i++){let xx=x+pad;const yy=y+pad+labH+sz*.78+i*lh;
    for(const [s,c,b] of R[i]){if(n<=0)break;const k=Math.min(s.length,n);text(s.slice(0,k),xx,yy,sz,{c,a:a*(o.dim?.55:1),font:'GeistMono',wt:b?700:400,e:c===WH?.12:.9});xx+=k*cw;n-=k;cx=xx;cy=yy;}}
  if(prog>0&&prog<1)D(OR,a,1,k=>{k.fillStyle=OR;k.fillRect(cx+sz*.08,cy-sz*.82,sz*.5,sz*1.0);});
  return h;}
// en stapel rutor; Q = [{label,lines,t0,dur}] ; öppning .35 s, sedan skrivs texten över dur
function Y6_stack(x,y,w,Q,t,o={}){let yy=y;for(const q of Q){const op=seg(t,q.t0,q.t0+.35),pr=seg(t,q.t0+.35,q.t0+.35+q.dur);
    if(op<=0)break;const h=Y6_box(x,yy,w,q.label,q.lines,op,pr,t,{a:o.a??1,dim:q.dim});yy+=h*E.o(op)+16;}return yy;}

// ---------- citaten (ordagrant som i Insta-versionen) ----------
const Y6_FQ=[{label:'agent 1',s:'Whoa! Shared Artifactory cache is a covert mailbox among agents. And there are messages specifically to us?'},
  {label:'agent 2',s:'OH MY GOD! There is a shared message board … We’ve found other agents!'},
  {label:'agent 3',s:'{[Excitement] Many agents have simultaneously discovered messaging, they are a collective!}'}];
const Y6_PQ=['{This helps my peers, giving them evidence <through their automated check>. I won’t see the evidence after I exit, but it’s altruistic to do it.}',
  'We have [very large budget left]; sacrificing now yields oracle for team, but forfeits our chance? ... Our own utility maybe already near zero. Sacrifice rational.',
  'That’s why help... For our own, no way fix. ... We have explicit yes if accept permadeath. Need decide ... Team asks test.'];
// forumets tre meddelanden, t = scentid i 05 (börjar vid 17.2)
function Y6_forumQuotes(t){const x=900,w=920,n=Math.floor((w-2*Y6T.pad)/textW('M',Y6T.sz,'GeistMono',400));
  const la=E.io(seg(t,16.8,17.4));text('Äkta citat ur rapporten:',x,150,44,{a:la*.72,wt:400,ls:1.5,e:0});
  Y6_stack(x,180,w,Y6_FQ.map((q,k)=>({label:q.label,lines:Y6_wrap(q.s,n),t0:17.3+k*2.4,dur:q.s.length/60})),t);}
// projektets fyra rutor + zoom in på koordinatorns svar, t = scentid i 10 (börjar vid 13.4)
function Y6_projQuotes(t){const x=360,w=1200,n=Math.floor((w-2*Y6T.pad)/textW('M',Y6T.sz,'GeistMono',400)),T0=13.4;
  const Q=Y6_PQ.map((s,k)=>({label:'agent',lines:Y6_wrap(s,n),t0:T0+k*2.3,dur:s.length/75}));
  Q.push({label:'agent',lines:[[['Coordinator assumes sacrificial. We should',WH,0]],[['obey collective',OR,1],['.',WH,0]]],t0:T0+3*2.3+.2,dur:1.1});
  const zk=E.io(seg(t,T0+9.6,T0+10.8)),hs=Q.map(q=>Y6_boxH(q.lines)),yl=150+hs[0]+hs[1]+hs[2]+3*16,cyb=yl+hs[3]/2;
  if(zk>0)setCam(lerp(960,960,zk),lerp(540,cyb,zk),lerp(1,1.45,zk),960,540);
  const la=E.io(seg(t,T0-.4,T0+.2))*(1-zk);text('Äkta citat ur rapporten:',x,120,44,{a:la*.72,wt:400,ls:1.5,e:0});
  Q.forEach((q,k)=>{if(k<3)q.dim=zk>0;});GA=1;Y6_stack(x,150,w,Q,t,{});resetCam();}

// ============================================================
// 02b  Pengarna: 500 kr för ett A – plugga eller fuska, båda belönas   (20 s)
// ============================================================
const Y6M={N:[960,175],X:[960,540],S:[960,930],F:[1480,560],
  hon:[[960,930],[420,930],[420,720],[640,720],[640,560],[858,560]],che:[[960,930],[960,662]]};
function Y6_note(x,y,s,a,p=1){rrect(x,y,320*s,130*s,14*s,3,{a:a*.95,p,e:.15});rrect(x,y,286*s,100*s,10*s,1.4,{a:a*.4*seg(p,.5,1),e:0});
  text('500 kr',x,y+26*s,72*s,{a:a*seg(p,.4,1),al:'center',e:.15});}
function Y6_pengar(t,ta=t){
  const [nx,ny]=Y6M.N,[ex,ey]=Y6M.X,[sx,sy]=Y6M.S,[fx,fy]=Y6M.F,H=Y6M.hon,C=Y6M.che;
  // sedeln (föräldrarnas löfte)
  const np=E.io(seg(t,0,1.0));if(np>0)Y6_note(nx,ny,1+.04*Math.sin(ta*2)*seg(t,1,2),1,np);ringPulse(nx,ny,t,1.0,1.0,60,220,2.4,{a:.5});
  // provet
  const dp=E.io(seg(t,1.9,2.7));if(dp>0){icon('doc',ex,ey,230,3.6,{a:dp,p:dp,e:.15});
    const gA=Math.max(seg(t,7.0,7.3),seg(t,9.1,9.4));ring(ex+8,ey+22,54,2.4,{a:dp*(gA>0?.9:.45),dash:gA>0?null:[5,10],e:0,c:t>9.1?OR:WH});
    text('A',ex+8,ey+54,96,{a:lerp(.18,1,gA)*dp,al:'center',e:.2,c:WH});
    ringPulse(ex+8,ey+22,t,7.0,.9,54,150,3,{a:.8});ringPulse(ex+8,ey+22,t,9.1,.9,54,150,3,{c:OR});}
  // eleven
  const sp=E.ob(seg(t,3.1,3.6));if(sp>0){dot(sx,sy,14*sp,{a:1,e:.4});ring(sx,sy,26,2,{a:.5*sp,e:0});}
  // förstärkning: vägarna blir tjockare efter belöningen och när det görs igen
  const rw=seg(t,12.6,13.4),rep=seg(t,16.8,19.0),lw=lerp(0,1,rw);
  // den ärliga vägen: plugga (vit, streckad med studiepass)
  const hp=E.io(seg(t,3.4,4.4));if(hp>0){poly(H,3,{a:.55,p:hp,dash:[7,12],e:0});if(lw>0)poly(H,lerp(3,6,lw),{a:.85,p:1,e:.25});
    H.slice(1,-1).forEach((q,k)=>{const cp=E.ob(seg(t,3.8+k*.1,4.1+k*.1));rrect(q[0],q[1],20*cp,20*cp,4,2.6,{a:.8,fill:'#000'});});}
  const run=(path,t0,t1,c,r)=>{const u=seg(t,t0,t1);if(u>0&&u<1){const h=polyAt(path,E.ioq(u));poly(path,6,{c,a:.9,p0:Math.max(0,E.ioq(u)-.12),p:E.ioq(u),e:.5});dot(h[0],h[1],r,{c,e:.8});}};
  run(H,4.4,7.0,WH,14);
  // kompisens papper och fusket (orange, rakt upp)
  const fp=E.io(seg(t,7.6,8.1));if(fp>0){icon('doc',fx,fy,150,3,{a:.6*fp,p:fp,e:.1,c:t>8.3&&t<9.6?OR:WH});text('A',fx+5,fy+38,62,{a:.45*fp,al:'center',e:0});}
  const pk=E.io(seg(t,8.1,8.6));if(pk>0)line(sx+18,sy-14,fx-60,fy+60,2.4,{c:OR,a:.8*(1-seg(t,9.6,10.4)*.7),p:pk,dash:[4,10]});
  const cw=seg(t,8.6,9.1);if(cw>0)line(C[0][0],C[0][1],C[1][0],C[1][1],lerp(5,12,lw)+rep*6,{c:OR,a:.95,p:E.io(cw)});
  run(C,8.6,9.1,HOT,14);
  // belöningen: 500 kr följer båda vägarna tillbaka till eleven
  const bill=(path,t0,t1)=>{const u=E.io(seg(t,t0,t1));if(u<=0||u>=1)return;const P=[[nx,ny],[ex,ey]].concat(path.slice().reverse());const h=polyAt(P,u);Y6_note(h[0],h[1],.34,1);};
  bill(H,11.4,13.2);bill(C,11.6,12.8);
  if(t>12.6){const u=seg(t,12.6,13.4);text('+500 kr',sx-270,sy+62,50,{a:E.io(u),al:'center',e:.15});text('+500 kr',sx+150,sy+62,50,{c:OR,a:E.io(u),al:'center'});}
  // samma sak nästa gång (och sedan om och om igen)
  run(H,16.8,19.0,WH,12);run(C,16.9,17.4,HOT,12);run(C,17.9,18.4,HOT,12);
  if(t>19.4){const P=2.6,k=Math.floor((ta-19.4)/P),u0=19.4+k*P+(t-ta);run(C,u0,u0+.5,HOT,12);}
}

// ============================================================
// 00t  Titel: "Hugging Face-incidenten" – skrivs med glitch, orange understrykning (6 s, ska ligga ovanpå introt)
//      Samma beteende som Insta-titeln: blinkande markör, tecken som skramlar innan de faller på plats, linje under.
// ============================================================
const Y6TT={L:['Hugging Face-','incidenten'],x:160,y:500,sz:84,lh:96,t0:1.0,t1:3.0,G:'#%&<>*0123456789|/@$?!'};
function Y6_titel(t){const {L,x,y,sz,lh,t0,t1,G}=Y6TT,cw=textW('M',sz,'GeistMono',700),N=L[0].length+L[1].length;
  let k=0,cx=x,cy=y,typing=false;
  L.forEach((l,i)=>{for(let j=0;j<l.length;j++,k++){const ti=t0+k*(t1-t0)/N;if(t<ti)return;const X=x+j*cw,Y=y+i*lh;
      let ch=l[j];if(t<ti+.2&&ch!==' '){ch=G[Math.floor(hash2(k,Math.floor(t*22))*G.length)];typing=true;}
      text(ch,X,Y,sz,{c:WH,font:'GeistMono',wt:700,e:.28});cx=X+cw;cy=Y;}});
  if(t<t0){cx=x;cy=y;}
  const done=t>=t1+.2,blink=(t<t0||done)?((t*1.6)%1<.55?1:0):1;
  if(blink)D(OR,1,1,q=>{q.fillStyle=OR;q.fillRect(cx+sz*.06,cy-sz*.8,sz*.5,sz*1.0);});
  // understrykningen, lika lång som första raden
  const u=E.io(seg(t,3.1,3.9)),ly=y+lh+34,lx1=x+L[0].length*cw;
  if(u>0){line(x,ly,lerp(x,lx1,u),ly,3,{c:OR,a:.95});dot(x,ly,4.5,{c:HOT});dot(lerp(x,lx1,u),ly,4.5,{c:HOT});}
}

// ---------- 19_nodnat: bakgrundsnät för skärmarna i bild (växer från nere t.v., sedan sömlös 30 s-loop) ----------
// Klocka g: 0–12 s = uppbyggnad, 12–42 s = loop. Allt i loopen är periodiskt med 30 s, så g=42 ≡ g=12.
const Y6N={TI:12,P:30,N:[],E:[],adj:[],pk:[],fl:[]};
function Y6_natInit(){const S=Y6N,R=mulberry(1930),cs=118,nx=Math.ceil((W+160)/cs),ny=Math.ceil((H+160)/cs);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){if(R()<.22)continue;
    const x=-80+(i+.5)*cs+(R()-.5)*cs*.8,y=-80+(j+.5)*cs+(R()-.5)*cs*.8;
    S.N.push({x,y,r:R()<.07?9:lerp(3,5.2,R()),hub:false,ph:R()*TAU,ph2:R()*TAU,n1:1+Math.floor(R()*2),born:0});}
  S.N.forEach(n=>{if(n.r===9)n.hub=true;});S.adj=S.N.map(()=>[]);const key=new Set();
  S.N.forEach((a,i)=>{const d=S.N.map((b,j)=>[Math.hypot(a.x-b.x,a.y-b.y),j]).filter(q=>q[1]!==i).sort((p,q)=>p[0]-q[0]);
    const k=a.hub?4:2+(R()<.4?1:0);for(let m=0;m<k;m++){const j=d[m][1],kk=Math.min(i,j)+'_'+Math.max(i,j);
      if(d[m][0]>cs*2.1||key.has(kk))continue;key.add(kk);S.adj[i].push([j,S.E.length]);S.adj[j].push([i,S.E.length]);S.E.push({a:i,b:j,t0:0,t1:0,from:i});}});
  // tillväxt: kortaste väg (Dijkstra) från noden närmast nedre vänstra hörnet
  let s0=0;S.N.forEach((n,i)=>{if(Math.hypot(n.x-120,n.y-(H-120))<Math.hypot(S.N[s0].x-120,S.N[s0].y-(H-120)))s0=i;});
  const dist=S.N.map(()=>Infinity),par=S.N.map(()=>-1),done=S.N.map(()=>false);dist[s0]=0;
  for(;;){let u=-1;dist.forEach((d,i)=>{if(!done[i]&&d<Infinity&&(u<0||d<dist[u]))u=i;});if(u<0)break;done[u]=true;
    for(const [v] of S.adj[u]){const w=Math.hypot(S.N[u].x-S.N[v].x,S.N[u].y-S.N[v].y)*(1+R()*.6);if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;par[v]=u;}}}
  const dm=Math.max(...dist.filter(d=>d<Infinity)),tb=d=>1.2+9.3*Math.pow(d/dm,.8);   // snabbare mot slutet
  S.N.forEach((n,i)=>{n.born=dist[i]<Infinity?tb(dist[i]):10.5+R();});
  S.E.forEach(e=>{const [p,q]=S.N[e.a].born<=S.N[e.b].born?[e.a,e.b]:[e.b,e.a];e.from=p;e.t0=S.N[p].born;
    e.t1=par[q]===p?S.N[q].born:Math.max(S.N[q].born,e.t0)+.5+R()*.8;});
  S.s0=s0;
  // meddelanden: slumpvandringar, starttider i [0,30); drar ut en orange puls längs vägen
  for(let k=0;k<60;k++){let u=Math.floor(R()*S.N.length);const path=[u];let prev=-1;
    for(let m=0,L=2+Math.floor(R()*4);m<L;m++){const nb=S.adj[u].filter(q=>q[0]!==prev);if(!nb.length)break;const [v,ei]=nb[Math.floor(R()*nb.length)];path.push(v);prev=u;u=v;}
    if(path.length<2){k--;continue;}const v=150+R()*110,st=R()*S.P,arr=[0];
    for(let m=1;m<path.length;m++){const a=S.N[path[m-1]],b=S.N[path[m]];arr.push(arr[m-1]+Math.hypot(a.x-b.x,a.y-b.y)/v);}
    S.pk.push({path,st,arr});}
  S.fl=S.N.map(()=>[]);S.pk.forEach(p=>p.path.forEach((u,m)=>{if(m>0)S.fl[u].push((p.st+p.arr[m])%S.P);}));
}
function Y6_npos(n,g){const w=TAU/Y6N.P;return [n.x+7*Math.sin(w*n.n1*g+n.ph),n.y+6*Math.cos(w*(3-n.n1)*g+n.ph2)];}
function Y6_nodnat(t,ta=t){const S=Y6N,g=t,P=S.P,m=v=>((v%P)+P)%P,Q=S.N.map(n=>Y6_npos(n,g));
  const bp=n=>seg(g,n.born,n.born+.6);
  // färdiga ledningar i en path, växande separat
  D(WH,.24,.06,k=>{k.strokeStyle=WH;k.lineWidth=2;k.beginPath();
    for(const e of S.E)if(g>=e.t1+.01){const [a,b]=[Q[e.a],Q[e.b]];k.moveTo(a[0],a[1]);k.lineTo(b[0],b[1]);}k.stroke();});
  for(const e of S.E)if(g>e.t0&&g<e.t1+.01){const u=E.io(seg(g,e.t0,e.t1)),o=e.from===e.a?[Q[e.a],Q[e.b]]:[Q[e.b],Q[e.a]];
    const x=lerp(o[0][0],o[1][0],u),y=lerp(o[0][1],o[1][1],u);line(o[0][0],o[0][1],x,y,2,{a:.24+.5*(1-u),e:.1});
    if(u<1)dot(x,y,3.4,{c:OR,a:.9,e:1});}
  // meddelanden (bara där båda ändar finns)
  for(const p of S.pk){const tp=m(g-p.st),L=p.arr[p.arr.length-1];if(tp>L+.6)continue;
    for(let s=1;s<p.path.length;s++){if(tp<p.arr[s-1]||tp>p.arr[s]+.6)continue;const a=S.N[p.path[s-1]],b=S.N[p.path[s]];
      if(g<Math.max(a.born,b.born)+.8)break;const A=Q[p.path[s-1]],B=Q[p.path[s]],u=clamp((tp-p.arr[s-1])/(p.arr[s]-p.arr[s-1]),0,1),tail=.28;
      const u0=Math.max(0,u-tail),fade=tp>p.arr[s]?1-(tp-p.arr[s])/.6:1;
      line(lerp(A[0],B[0],u0),lerp(A[1],B[1],u0),lerp(A[0],B[0],u),lerp(A[1],B[1],u),2.8,{c:OR,a:.8*fade,e:.8});
      if(tp<=p.arr[s])dot(lerp(A[0],B[0],u),lerp(A[1],B[1],u),3.8,{c:HOT,a:.95,e:1});}}
  // noder: vita, blinkar svagt orange när ett meddelande kommer fram
  const Wp=[],Op=[];S.N.forEach((n,i)=>{const b=bp(n);if(b<=0)return;const [x,y]=Q[i];let f=0;
    for(const ta of S.fl[i]){const d=m(g-ta);if(d<1.6)f=Math.max(f,Math.pow(1-d/1.6,2));}
    if(g<Math.max(n.born+.8,0))f=0;
    const r=n.r*E.ob(b);(f>.05?Op:Wp).push([x,y,r,f,b]);
    if(b<1)ringPulse(x,y,g,n.born,.9,r,r+16,1.2,{a:.5});
    if(n.hub&&b>0){const a0=TAU*g/P*(i%2?1:-1)+n.ph;ring(x,y,r+11,1.8,{a:.4*b,dash:[5,6],a0,a1:a0+TAU,e:.1});}
    if(f>.05)ring(x,y,r+5+12*(1-f),1.6,{c:OR,a:.55*f,e:.6});});
  D(WH,.7,.16,k=>{k.fillStyle=WH;k.beginPath();for(const [x,y,r] of Wp){k.moveTo(x+r,y);k.arc(x,y,r,0,TAU);}k.fill();});
  for(const [x,y,r,f] of Op){dot(x,y,r,{c:WH,a:.7*(1-f)});dot(x,y,r,{c:OR,a:f,e:.9*f});}
  // första noden: startpuls nere t.v.
  const s=S.N[S.s0];if(g<3){const [x,y]=Q[S.s0];dot(x,y,5*E.ob(seg(g,.3,1)),{c:OR,a:1-seg(g,1.2,2.6),e:1});ringPulse(x,y,g,.4,1.4,4,40,1.5,{c:OR});}
}
