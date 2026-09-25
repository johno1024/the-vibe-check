(()=>{'use strict';
document.head.insertAdjacentHTML('beforeend',`<style id="vibe-share2-css">
.vibe-share2{margin-top:14px;padding:16px;border-radius:20px;border:1px solid #604871;background:linear-gradient(135deg,rgba(166,108,255,.12),rgba(255,95,162,.07))}.vibe-share2-title{font-weight:950;font-size:1.05rem}.vibe-share2-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.vibe-share2-step{background:#120f17;border:1px solid #41364c;border-radius:15px;padding:12px}.vibe-share2-step b{display:block;margin-bottom:4px}.vibe-share2-step span{font-size:.78rem;color:#b9aec2;line-height:1.4}.vibe-share2-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.vibe-share2-actions .btn{width:100%}.vibe-share2-toast{font-size:.78rem;color:#d7c3e3;min-height:18px;margin-top:8px}.vibe-share2-badge{display:inline-flex;padding:6px 9px;border-radius:999px;background:#2c2037;border:1px solid #6b5080;font-size:.72rem;font-weight:900}.vibe-reveal-link{margin-top:12px;padding:13px;border-radius:15px;background:#0e0c12;border:1px dashed #7c5a92}.vibe-reveal-link .invite{margin-top:8px}.vibe-reveal-note{font-size:.78rem;color:#b9aec2;line-height:1.45;margin-top:7px}
@media(max-width:560px){.vibe-share2-flow,.vibe-share2-actions{grid-template-columns:1fr}}</style>`);
const first=document.getElementById('firstDone');
const encodeReveal=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decodeReveal=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return JSON.parse(decodeURIComponent(escape(atob(s))))};
function revealBase(){return location.href.split('?')[0].split('#')[0]}
function revealLink(invite){return revealBase()+'#vibe-reveal='+encodeReveal({v:1,invite})}
async function copy(v,m){try{await navigator.clipboard.writeText(v);msg(m||'Copied ✨')}catch{msg('Press and hold the link to copy it.')}}function msg(t){const e=document.querySelector('.vibe-share2-toast');if(e)e.textContent=t}
async function share(url){const payload={title:'The Vibe Check 👀',text:'I finished my side of The Vibe Check 👀. Your turn — answer privately, then we reveal the vibe together.',url};if(navigator.share){try{await navigator.share(payload);msg('Invite sheet opened 👀')}catch(e){if(e.name!=='AbortError')copy(url,'Invite copied 👀')}}else copy(url,'Invite copied 👀')}
function openPrivateReveal(){const m=location.hash.match(/^#vibe-reveal=(.+)$/);if(!m)return false;try{const data=decodeReveal(m[1]);if(!data?.invite)throw 0;location.replace(data.invite);return true}catch{history.replaceState(null,'',revealBase());return false}}
if(openPrivateReveal())return;
function enhance(){
 if(first.classList.contains('hidden')||document.querySelector('.vibe-share2'))return;
 const url=document.getElementById('inviteLink')?.textContent?.trim();if(!url)return;const reveal=revealLink(url);
 const card=document.getElementById('inviteLink')?.closest('.card');if(!card)return;
 const box=document.createElement('div');box.className='vibe-share2';box.innerHTML='<span class="vibe-share2-badge">Pass the vibe ✨</span><div class="vibe-share2-title" style="margin-top:8px">One invite. One private return link. One reveal.</div><div class="vibe-share2-flow"><div class="vibe-share2-step"><b>1. Send it</b><span>Your partner opens the invitation link.</span></div><div class="vibe-share2-step"><b>2. Keep your Reveal Link</b><span>Save it privately so you can return to this Vibe Check.</span></div><div class="vibe-share2-step"><b>3. Reveal together</b><span>Use your private link when you are ready to return to the shared flow.</span></div></div><div class="vibe-share2-actions"><button class="btn primary" data-vibeshare>Send the Invite 👀</button><button class="btn secondary" data-vibecopy>Copy Invite Link</button></div><div class="vibe-reveal-link"><b>Private Reveal Link 🔒</b><div class="invite" data-vibereveal>'+reveal+'</div><div class="vibe-reveal-note">Keep this one for yourself. Do not send it to your partner; it is your private shortcut back to this Vibe Check.</div><div class="vibe-share2-actions"><button class="btn secondary" data-viberevealcopy>Copy Reveal Link</button><button class="btn ghost" data-viberevealopen>Open Reveal Link</button></div></div><div class="vibe-share2-toast"></div>';
 const privacy=card.querySelector('.callout');card.insertBefore(box,privacy||card.lastChild);
 box.querySelector('[data-vibeshare]').onclick=()=>share(url);box.querySelector('[data-vibecopy]').onclick=()=>copy(url,'Invite link copied ✨');box.querySelector('[data-viberevealcopy]').onclick=()=>copy(reveal,'Private Reveal Link copied 🔒');box.querySelector('[data-viberevealopen]').onclick=()=>location.href=reveal;
 localStorage.setItem('vibe_private_reveal_link',reveal);
}
function inviteArrival(){
 if(document.querySelector('.vibe-arrival'))return;
 const p=document.getElementById('inviteFrom');if(!p||!p.textContent.trim()||document.getElementById('intro').classList.contains('hidden'))return;
 const card=p.closest('.hero')?.nextElementSibling;if(!card)return;const c=document.createElement('div');c.className='callout vibe-arrival';c.innerHTML='<strong>You were invited 👀</strong><p class="tiny">Your answers stay private until you finish. Nothing from the other person is shown while you take the test.</p>';card.insertBefore(c,card.firstChild);
}
new MutationObserver(()=>{enhance();inviteArrival()}).observe(document.body,{attributes:true,subtree:true,childList:true,attributeFilter:['class']});enhance();inviteArrival();
})();