(()=>{
'use strict';
const QA=new URLSearchParams(location.search).get('qa')==='1';

// Keep the PWA registration lightweight. QA must never place an invisible layer over the app.
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}

// Shared NO WARNING-inspired question presentation.
const style=document.createElement('style');
style.textContent=`
#quiz{min-height:calc(100vh - 110px);display:flex;align-items:center}
#quiz>.card{width:100%;margin:0;padding:24px;border-radius:26px;background:rgba(23,21,31,.94);border:1px solid rgba(255,255,255,.10);box-shadow:0 30px 90px rgba(0,0,0,.38)}
#quiz .progress{height:7px;margin:7px 0 20px;background:rgba(255,255,255,.07)}
#quiz .pill{padding:0;border:0;background:transparent;color:#dfc6f3;font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
#quiz .qtitle{font-size:clamp(27px,7vw,42px);line-height:1.05;letter-spacing:-.04em;margin:12px 0 22px;font-weight:900}
#quiz .option{padding:16px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.10);font-weight:700}
#quiz .option.selected{border-color:#b66cff;background:linear-gradient(100deg,rgba(166,108,255,.24),rgba(255,95,162,.12))}
#quiz>.card>.row{margin-top:18px!important;display:grid;grid-template-columns:100px 1fr;gap:10px}
#quiz .btn{width:100%;min-height:54px;border-radius:17px;font-weight:900}
#quiz #nextBtn{background:linear-gradient(135deg,#9d55f5,#e44f9a)}
#intro,#intro .card,#intro .row,#intro .btn{position:relative;pointer-events:auto!important}
#intro .btn{z-index:5;touch-action:manipulation;-webkit-tap-highlight-color:rgba(255,255,255,.12)}
@media(max-width:560px){.wrap{padding-left:16px;padding-right:16px}#quiz{min-height:calc(100svh - 90px)}#quiz>.card{padding:20px}.pwa-install{display:none!important}}
`;
document.head.appendChild(style);

function syncQuiz(){
 const quiz=document.getElementById('quiz'); if(!quiz||quiz.classList.contains('hidden'))return;
 const n=document.getElementById('nextBtn'),b=document.getElementById('backBtn'),count=document.getElementById('qCount');
 if(b)b.textContent='← BACK';
 if(n)n.textContent=count&&/^27\s*\/\s*27$/.test(count.textContent.trim())?'LOCK IT IN':'OWN IT →';
}
new MutationObserver(syncQuiz).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});

if(!QA)return;

// Remove the old QA panel entirely so it cannot intercept touches.
const legacy=document.getElementById('qaRoot'); if(legacy){legacy.innerHTML='';legacy.style.pointerEvents='none';}

const qaStyle=document.createElement('style');
qaStyle.textContent=`
#qaHubBtn{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:90;border:1px solid #a66cff;background:#15101c;color:#fff;border-radius:999px;padding:12px 16px;font:900 14px system-ui;box-shadow:0 12px 35px #0009;touch-action:manipulation}
#qaHub{position:fixed;inset:0;z-index:200;background:#08060be8;display:none;align-items:flex-end;justify-content:center;padding:12px}
#qaHub.open{display:flex}
#qaDrawer{width:min(620px,100%);max-height:82svh;overflow:auto;background:#15111b;border:1px solid #654879;border-radius:24px;padding:16px;box-shadow:0 -20px 70px #000b}
#qaDrawer header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
#qaDrawer h2{margin:0;font:950 20px system-ui}
#qaClose{border:1px solid #584365;background:#251c2d;color:#fff;border-radius:999px;width:40px;height:40px;font-size:22px}
#qaTools{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
#qaTools button{min-height:48px;border:1px solid #513d60;border-radius:13px;background:#251c2d;color:#fff;font:800 13px system-ui;touch-action:manipulation}
body.qa-menu-open{overflow:hidden}
`;
document.head.appendChild(qaStyle);

// QA-only unanswered navigation. Production remains untouched.
const normalNext=window.nextQ;
window.nextQ=function(){
 if(typeof saveText==='function')saveText();
 if(state.idx<26){state.idx++;if(typeof saveProg==='function')saveProg();renderQ();return;}
 const blank=state.answers[state.idx]===undefined||state.answers[state.idx]===null||state.answers[state.idx]==='';
 if(blank){
   const w=document.getElementById('questionWrap'),n=document.getElementById('nextBtn');
   if(w)w.innerHTML='<span class="pill">QA REVIEW COMPLETE</span><div class="qtitle">All 27 questions are reachable without answering.</div><p class="sub">Use Back, the QA Menu, or return Home.</p><button class="btn primary" type="button" onclick="qaPreview()">REVIEW FROM Q1</button><button class="btn secondary" type="button" onclick="goHome()">HOME</button>';
   if(n)n.style.display='none'; return;
 }
 return normalNext();
};
const normalRender=window.renderQ;
window.renderQ=function(){normalRender();const n=document.getElementById('nextBtn');if(n)n.style.display='';syncQuiz();};

const menuBtn=document.createElement('button');menuBtn.id='qaHubBtn';menuBtn.type='button';menuBtn.textContent='🧪 QA Menu';
const hub=document.createElement('div');hub.id='qaHub';hub.innerHTML=`<div id="qaDrawer"><header><div><small>THE VIBE CHECK</small><h2>QA Test Menu</h2></div><button id="qaClose" type="button">×</button></header><div class="tiny">Close this menu to use the app normally. Question Preview lets you move through all 27 questions without answering.</div><div id="qaTools"><button data-a="questions">Question Preview</button><button data-a="aligned">Aligned Results</button><button data-a="mixed">Mixed Results</button><button data-a="boundaryA">Q27 Boundary A</button><button data-a="boundaryB">Q27 Boundary B</button><button data-a="home">QA Home</button></div></div>`;
document.body.append(menuBtn,hub);
const open=()=>{hub.classList.add('open');document.body.classList.add('qa-menu-open')};
const close=()=>{hub.classList.remove('open');document.body.classList.remove('qa-menu-open')};
menuBtn.addEventListener('click',open);
hub.querySelector('#qaClose').addEventListener('click',close);
hub.addEventListener('click',e=>{
 if(e.target===hub){close();return;}
 const a=e.target.dataset.a;if(!a)return;
 close();
 if(a==='questions')qaPreview();
 else if(['aligned','mixed','boundaryA','boundaryB'].includes(a))qaScenario(a);
 else if(a==='home')goHome();
});

// Defensive mobile handler for the intro CTA. It uses the same beginQuiz function as production.
const intro=document.getElementById('intro');
if(intro){
 const start=[...intro.querySelectorAll('button')].find(b=>b.textContent.trim()==='Start the Test');
 if(start){
   start.type='button';
   start.removeAttribute('onclick');
   start.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();beginQuiz();});
 }
}
})();