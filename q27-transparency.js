(()=>{'use strict';
const Q27=['I’d rather keep things completely platonic.','I’d be curious. 👀','I’d want to explore it.','I’d admit I’m attracted to them too.','I’d probably say, “What took you so long?” 😂'];
function esc27(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
function revealQ27(){
  const card=document.querySelector('#revealBody')?.closest('.card');
  if(!card||!window.state?.partner||!window.state?.me)return;
  const a=state.partner.answers?.[26],b=state.me.answers?.[26];
  if(!Number.isInteger(a)||!Number.isInteger(b)||!Q27[a]||!Q27[b])return;
  const note=card.querySelector('.tiny');
  if(note)note.textContent='Q27 stays private while you take the test. After both people finish, both exact answers are revealed here for full transparency.';
  let box=document.getElementById('q27ExactReveal');
  if(!box){box=document.createElement('div');box.id='q27ExactReveal';box.style.marginTop='14px';card.appendChild(box)}
  box.innerHTML='<div style="margin-top:16px"><strong>Exactly how you both answered Q27</strong><div class="reveal-grid" style="margin-top:9px"><div class="answer"><strong>'+esc27(state.partner.nickname)+'</strong>'+esc27(Q27[a])+'</div><div class="answer"><strong>'+esc27(state.me.nickname)+'</strong>'+esc27(Q27[b])+'</div></div></div>';
}
const app=document.querySelector('.wrap');if(app)new MutationObserver(revealQ27).observe(app,{childList:true,subtree:true});
addEventListener('DOMContentLoaded',revealQ27);setTimeout(revealQ27,0);
})();
