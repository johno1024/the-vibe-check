(()=>{
'use strict';
const QA=new URLSearchParams(location.search).get('qa')==='1';

// Service worker registration stays lightweight.
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
#quiz .multi-note{margin:-10px 0 16px;color:#b5acbf;font-size:13px;font-weight:750}
#quiz>.card>.row{margin-top:18px!important;display:grid;grid-template-columns:100px 1fr;gap:10px}
#quiz .btn{width:100%;min-height:54px;border-radius:17px;font-weight:900}
#quiz #nextBtn{background:linear-gradient(135deg,#9d55f5,#e44f9a)}
#intro,#intro .card,#intro .row,#intro .btn,#intro input{position:relative;pointer-events:auto!important}
#intro .btn{z-index:5;touch-action:manipulation;-webkit-tap-highlight-color:rgba(255,255,255,.12)}
@media(max-width:560px){.wrap{padding-left:16px;padding-right:16px}#quiz{min-height:calc(100svh - 90px)}#quiz>.card{padding:20px}.pwa-install{display:none!important}}
`;
document.head.appendChild(style);

// Q22-Q24 are intentionally multi-select. Store the selected answer text itself so
// the existing blind-reveal output remains readable and share links stay self-contained.
const multiQuestions=[
 {text:'Which words describe your ideal relationship?',opts:['Trusting','Playful','Passionate','Peaceful','Adventurous','Supportive','Affectionate','Independent','Emotionally open','Growth-minded']},
 {text:"What instantly makes somebody more attractive to you?",opts:['Confidence','Humor','Kindness','Intelligence','Ambition','Great communication','Style / presentation','Physical appearance','Emotional maturity','Authenticity']},
 {text:'What can turn friendship into attraction for you?',opts:['A deeper emotional connection','Flirting / playful tension','Physical chemistry','Seeing a different side of them','More one-on-one time','Vulnerability','Consistency and effort','A shared experience','Realizing the interest is mutual','It usually does not happen for me']}
];
[21,22,23].forEach((idx,j)=>Object.assign(QUESTIONS[idx],{type:'multi',text:multiQuestions[j].text,opts:multiQuestions[j].opts}));

const baseRenderMulti=window.renderQ;
window.renderQ=function(){
 const q=QUESTIONS[state.idx];
 if(q.type!=='multi')return baseRenderMulti();
 const selected=Array.isArray(state.answers[state.idx])?state.answers[state.idx]:[];
 document.getElementById('sectionName').textContent=q.section;
 document.getElementById('qCount').textContent=`${state.idx+1} / 27`;
 document.getElementById('prog').style.width=((state.idx+1)/27*100)+'%';
 document.getElementById('backBtn').disabled=state.idx===0;
 document.getElementById('nextBtn').textContent=state.idx===26?'Finish':'Next';
 const h=`<span class="pill">${esc(q.section)}</span><div class="qtitle">${esc(q.text)}</div><div class="multi-note">Select all that apply.</div><div class="options">${q.opts.map((o,i)=>`<div class="option ${selected.includes(o)?'selected':''}" onclick="pickMulti(${i})"><div class="badge">${selected.includes(o)?'✓':String.fromCharCode(65+i)}</div><div>${esc(o)}</div></div>`).join('')}</div>`;
 document.getElementById('questionWrap').innerHTML=h;
};
window.pickMulti=function(i){
 const q=QUESTIONS[state.idx],answer=q.opts[i];
 let selected=Array.isArray(state.answers[state.idx])?[...state.answers[state.idx]]:[];
 selected=selected.includes(answer)?selected.filter(x=>x!==answer):[...selected,answer];
 state.answers[state.idx]=selected;
 if(typeof saveProg==='function')saveProg();
 renderQ();
};

const baseNextMulti=window.nextQ;
window.nextQ=function(){
 const q=QUESTIONS[state.idx];
 if(q.type==='multi'&&(!Array.isArray(state.answers[state.idx])||state.answers[state.idx].length===0)&&!QA)return alert('Choose at least one answer before continuing.');
 return baseNextMulti();
};

// IMPORTANT: do not observe body mutations here. The old observer rewrote button
// text from inside its own mutation callback, which could create a self-sustaining
// mutation loop in mobile Safari while the keyboard/input UI was changing.
function syncQuiz(){
 const quiz=document.getElementById('quiz'); if(!quiz||quiz.classList.contains('hidden'))return;
 const n=document.getElementById('nextBtn'),b=document.getElementById('backBtn'),count=document.getElementById('qCount');
 const back='← BACK';
 const next=count&&/^27\s*\/\s*27$/.test(count.textContent.trim())?'LOCK IT IN':'OWN IT →';
 if(b&&b.textContent!==back)b.textContent=back;
 if(n&&n.textContent!==next)n.textContent=next;
}

if(!QA)return;

// Remove the legacy QA overlay so it can never intercept app touches.
const legacy=document.getElementById('qaRoot');if(legacy){legacy.innerHTML='';legacy.style.pointerEvents='none';}

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

// QA-only unanswered navigation. Production behavior remains unchanged.
const normalNext=window.nextQ;
window.nextQ=function(){
 if(typeof saveText==='function')saveText();
 if(state.idx<26){state.idx++;if(typeof saveProg==='function')saveProg();renderQ();return;}
 const blank=state.answers[state.idx]===undefined||state.answers[state.idx]===null||state.answers[state.idx]===''||(Array.isArray(state.answers[state.idx])&&state.answers[state.idx].length===0);
 if(blank){
  const w=document.getElementById('questionWrap'),n=document.getElementById('nextBtn');
  if(w)w.innerHTML='<span class="pill">QA REVIEW COMPLETE</span><div class="qtitle">All 27 questions are reachable without answering.</div><p class="sub">Use Back, the QA Menu, or return Home.</p><button class="btn primary" type="button" onclick="qaPreview()">REVIEW FROM Q1</button><button class="btn secondary" type="button" onclick="goHome()">HOME</button>';
  if(n)n.style.display='none';return;
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
menuBtn.addEventListener('click',open);hub.querySelector('#qaClose').addEventListener('click',close);
hub.addEventListener('click',e=>{if(e.target===hub){close();return;}const a=e.target.dataset.a;if(!a)return;close();if(a==='questions')qaPreview();else if(['aligned','mixed','boundaryA','boundaryB'].includes(a))qaScenario(a);else if(a==='home')goHome();});

// Keep the intro CTA simple: no global input/change listeners and no DOM observer.
const intro=document.getElementById('intro');
if(intro){const start=[...intro.querySelectorAll('button')].find(b=>b.textContent.trim()==='Start the Test');if(start){start.type='button';start.removeAttribute('onclick');start.addEventListener('click',e=>{e.preventDefault();beginQuiz();});}}
})();