// ---------- the facility: a grid of sandboxes around one shared service ----------
const HUB={x:0,y:-250,w:300,h:150};
const TRX=-6;
const inPlaza=(i,j)=>Math.abs(i)<=2&&j>=-4&&j<=-1;
const ckey=(i,j)=>(i+4096)*8192+(j+4096);
function camKeys(t,K){if(t<=K[0].t)return K[0];for(let i=1;i<K.length;i++){if(t<=K[i].t){const a=K[i-1],b=K[i],h=a.hold??a.t;const p=E.io(seg(t,h,b.t));
  return {cx:lerp(a.cx,b.cx,p),cy:lerp(a.cy,b.cy,p),z:Math.exp(lerp(Math.log(a.z),Math.log(b.z),p))};}}return K[K.length-1];}
function clipRect(x,y,w,h,fn){for(const k of [M,B]){k.save();k.beginPath();k.rect(x,y,w,h);k.clip();}fn();M.restore();B.restore();}
function shade(y0,y1,a0,a1){ // black gradient on main, and erase bloom under it
  const s0=M.getTransform();M.setTransform(1,0,0,1,0,0);const g=M.createLinearGradient(0,y0,0,y1);g.addColorStop(0,`rgba(0,0,0,${a0})`);g.addColorStop(1,`rgba(0,0,0,${a1})`);
  M.globalAlpha=1;M.fillStyle=g;M.fillRect(0,Math.min(y0,y1),W,Math.abs(y1-y0));M.setTransform(s0);
  const b0=B.getTransform();B.setTransform(.5,0,0,.5,0,0);const gb=B.createLinearGradient(0,y0,0,y1);gb.addColorStop(0,`rgba(0,0,0,${a0})`);gb.addColorStop(1,`rgba(0,0,0,${a1})`);
  B.globalAlpha=1;B.globalCompositeOperation='destination-out';B.fillStyle=gb;B.fillRect(0,Math.min(y0,y1),W,Math.abs(y1-y0));B.globalCompositeOperation='source-over';B.setTransform(b0);}

function drawGrid(t,o={}){
  const {a=1,wall=1,wallLw=2.2,dotR=14,joined=null,tw=1,skip=null,force=0,wave=null}=o;
  const z=CAM.z,x0=-CAM.tx/z,x1=(W-CAM.tx)/z,y0=-CAM.ty/z,y1=(H-CAM.ty)/z;
  const i0=Math.ceil((x0-50)/100),i1=Math.floor((x1+50)/100),j0=Math.ceil((y0-50)/100),j1=Math.floor((y1+50)/100);
  const n=(i1-i0+1)*(j1-j0+1);
  const lod=clamp((z-.2)/.4),oA=Math.max(lod,force)*wall*a;
  if(oA>.01){M.globalAlpha=oA*.5;M.strokeStyle=WH;M.lineWidth=px(lerp(1,wallLw,lod));M.lineJoin='round';M.setLineDash([]);M.beginPath();
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(inPlaza(i,j))continue;if(wave!==null&&Math.hypot(i*100,j*100)>wave)continue;if(z>1)M.roundRect(i*100-46,j*100-46,92,92,5);else M.rect(i*100-46,j*100-46,92,92);}
    M.stroke();}
  const rs=dotR*z;
  if(n<700&&rs>=2.2){
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(inPlaza(i,j))continue;if(skip&&skip(i,j))continue;if(joined){const tj=joined.get(ckey(i,j));if(tj!==undefined&&tj<=t)continue;}
      const b=Math.floor(hash2(i,j)*3);dot(i*100,j*100,dotR,{a:a*(.86+.14*tw*Math.sin(t*1.7+b*2.1)),e:.14});}
  }else{
    const s=Math.max(1.7,2*rs*.92)/z,h=s/2;M.fillStyle=WH;
    for(let b=0;b<3;b++){M.globalAlpha=a*(.74+.26*tw*Math.sin(t*1.7+b*2.1))*(rs<2.2?.85:1);M.beginPath();
      for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(Math.floor(hash2(i,j)*3)!==b||inPlaza(i,j))continue;if(joined){const tj=joined.get(ckey(i,j));if(tj!==undefined&&tj<=t)continue;}
        if(rs>=2.2){M.moveTo(i*100+dotR,j*100);M.arc(i*100,j*100,dotR,0,TAU);}else M.rect(i*100-h,j*100-h,s,s);}
      M.fill();}
  }
}
function drawHub(o={}){const {a=1,p=1,lw=2.4,c=WH}=o;const {x,y,w,h}=HUB;
  rrect(x,y,w,h,12,px(lw),{c,a:a*.95,p,e:c===WH?.18:.8});
  line(x-w/2+8,y-h/2+26,x+w/2-8,y-h/2+26,px(1.6),{c,a:a*.45*seg(p,.6,1),e:0});
  for(let k=0;k<3;k++)dot(x-w/2+20+k*14,y-h/2+13,3.4,{c,a:a*.7*seg(p,.7,1),e:0});}
const SLOT=k=>[[-105,-35,35,105][k%4],k<4?-264:-212];
function drawFolder(k,t,t0,o={}){const p=seg(t,t0,t0+.45);if(p<=0)return;const [x,y]=SLOT(k);const s=38*E.ob(p);
  icon('folder',x,y,s,px(2.6),{c:OR,a:(o.a??1),fill:'rgba(255,106,0,.16)'});ringPulse(x,y,t,t0,.7,14,44,px(2),{c:OR,a:(o.a??1)});}
function route(i,j){const X=i*100,Y=j*100;if(j===0)return X-6===TRX?[[TRX,-46],[TRX,-175]]:[[X-6,-46],[X-6,-110],[TRX,-110],[TRX,-175]];
  return [[X-6,Y-46],[X-6,Y-50],[X-50,Y-50],[X-50,-110],[TRX,-110],[TRX,-175]];}
function drawPort(i,j,a=1){const X=i*100-6,Y=j*100-46;line(X-5,Y,X+5,Y,px(5),{c:'#000',a:1,e:0,cap:'butt'});line(X-5,Y-3,X-5,Y+3,px(2),{a:a*.8,e:0});line(X+5,Y-3,X+5,Y+3,px(2),{a:a*.8,e:0});}
