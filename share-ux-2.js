(()=>{'use strict';
document.head.insertAdjacentHTML('beforeend',`<style id="vibe-share2-css">
.vibe-share2{margin-top:14px;padding:16px;border-radius:20px;border:1px solid #604871;background:linear-gradient(135deg,rgba(166,108,255,.12),rgba(255,95,162,.07))}.vibe-share2-title{font-weight:950;font-size:1.05rem}.vibe-share2-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.vibe-share2-step{background:#120f17;border:1px solid #41364c;border-radius:15px;padding:12px}.vibe-share2-step b{display:block;margin-bottom:4px}.vibe-share2-step span{font-size:.78rem;color:#b9aec2;line-height:1.4}.vibe-share2-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.vibe-share2-actions .btn{width:100%}.vibe-share2-toast{font-size:.78rem;color:#d7c3e3;min-height:18px;margin-top:8px}.vibe-share2-badge{display:inline-flex;padding:6px 9px;border-radius:999px;background:#2c2037;border:1px solid #6b5080;font-size:.72rem;font-weight:900}
@media(max-width:560px){.vibe-share2-flow,.vibe-share2-actions{grid-template-columns:1fr}}</style>`);
const first=document.getElementById('firstDone');
async function copy(v,m){try{await navigator.clipboard.writeText(v);msg(m||'Copied ✨')}catch{msg('Press and hold the link to copy it.')}}function msg(t){const e=document.querySelector('.vibe-share2-toast');if(e)e.textContent=t}
async function share(url){const payload={title:'The Vibe Check 👀',text:'I finished my side of The Vibe Check 👀. Your turn — answer privately, then we reveal the vibe together.',url};if(navigator.share){try{await navigator.share(payload);msg('Invite sheet opened 👀')}catch(e){if(e.name!=='AbortError')copy(url,'Invite copied 👀')}}else copy(url,'Invite copied 👀')}
function enhance(){
 if(first.classList.contains('hidden')||document.querySelector('.vibe-share2'))return;
 const url=document.getElementById('inviteLink')?.textContent?.trim();if(!url)return;
 const card=document.getElementById('inviteLink')?.closest('.card');if(!card)return;
 const box=document.createElement('div');box.className='vibe-share2';box.innerHTML='<span class="vibe-share2-badge">Pass the vibe ✨</span><div class="vibe-share2-title" style="margin-top:8px">One link. Two private sides. One reveal.</div><div class="vibe-share2-flow"><div class="vibe-share2-step"><b>1. Send it</b><span>Your partner opens your private invitation.</span></div><div class="vibe-share2-step"><b>2. They answer</b><span>Your answers stay hidden while they take theirs.</span></div><div class="vibe-share2-step"><b>3. Reveal together</b><span>After they finish, the shared results open on their device.</span></div></div><div class="vibe-share2-actions"><button class="btn primary" data-vibeshare>Send the Invite 👀</button><button class="btn secondary" data-vibecopy>Copy Private Link</button></div><div class="vibe-share2-toast"></div>';
 const privacy=card.querySelector('.callout');card.insertBefore(box,privacy||card.lastChild);
 box.querySelector('[data-vibeshare]').onclick=()=>share(url);box.querySelector('[data-vibecopy]').onclick=()=>copy(url,'Private link copied ✨');
}
function inviteArrival(){
 if(document.querySelector('.vibe-arrival'))return;
 const p=document.getElementById('inviteFrom');if(!p||!p.textContent.trim()||document.getElementById('intro').classList.contains('hidden'))return;
 const card=p.closest('.hero')?.nextElementSibling;if(!card)return;const c=document.createElement('div');c.className='callout vibe-arrival';c.innerHTML='<strong>You were invited 👀</strong><p class="tiny">Your answers stay private until you finish. Nothing from the other person is shown while you take the test.</p>';card.insertBefore(c,card.firstChild);
}
new MutationObserver(()=>{enhance();inviteArrival()}).observe(document.body,{attributes:true,subtree:true,childList:true,attributeFilter:['class']});enhance();inviteArrival();
})();