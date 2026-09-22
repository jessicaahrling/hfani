'use strict';
const W=1920,H=1080,SCX=960,SCY=540;
const OR='#FF6A00',HOT='#FFB677',WH='#FFFFFF';
const TAU=Math.PI*2;
const clamp=(x,a=0,b=1)=>x<a?a:x>b?b:x;
const lerp=(a,b,t)=>a+(b-a)*t;
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const E={
 io:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
 o:x=>1-Math.pow(1-x,3),
 i:x=>x*x*x,
 oq:x=>1-(1-x)*(1-x),
 ioq:x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2,
 ox:x=>x>=1?1:1-Math.pow(2,-10*x),
 ob:x=>{if(x<=0)return 0;if(x>=1)return 1;const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);},
};
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const hash2=(i,j)=>{const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s);};
const fmt=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'\u2009');

let cv,V,mcv,M,bcv,B,tmp,T;
let CAM={z:1,tx:0,ty:0};
function initCtx(){
  cv=document.getElementById('cv');V=cv.getContext('2d');
  mcv=document.createElement('canvas');mcv.width=W;mcv.height=H;M=mcv.getContext('2d');
  bcv=document.createElement('canvas');bcv.width=W/2;bcv.height=H/2;B=bcv.getContext('2d');
  tmp=document.createElement('canvas');tmp.width=W/2;tmp.height=H/2;T=tmp.getContext('2d');
}
function applyCam(){M.setTransform(CAM.z,0,0,CAM.z,CAM.tx,CAM.ty);B.setTransform(.5*CAM.z,0,0,.5*CAM.z,.5*CAM.tx,.5*CAM.ty);}
function setCam(cx,cy,z,sx=SCX,sy=SCY){CAM={z,tx:sx-cx*z,ty:sy-cy*z};applyCam();}
function resetCam(){CAM={z:1,tx:0,ty:0};applyCam();}
const w2s=(x,y)=>[x*CAM.z+CAM.tx,y*CAM.z+CAM.ty];
const px=n=>n/CAM.z;               // screen pixels -> world units under current camera
function begin(){M.setTransform(1,0,0,1,0,0);M.globalAlpha=1;M.globalCompositeOperation='source-over';M.clearRect(0,0,W,H);
  B.setTransform(1,0,0,1,0,0);B.globalAlpha=1;B.clearRect(0,0,W/2,H/2);resetCam();}
