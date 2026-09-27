(()=>{'use strict';
const BANK={
'Communication':[
['💬 TEXT — SAY IT CLEARER','Pick one answer where your styles differed. Each person explains what they actually need in that situation in one sentence.'],
['🎙️ VOICE — HEAR ME OUT','Send a short voice note answering: “What helps you feel understood when something matters?” Then compare.'],
['📝 TEXT — READ ME RIGHT','Each finish: “One thing people sometimes misunderstand about me is…” Reveal both answers before responding.']],
'Emotional Connection':[
['💭 REVEAL — LITTLE THING, BIG DEAL','Each name one small thing the other person could do that would make you feel more emotionally connected.'],
['🎙️ VOICE — FEELING SEEN','Finish this in a voice note: “I feel closest to someone when they…” Then trade answers.'],
['📸 PHOTO — THIS FEELS LIKE ME','Send a photo from your camera roll that represents a moment when you felt genuinely happy, comfortable, or understood. Explain after both photos are sent.']],
'Quality Time':[
['📅 PICK ONE — YOUR KIND OF TIME','Each choose one: planned date, spontaneous adventure, stay-in night, errands together, or long conversation. Find the overlap and make it your next hangout.'],
['📸 PHOTO — SAVE THIS SPOT','Send a photo of somewhere you would genuinely enjoy spending uninterrupted time together. No explanation until they react.'],
['⏱️ PLAN — 60 MINUTES, NO AUTOPILOT','Design a one-hour hangout together with one rule: no scrolling unless the phone is part of what you planned.']],
'Chemistry':[
['😏 TEXT — WHAT I NOTICE','Tell each other one non-explicit thing that creates chemistry for you: eye contact, humor, confidence, closeness, teasing, conversation, or something else.'],
['🎵 MUSIC — VIBE IN A SONG','Send one song that captures the energy between you right now. Explain the choice only after both songs are sent.'],
['👀 REVEAL — THE LITTLE TELL','Each name one subtle thing someone does when they have your full attention. Keep it playful and pressure-free.']],
'Relationship Expectations':[
['👀 REAL TALK — DEFINE THE VIBE','Each finish: “If this connection became closer, I would want…” Compare answers without trying to persuade each other.'],
['🧭 CHECK-IN — MORE / SAME / LESS','Separately choose whether you want more closeness, roughly the same vibe, or more space. Reveal together, then talk about what that means.'],
['📝 TEXT — NON-NEGOTIABLE / NICE-TO-HAVE','Each share one thing you need for a connection to feel healthy and one thing that is simply a bonus.']]
};
const Q27_MISSIONS={
 platonic:[['🤝 VIBE — KEEP IT COMFORTABLE','Pick something you both genuinely enjoy doing together and plan it with zero pressure to make the connection anything other than what you both want.'],['💬 CHECK-IN — GOOD AS WE ARE','Each share one thing you value about the connection exactly as it is.']],
 curious:[['👀 REVEAL — WHAT MADE YOU CURIOUS','Each name one quality, moment, or interaction that made you curious about the possibility of something more.'],['🎙️ VOICE — IF WE EXPLORED IT','Each finish: “If we ever explored this vibe, I’d want it to feel…” Keep it light and compare.']],
 open:[['✨ PLAN — TEST THE VIBE','Plan one intentional hangout that feels a little more date-like than usual, then check in afterward about how it actually felt.'],['💬 TEXT — WHAT I’D WANT MORE OF','Each name one thing you would want more of if the connection moved beyond friendship.']],
 strong:[['🔥 CHEMISTRY — MAKE IT INTENTIONAL','Choose one mutually comfortable way to lean into the chemistry—flirty texts, a date, deeper conversation, or more intentional time together—then agree on it together.'],['👀 REVEAL — THE GREEN LIGHT','Each share what the other person does that makes the romantic interest feel mutual.']]
};
function readScores(){return [...document.querySelectorAll('#scoreGrid .score')].map(el=>{const strong=el.querySelector('strong');const name=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE)?.textContent?.trim()||'';return{name,score:parseInt(strong?.textContent)||0}}).filter(x=>BANK[x.name]);}
function q27Context(){if(typeof state==='undefined'||!state.partner||!state.me)return null;const a=state.partner.answers?.[26],b=state.me.answers?.[26];if(a===undefined||b===undefined)return null;if(a===0||b===0)return{kind:'platonic',label:'Q27 boundary'};const low=Math.min(a,b);if(low>=3)return{kind:'strong',label:'Q27 mutual romantic openness'};if(low>=2)return{kind:'open',label:'Q27 openness to exploring'};return{kind:'curious',label:'Q27 mutual curiosity'};}
function renderNextMove(){
 const box=document.getElementById('conversationStarters'),results=document.getElementById('results');if(!box||!results||results.classList.contains('hidden'))return;
 const scores=readScores();if(scores.length<3)return;
 const low=[...scores].sort((a,b)=>a.score-b.score).slice(0,3),pool=[];low.forEach(x=>BANK[x.name].forEach(c=>pool.push([x.name,...c])));
 const q27=q27Context();if(q27)Q27_MISSIONS[q27.kind].forEach(c=>pool.unshift([q27.label,...c]));
 const used=new Set(),items=[];for(const x of pool){const media=x[1].split(' — ')[0];if(!used.has(media)){items.push(x);used.add(media)}if(items.length===3)break}for(const x of pool){if(items.length===3)break;if(!items.includes(x))items.push(x)}
 const card=box.closest('.card');if(card){const pill=card.querySelector('.pill'),h=card.querySelector('h2');if(pill)pill.textContent='Matchmaker moves';if(h)h.textContent='Your Vibe Missions 👀'}
 const basis=low.map(x=>x.name+' '+x.score+'%').join(' • ')+(q27?' • '+q27.label:'');
 box.dataset.nextMove='1';box.innerHTML='<p class="sub">Three personalized moves built from your compatibility categories'+(q27?' and what you both said on Q27':'')+': <strong>'+basis+'</strong></p>'+items.map((x,i)=>'<div class="starter"><div class="tiny">MISSION '+(i+1)+' • '+x[0]+'</div><strong>'+x[1]+'</strong><br>'+x[2]+'</div>').join('')+'<div class="tiny" style="margin-top:12px">Do them in any order. Either person can pass on any mission—no explanation required.</div>';
}
function resetEnhancement(){const b=document.getElementById('conversationStarters');if(b)b.dataset.nextMove='0'}
function q27Label(v){const q=typeof QUESTIONS!=='undefined'?QUESTIONS[26]:null;return q&&q.opts&&q.opts[v]!==undefined?q.opts[v]:String(v??'');}
function renderQ27Reveal(){
 const results=document.getElementById('results');if(!results||results.classList.contains('hidden')||typeof state==='undefined'||!state.partner||!state.me)return;
 const card=document.getElementById('revealBody')?.closest('.card'),body=document.getElementById('revealBody'),title=document.getElementById('revealTitle');if(!card||!body||!title)return;
 const pill=card.querySelector('.pill'),note=card.querySelector('.tiny');if(pill)pill.textContent='Q27 reveal';if(note)note.textContent='You both finished. Now the answers are on the table.';
 const A=state.partner,B=state.me,qa=A.answers?.[26],qb=B.answers?.[26];if(qa===undefined||qb===undefined)return;
 const a=q27Label(qa),b=q27Label(qb);let interpretation='';
 if(qa===0||qb===0)interpretation='At least one answer sets a clear platonic boundary. Treat that answer as the boundary, not an invitation to negotiate it.';
 else{const l=Math.min(qa,qb);if(l>=3)interpretation='Both answers show clear romantic openness.';else if(l>=2)interpretation='Both answers show openness to exploring something beyond friendship.';else interpretation='Neither answer shut the door; both responses leave room for curiosity.'}
 title.textContent='What You Both Actually Said 👀';body.className='callout';body.innerHTML='<div class="reveal-grid"><div class="answer"><strong>'+esc(A.nickname)+'</strong>'+esc(a)+'</div><div class="answer"><strong>'+esc(B.nickname)+'</strong>'+esc(b)+'</div></div><div class="tiny" style="margin-top:12px">'+esc(interpretation)+'</div>';
}
new MutationObserver(()=>{resetEnhancement();renderNextMove();renderQ27Reveal()}).observe(document.getElementById('results'),{attributes:true,attributeFilter:['class']});new MutationObserver(()=>{renderNextMove();renderQ27Reveal()}).observe(document.getElementById('scoreGrid'),{childList:true,subtree:true});
window.VIBE_NEXT_MOVE_QA=function(kind){if(typeof qaScenario!=='function')return;qaScenario('aligned');const presets={communication:{Communication:34,'Emotional Connection':82,'Quality Time':79,Chemistry:76,'Relationship Expectations':74},emotional:{Communication:81,'Emotional Connection':31,'Quality Time':77,Chemistry:75,'Relationship Expectations':73},quality:{Communication:80,'Emotional Connection':78,'Quality Time':29,Chemistry:74,'Relationship Expectations':72},chemistry:{Communication:80,'Emotional Connection':77,'Quality Time':75,Chemistry:27,'Relationship Expectations':73},expectations:{Communication:80,'Emotional Connection':78,'Quality Time':76,Chemistry:74,'Relationship Expectations':25},mixed:{Communication:39,'Emotional Connection':43,'Quality Time':71,Chemistry:48,'Relationship Expectations':66}}[kind];[...document.querySelectorAll('#scoreGrid .score')].forEach(el=>{const name=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE)?.textContent?.trim()||'';if(!(name in presets))return;const strong=el.querySelector('strong'),bar=el.querySelector('.bar div');strong.textContent=presets[name]+'%';if(bar)bar.style.width=presets[name]+'%'});const box=document.getElementById('conversationStarters');if(box)delete box.dataset.nextMove;renderNextMove();renderQ27Reveal();const status=document.getElementById('qaStatus');if(status)status.textContent='MATCHMAKER MOVES QA: '+kind+'\nLowest-score targeting plus Q27 context enabled.\nQ27 influences mission selection but remains excluded from compatibility scoring.'};
function mountExtraQA(){if(typeof QA==='undefined'||!QA)return;const grid=document.querySelector('.qa-grid');if(!grid||grid.dataset.nextMoveQa)return;grid.dataset.nextMoveQa='1';[['communication','Low Communication'],['emotional','Low Emotional'],['quality','Low Quality Time'],['chemistry','Low Chemistry'],['expectations','Low Expectations'],['mixed','Mixed Weak Spots']].forEach(([k,label])=>{const b=document.createElement('button');b.className='btn secondary';b.textContent=label;b.onclick=()=>window.VIBE_NEXT_MOVE_QA(k);grid.appendChild(b)})}
setTimeout(()=>{mountExtraQA();renderNextMove();renderQ27Reveal()},0);
})();