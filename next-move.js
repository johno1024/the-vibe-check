(()=>{'use strict';
const BANK={
'Communication':[
['💬 TEXT — SAY IT CLEARER','Pick one answer where your styles differed. Each person explains what they actually need in that situation in one sentence.'],
['🎙️ VOICE — HEAR ME OUT','Send a short voice note answering: “What helps you feel understood when something matters?” Then compare.']],
'Emotional Connection':[
['💭 REVEAL — LITTLE THING, BIG DEAL','Each name one small thing the other person could do that would make you feel more emotionally connected.'],
['🎙️ VOICE — FEELING SEEN','Finish this in a voice note: “I feel closest to someone when they…” Then trade answers.']],
'Quality Time':[
['📅 PICK ONE — YOUR KIND OF TIME','Each choose one: planned date, spontaneous adventure, stay-in night, errands together, or long conversation. Find the overlap and make it your next hangout.'],
['📸 PHOTO — SAVE THIS SPOT','Send a photo of somewhere you would genuinely enjoy spending uninterrupted time together. No explanation until they react.']],
'Chemistry':[
['😏 TEXT — WHAT I NOTICE','Tell each other one non-explicit thing that creates chemistry for you: eye contact, humor, confidence, closeness, teasing, conversation, or something else.'],
['🎵 MUSIC — VIBE IN A SONG','Send one song that captures the energy between you right now. Explain the choice only after both songs are sent.']],
'Relationship Expectations':[
['👀 REAL TALK — DEFINE THE VIBE','Each finish: “If this connection became closer, I would want…” Compare answers without trying to persuade each other.'],
['🧭 CHECK-IN — MORE / SAME / LESS','Separately choose whether you want more closeness, roughly the same vibe, or more space. Reveal together, then talk about what that means.']]
};
function readScores(){
 return [...document.querySelectorAll('#scoreGrid .score')].map(el=>{
   const strong=el.querySelector('strong');
   const name=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE)?.textContent?.trim()||'';
   return {name,score:parseInt(strong?.textContent)||0};
 }).filter(x=>BANK[x.name]);
}
function renderNextMove(){
 const box=document.getElementById('conversationStarters');
 const results=document.getElementById('results');
 if(!box||!results||results.classList.contains('hidden'))return;
 const scores=readScores();
 if(scores.length<3)return;
 const low=[...scores].sort((a,b)=>a.score-b.score).slice(0,3);
 const pool=[]; low.forEach(x=>BANK[x.name].forEach(c=>pool.push([x.name,...c])));
 const used=new Set(),items=[];
 for(const x of pool){const media=x[1].split(' — ')[0];if(!used.has(media)){items.push(x);used.add(media)}if(items.length===3)break}
 for(const x of pool){if(items.length===3)break;if(!items.includes(x))items.push(x)}
 const card=box.closest('.card');
 if(card){const pill=card.querySelector('.pill'),h=card.querySelector('h2');if(pill)pill.textContent='Your next move';if(h)h.textContent='Try This Next 👀'}
 box.dataset.nextMove='1';
 box.innerHTML='<p class="sub">Built around the parts of your vibe with the most room to understand each other better: <strong>'+low.map(x=>x.name+' '+x.score+'%').join(' • ')+'</strong></p>'+
 items.map(x=>'<div class="starter"><strong>'+x[1]+'</strong><br>'+x[2]+'</div>').join('')+
 '<div class="tiny" style="margin-top:12px">These are conversation prompts, not compatibility prescriptions. Either person can skip one.</div>';
}
function resetEnhancement(){const b=document.getElementById('conversationStarters');if(b)b.dataset.nextMove='0'}
new MutationObserver(()=>{resetEnhancement();renderNextMove()}).observe(document.getElementById('results'),{attributes:true,attributeFilter:['class']});
new MutationObserver(renderNextMove).observe(document.getElementById('scoreGrid'),{childList:true,subtree:true});
window.VIBE_NEXT_MOVE_QA=function(kind){
 if(typeof qaScenario!=='function')return;
 qaScenario('aligned');
 const presets={
 communication:{Communication:34,'Emotional Connection':82,'Quality Time':79,Chemistry:76,'Relationship Expectations':74},
 emotional:{Communication:81,'Emotional Connection':31,'Quality Time':77,Chemistry:75,'Relationship Expectations':73},
 quality:{Communication:80,'Emotional Connection':78,'Quality Time':29,Chemistry:74,'Relationship Expectations':72},
 chemistry:{Communication:80,'Emotional Connection':77,'Quality Time':75,Chemistry:27,'Relationship Expectations':73},
 expectations:{Communication:80,'Emotional Connection':78,'Quality Time':76,Chemistry:74,'Relationship Expectations':25},
 mixed:{Communication:39,'Emotional Connection':43,'Quality Time':71,Chemistry:48,'Relationship Expectations':66}
 }[kind];
 [...document.querySelectorAll('#scoreGrid .score')].forEach(el=>{
   const name=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE)?.textContent?.trim()||'';
   if(!(name in presets))return;
   const strong=el.querySelector('strong'),bar=el.querySelector('.bar div');
   strong.textContent=presets[name]+'%';if(bar)bar.style.width=presets[name]+'%';
 });
 const box=document.getElementById('conversationStarters');if(box)delete box.dataset.nextMove;
 renderNextMove();
 const status=document.getElementById('qaStatus');if(status)status.textContent='NEXT MOVE QA: '+kind+'\nLowest-score targeting rendered from the visible category scores.\nQ27 privacy logic was not read or modified by this layer.';
};
function mountExtraQA(){
 if(typeof QA==='undefined'||!QA)return;
 const grid=document.querySelector('.qa-grid');if(!grid||grid.dataset.nextMoveQa)return;
 grid.dataset.nextMoveQa='1';
 const items=[['communication','Low Communication'],['emotional','Low Emotional'],['quality','Low Quality Time'],['chemistry','Low Chemistry'],['expectations','Low Expectations'],['mixed','Mixed Weak Spots']];
 items.forEach(([k,label])=>{const b=document.createElement('button');b.className='btn secondary';b.textContent=label;b.onclick=()=>window.VIBE_NEXT_MOVE_QA(k);grid.appendChild(b)});
}
setTimeout(mountExtraQA,0);renderNextMove();
})();