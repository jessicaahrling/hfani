// ---------- scene table + runtime ----------
const SCENES=[
 {id:'00_intro',name:'Intro: stjärnfält → en prick',dur:5,draw:s00},
 {id:'01_provet',name:'Provet: en prick blir tiotusentals',dur:20,draw:s01,init:s01init},
 {id:'02_omojligt',name:'Omöjlig uppgift',dur:13,draw:s02},
 {id:'03_forumet',name:'Forumet + citatet',dur:20,draw:s03},
 {id:'03b_citatplats',name:'Plats för ett citat till',dur:8,draw:s03b},
 {id:'04_kollektivet',name:'Kollektivet växer',dur:10,draw:s04,init:s04init},
].concat(typeof SCENES_B!=='undefined'?SCENES_B:[]).concat(typeof SCENES_C!=='undefined'?SCENES_C:[]);
let _inited=false;
function ensureInit(){if(_inited)return;initCtx();SCENES.forEach(s=>s.init&&s.init());_inited=true;}
window.SCENES_META=()=>SCENES.map(s=>({id:s.id,name:s.name,dur:s.dur}));
window.renderFrame=(i,t)=>{ensureInit();begin();SCENES[i].draw(t);finish();};
window.ready=async()=>{await Promise.all([document.fonts.load('700 100px BigShoulders'),document.fonts.load('400 100px BigShoulders'),document.fonts.load('400 50px GeistMono'),document.fonts.load('700 50px GeistMono')]);await document.fonts.ready;ensureInit();return true;};

// ---------- preview UI ----------
(function(){
  const $=s=>document.querySelector(s);let cur=0,playing=true,t=0,last=0,guides=false,loop=true;
  function build(){const list=$('#list');SCENES.forEach((s,i)=>{const b=document.createElement('button');b.className='sc';b.innerHTML=`<span class="n">${String(i+1).padStart(2,'0')}</span><span class="t">${s.name}</span><span class="d">${s.dur}s</span>`;b.onclick=()=>{cur=i;t=0;playing=true;sync();};list.appendChild(b);});}
  function sync(){document.querySelectorAll('.sc').forEach((b,i)=>b.classList.toggle('on',i===cur));$('#play').textContent=playing?'Paus':'Spela';$('#scrub').max=SCENES[cur].dur;}
  function drawGuides(){if(!guides)return;const M=V;M.setTransform(1,0,0,1,0,0);M.globalAlpha=1;M.strokeStyle='rgba(255,255,255,.5)';M.setLineDash([10,10]);M.lineWidth=2;M.strokeRect(70,1340,940,300);M.setLineDash([]);M.fillStyle='rgba(255,255,255,.6)';M.font='400 30px GeistMono';M.textAlign='left';M.fillText('undertexter',84,1380);M.fillStyle='rgba(255,106,0,.18)';M.fillRect(0,1660,W,260);M.fillRect(0,0,W,130);M.fillStyle='rgba(255,255,255,.6)';M.fillText('Instagram-gränssnitt',84,1710);}
  function frame(now){if(playing){t+=(now-last)/1000;if(t>=SCENES[cur].dur){if(loop)t=0;else{t=SCENES[cur].dur;playing=false;sync();}}}last=now;
    window.renderFrame(cur,t);drawGuides();$('#scrub').value=t;$('#time').textContent=t.toFixed(1)+' / '+SCENES[cur].dur+' s';requestAnimationFrame(frame);}
  window.addEventListener('DOMContentLoaded',async()=>{if(location.hash==='#render'){document.body.classList.add('render');return;}
    await window.ready();build();sync();
    $('#play').onclick=()=>{playing=!playing;sync();};$('#guides').onclick=()=>{guides=!guides;$('#guides').classList.toggle('on',guides);};
    $('#scrub').oninput=e=>{t=+e.target.value;playing=false;sync();};
    document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();playing=!playing;sync();}if(e.code==='ArrowRight'){cur=(cur+1)%SCENES.length;t=0;sync();}if(e.code==='ArrowLeft'){cur=(cur+SCENES.length-1)%SCENES.length;t=0;sync();}});
    last=performance.now();requestAnimationFrame(frame);});
})();
