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
