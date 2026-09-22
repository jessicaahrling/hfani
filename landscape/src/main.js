// ---------- scentabell ----------
// Lägg till nya scener här i den ordning de ska ligga i förhandsvisningen.
// init körs en gång (seedad slump); draw(t) ritar rutan vid tiden t (sekunder).
const SCENES=[
 {id:'00_intro',     name:'Intro: stjärnfält → en prick',          dur:5,  draw:s_intro,   init:s_introInit},
 {id:'01_rapport',   name:'Den oberoende rapporten',                dur:9,  draw:s_rapport, init:s_rapportInit},
 {id:'02_traningen', name:'Träningen: belönar OM, inte HUR',        dur:20, draw:s_traningen},
 {id:'03_kap1',      name:'Kapitel 1: Ett ’omöjligt’ uppdrag',      dur:4,  draw:s_kap1},
 // TODO 04_provet, 05_forumet, 05b_citatplats, 06_kollektivet   (se CLAUDE.md)
 {id:'07_kap2',      name:'Kapitel 2: Ett kollektivt fusk',         dur:4,  draw:s_kap2},
 // TODO 08_fusket
 {id:'09_kap3',      name:'Kapitel 3: Att sopa igen alla spår',     dur:4,  draw:s_kap3},
 // TODO 10_projektet, 10b_citatplats_offer
 {id:'11_kap4',      name:'Kapitel 4: Intrånget hos Hugging Face',  dur:4,  draw:s_kap4},
 // TODO 12_forstadygnet, 13_huggingface
 {id:'14_kap5',      name:'Kapitel 5: Hackandet av OpenAI självt',  dur:4,  draw:s_kap5},
 // TODO 15_ingen_larmade, 16_openai, 17_slutet, 18_outro
];
let _inited=false;
function ensureInit(){if(_inited)return;initCtx();SCENES.forEach(s=>s.init&&s.init());_inited=true;}
window.SCENES_META=()=>SCENES.map(s=>({id:s.id,name:s.name,dur:s.dur}));
window.renderFrame=(i,t)=>{ensureInit();begin();SCENES[i].draw(t);finish();};
window.ready=async()=>{await Promise.all([document.fonts.load('700 100px BigShoulders'),document.fonts.load('400 100px BigShoulders'),document.fonts.load('400 50px GeistMono'),document.fonts.load('700 50px GeistMono')]);await document.fonts.ready;ensureInit();return true;};

// ---------- förhandsvisning (visas inte i #render-läge) ----------
(function(){
  const $=s=>document.querySelector(s);let cur=0,playing=true,t=0,last=0,guides=false,loop=true;
  function build(){const list=$('#list');SCENES.forEach((s,i)=>{const b=document.createElement('button');b.className='sc';b.innerHTML=`<span class="n">${String(i+1).padStart(2,'0')}</span><span class="t">${s.name}</span><span class="d">${s.dur}s</span>`;b.onclick=()=>{cur=i;t=0;playing=true;sync();};list.appendChild(b);});}
  function sync(){document.querySelectorAll('.sc').forEach((b,i)=>b.classList.toggle('on',i===cur));$('#play').textContent=playing?'Paus':'Spela';$('#scrub').max=SCENES[cur].dur;}
  function drawGuides(){if(!guides)return;const k=V;k.setTransform(1,0,0,1,0,0);k.globalAlpha=1;k.strokeStyle='rgba(255,255,255,.45)';k.setLineDash([10,10]);k.lineWidth=2;k.strokeRect(80,80,W-160,H-160);k.setLineDash([]);k.strokeStyle='rgba(255,106,0,.35)';k.beginPath();k.moveTo(W/2,0);k.lineTo(W/2,H);k.moveTo(0,H/2);k.lineTo(W,H/2);k.stroke();k.fillStyle='rgba(255,255,255,.6)';k.font='400 26px GeistMono';k.fillText('safe area 80 px',96,118);}
  function frame(now){if(playing){t+=(now-last)/1000;if(t>=SCENES[cur].dur){if(loop)t=0;else{t=SCENES[cur].dur;playing=false;sync();}}}last=now;
    window.renderFrame(cur,t);drawGuides();$('#scrub').value=t;$('#time').textContent=t.toFixed(1)+' / '+SCENES[cur].dur+' s';requestAnimationFrame(frame);}
  window.addEventListener('DOMContentLoaded',async()=>{if(location.hash==='#render'){document.body.classList.add('render');return;}
    await window.ready();build();sync();
    $('#play').onclick=()=>{playing=!playing;sync();};$('#guides').onclick=()=>{guides=!guides;$('#guides').classList.toggle('on',guides);};
    $('#scrub').oninput=e=>{t=+e.target.value;playing=false;sync();};
    document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();playing=!playing;sync();}if(e.code==='ArrowRight'){cur=(cur+1)%SCENES.length;t=0;sync();}if(e.code==='ArrowLeft'){cur=(cur+SCENES.length-1)%SCENES.length;t=0;sync();}});
    last=performance.now();requestAnimationFrame(frame);});
})();