let MASK=0,VIG=0.5;
function finish(){
  M.setTransform(1,0,0,1,0,0);M.globalAlpha=1;
  V.setTransform(1,0,0,1,0,0);V.globalAlpha=1;V.globalCompositeOperation='source-over';V.fillStyle='#000';V.fillRect(0,0,W,H);
  T.setTransform(1,0,0,1,0,0);T.globalAlpha=1;
  V.globalCompositeOperation='lighter';
  T.clearRect(0,0,W/2,H/2);T.filter='blur(5px)';T.drawImage(bcv,0,0);T.filter='none';V.globalAlpha=.9;V.drawImage(tmp,0,0,W,H);
  T.clearRect(0,0,W/2,H/2);T.filter='blur(22px)';T.drawImage(bcv,0,0);T.filter='none';V.globalAlpha=.9;V.drawImage(tmp,0,0,W,H);
  V.globalCompositeOperation='source-over';V.globalAlpha=1;V.drawImage(mcv,0,0);
  if(VIG>0){const g=V.createRadialGradient(W/2,H/2,H*0.36,W/2,H/2,W*0.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${VIG})`);V.fillStyle=g;V.fillRect(0,0,W,H);}
  if(MASK>0){const b=V.createLinearGradient(0,H-260,0,H);b.addColorStop(0,'rgba(0,0,0,0)');b.addColorStop(1,`rgba(0,0,0,${MASK})`);V.fillStyle=b;V.fillRect(0,H-260,W,260);}
}
const RED='#FF2B2B',RHOT='#FF9A8F',YEL='#FFD60A';
const emitOf=(c,e)=>e!==undefined?e:(c===WH?.1:1);
let GA=1;
function D(c,a,e,fn){a*=GA;if(!(a>0))return;M.globalAlpha=Math.min(1,a);fn(M);const k=emitOf(c,e);if(k>0){B.globalAlpha=Math.min(1,a*k);fn(B);}}

function dot(x,y,r,o={}){const {c=WH,a=1,e}=o;if(r<=0)return;D(c,a,e,k=>{k.fillStyle=c;k.beginPath();k.arc(x,y,r,0,TAU);k.fill();});}
function ring(x,y,r,lw,o={}){const {c=WH,a=1,e,a0=0,a1=TAU,dash}=o;if(r<=0)return;D(c,a,e,k=>{k.strokeStyle=c;k.lineWidth=lw;k.lineCap='round';k.setLineDash(dash||[]);k.beginPath();k.arc(x,y,r,a0,a1);k.stroke();k.setLineDash([]);});}
function line(x1,y1,x2,y2,lw,o={}){const {c=WH,a=1,e,dash,p=1,p0=0,cap='round'}=o;if(p<=p0)return;
  const ax=lerp(x1,x2,p0),ay=lerp(y1,y2,p0),bx=lerp(x1,x2,p),by=lerp(y1,y2,p);
  D(c,a,e,k=>{k.strokeStyle=c;k.lineWidth=lw;k.lineCap=cap;k.setLineDash(dash||[]);k.beginPath();k.moveTo(ax,ay);k.lineTo(bx,by);k.stroke();k.setLineDash([]);});}
function polyLen(pts){let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;}
function polyAt(pts,p){const L=polyLen(pts);let d=clamp(p)*L;for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(d<=s||i===pts.length-1){const k=s?Math.min(1,d/s):0;return [lerp(pts[i-1][0],pts[i][0],k),lerp(pts[i-1][1],pts[i][1],k)];}d-=s;}return pts[0];}
function polySlice(pts,p0,p1){const L=polyLen(pts),d0=clamp(p0)*L,d1=clamp(p1)*L;const out=[];let acc=0;
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],s=Math.hypot(b[0]-a[0],b[1]-a[1]);const s0=acc,s1=acc+s;
    if(s1>=d0&&s0<=d1&&s>0){const k0=clamp((d0-s0)/s),k1=clamp((d1-s0)/s);const P=[lerp(a[0],b[0],k0),lerp(a[1],b[1],k0)],Q=[lerp(a[0],b[0],k1),lerp(a[1],b[1],k1)];
      if(!out.length)out.push(P);out.push(Q);}
    acc=s1;}
  return out;}
function poly(pts,lw,o={}){const {c=WH,a=1,e,p=1,p0=0,closed=false,dash,fill,join='round',cap='round'}=o;if(p<=p0||pts.length<2)return;
  let P=pts;if(closed)P=pts.concat([pts[0]]);if(p<1||p0>0)P=polySlice(P,p0,p);if(P.length<2)return;
  D(c,a,e,k=>{k.beginPath();k.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)k.lineTo(P[i][0],P[i][1]);if(closed&&p>=1&&p0<=0)k.closePath();
    if(fill){k.fillStyle=fill;k.fill();}
    if(lw>0){k.strokeStyle=c;k.lineWidth=lw;k.lineCap=cap;k.lineJoin=join;k.setLineDash(dash||[]);k.stroke();k.setLineDash([]);}});}
function rrect(cx,cy,w,h,r,lw,o={}){const {c=WH,a=1,e,p=1,dash,fill}=o;
  D(c,a,e,k=>{k.beginPath();k.roundRect(cx-w/2,cy-h/2,w,h,r);if(fill){k.fillStyle=fill;k.fill();}
    if(lw>0){k.strokeStyle=c;k.lineWidth=lw;k.lineJoin='round';k.lineCap='round';if(p<1){const L=2*(w+h)-8*r+TAU*r;k.setLineDash([Math.max(0.001,L*p),L]);}else k.setLineDash(dash||[]);k.stroke();k.setLineDash([]);}});}
function text(s,x,y,size,o={}){const {c=WH,a=1,e,font='BigShoulders',wt=700,al='left',bl='alphabetic',ls=0,stroke=0,dash}=o;
  D(c,a,e,k=>{k.font=`${wt} ${size}px ${font}`;k.textAlign=al;k.textBaseline=bl;k.letterSpacing=ls+'px';
    if(stroke){k.strokeStyle=c;k.lineWidth=stroke;k.lineJoin='round';k.setLineDash(dash||[]);k.strokeText(s,x,y);k.setLineDash([]);}else{k.fillStyle=c;k.fillText(s,x,y);}
    k.letterSpacing='0px';});}
function textW(s,size,font='BigShoulders',wt=700,ls=0){M.save();M.setTransform(1,0,0,1,0,0);M.font=`${wt} ${size}px ${font}`;M.letterSpacing=ls+'px';const w=M.measureText(s).width;M.letterSpacing='0px';M.restore();return w;}
function ringPulse(x,y,t,t0,dur,r0,r1,lw,o={}){const p=seg(t,t0,t0+dur);if(p<=0||p>=1)return;ring(x,y,lerp(r0,r1,E.o(p)),lw,{...o,a:(o.a??1)*Math.pow(1-p,1.4)});}

// ---------- icons (100x100 box, centred on 50,50) ----------
const ICONS={
 folder:["M10 30 L10 78 Q10 84 16 84 L84 84 Q90 84 90 78 L90 38 Q90 32 84 32 L50 32 L42 22 Q40 20 37 20 L16 20 Q10 20 10 26 Z"],
 key:["M44 50 A16 16 0 1 1 12 50 A16 16 0 1 1 44 50 Z","M44 50 L92 50","M76 50 L76 66","M88 50 L88 61"],
 pole:["M30 8 L30 94"],
 pennant:["M30 12 L82 28 L30 46 Z"],
 doc:["M22 8 L60 8 L80 28 L80 92 L22 92 Z","M60 8 L60 28 L80 28"],
 head:["M37 26 A13 13 0 1 1 63 26 A13 13 0 1 1 37 26 Z"],
 bust:["M20 84 Q20 50 50 50 Q80 50 80 84"],
 globe:["M8 50 A42 42 0 1 0 92 50 A42 42 0 1 0 8 50 Z","M50 8 A19 42 0 1 0 50 92 A19 42 0 1 0 50 8 Z","M8 50 L92 50","M16 27 Q50 38 84 27","M16 73 Q50 62 84 73"],
 shield:["M50 8 L86 22 L86 50 Q86 78 50 94 Q14 78 14 50 L14 22 Z"],
 play:["M36 24 L80 50 L36 76 Z"],
 check:["M20 52 L42 74 L82 28"],
 cross:["M26 26 L74 74","M74 26 L26 74"],
 eye:["M6 50 Q50 10 94 50 Q50 90 6 50 Z"],
 iris:["M35 50 A15 15 0 1 1 65 50 A15 15 0 1 1 35 50 Z"],
};
const _ic={};
function getIcon(n){if(!_ic[n]){_ic[n]=ICONS[n].map(d=>{const el=document.createElementNS('http://www.w3.org/2000/svg','path');el.setAttribute('d',d);return {p:new Path2D(d),len:el.getTotalLength()};});}return _ic[n];}
function icon(n,x,y,size,lw,o={}){const {c=WH,a=1,e,p=1,fill=null,rot=0,dash=null,sx=1}=o;const parts=getIcon(n),s=size/100;
  D(c,a,e,k=>{k.save();k.translate(x,y);if(rot)k.rotate(rot);k.scale(s*sx,s);k.translate(-50,-50);k.lineCap='round';k.lineJoin='round';
    for(const pt of parts){if(fill){k.fillStyle=fill;k.fill(pt.p);}
      if(lw>0){k.strokeStyle=c;k.lineWidth=lw/s;if(p<1)k.setLineDash([Math.max(.001,pt.len*p),pt.len]);else k.setLineDash(dash?dash.map(v=>v/s):[]);k.stroke(pt.p);k.setLineDash([]);}}
    k.restore();});}
function gearPts(n,r0,r1){const pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,d=TAU/n;pts.push([Math.cos(a-d*.18)*r1,Math.sin(a-d*.18)*r1],[Math.cos(a+d*.18)*r1,Math.sin(a+d*.18)*r1],[Math.cos(a+d*.32)*r0,Math.sin(a+d*.32)*r0],[Math.cos(a+d*.68)*r0,Math.sin(a+d*.68)*r0]);}return pts;}
function starPts(n,r0,r1,rot=0){const pts=[];for(let i=0;i<n*2;i++){const a=rot+i/(n*2)*TAU,r=i%2?r0:r1;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}return pts;}
const shift=(pts,x,y,s=1,rot=0)=>pts.map(q=>{const c=Math.cos(rot),n=Math.sin(rot);return [x+(q[0]*c-q[1]*n)*s,y+(q[0]*n+q[1]*c)*s];});
function serverNode(x,y,s,lw,o={}){const {c=WH,a=1,e,fill=null,slits=true}=o;rrect(x,y,s,s,s*.2,lw,{c,a,e,fill});
  if(slits){const sc=fill?'#000':c;line(x-s*.24,y-s*.13,x+s*.24,y-s*.13,lw*.9,{c:sc,a:a*(fill?0.9:.75),e:0});line(x-s*.24,y+s*.13,x+s*.06,y+s*.13,lw*.9,{c:sc,a:a*(fill?0.9:.75),e:0});}}
// typewriter with block cursor; lines = array of strings
function typed(lines,x,y,size,lh,p,t,o={}){const {c=WH,cur=OR,a=1,font='GeistMono',wt=400,al='left'}=o;const total=lines.reduce((s,l)=>s+l.length,0);let n=Math.floor(clamp(p)*total+1e-6);
  const cw=textW('M',size,font,wt);let cx=x,cy=y;
  for(let i=0;i<lines.length;i++){const l=lines[i],k=Math.min(l.length,n);const lx=al==='center'?x-l.length*cw/2:x;
    if(k>0)text(l.slice(0,k),lx,y+i*lh,size,{c,a,font,wt,e:c===WH?.18:1});
    if(n<=l.length||i===lines.length-1){cx=lx+k*cw;cy=y+i*lh;n-=k;break;}n-=l.length;}
  const blink=(p>=1||p<=0)?((t*1.6)%1<.55?1:0):1;
  if(blink)D(cur,a,1,k=>{k.fillStyle=cur;k.fillRect(cx+size*.08,cy-size*.82,size*.5,size*1.0);});}
