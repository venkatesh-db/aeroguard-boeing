/* Shared engine for every product demo. Each product page defines window.P before loading this file. */
(function(){
const P=window.P;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const COMP={ui:['🖥️ UI','app screen','#5d6778'],api:['⚡ FastAPI','validates · routes','#0b2545'],rag:['📚 RAG','manuals · records','#0f8a7a'],agent:['🕸️ LangGraph','plans · decides','#d9480f'],mcp:['🔌 MCP','enterprise systems','#7a3fc4'],ops:['🔭 Ops','trace · audit · eval','#b7791f'],human:['👷 Human','approves · decides','#1a8a4a']};
const ORDER=['ui','api','agent','rag','mcp','human','ops'];
const LIST=window.PRODUCTS||[];

document.title=P.title;
document.body.innerHTML=`
<header style="background:${P.color}"><div><h1>${P.icon} ${esc(P.title)}</h1><p>${esc(P.tagline)}</p></div>
 <div class="navl"><a href="index.html">🏠 All products</a><a href="../3_aviation_industry_outcomes.html">⬅ Industry outcomes</a>${nav()}</div></header>
<main>
 <div class="story">
  <div class="sbox"><b>👤 Who</b><div class="v">${esc(P.persona)}</div></div>
  <div class="sbox"><b>😣 Problem today</b><div class="v">${esc(P.problem)}</div></div>
  <div class="sbox"><b>🎬 Scenario</b><div class="v">${esc(P.scenario)}</div></div>
  <div class="sbox"><b>🎯 Goal</b><div class="v">${esc(P.goal)}</div></div>
 </div>
 <div class="arch" id="arch">${ORDER.filter(k=>k!=='human').map(k=>`<div class="comp" id="c_${k}" style="background:${COMP[k][2]}">${COMP[k][0]}<small>${COMP[k][1]}</small></div>`).join('')}</div>
 <div class="grid">
  <div class="device"><div class="screen"><div class="abar"><span>${P.icon} ${esc(P.app)}</span><span>${esc(P.user)}</span></div><div class="feed" id="feed"><div class="bub sys">Press ▶ Run the product to start the scenario</div></div></div></div>
  <div>
   <div class="ctrl"><button class="btn go" id="run">▶ Run the product</button><button class="btn" id="stepB">⏭ Next step</button><button class="btn ghost" id="reset">↺ Reset</button><div class="prog"><i id="prog"></i></div><span id="pt" style="font-size:14px;color:var(--mut)"></span></div>
   <b>⚙️ End-to-end flow: what happens behind the screen</b>
   <div class="steps" id="steps" style="margin-top:6px"></div>
  </div>
 </div>
 <div class="results locked" id="results">
  <div class="rcard"><h3>📊 Before vs after (illustrative)</h3><div class="ba" style="font-weight:700;color:var(--mut)"><span>Measure</span><span style="text-align:center">Before</span><span style="text-align:center">After</span></div>${P.metrics.map(([m,b,a])=>`<div class="ba"><span>${esc(m)}</span><span class="b">${esc(b)}</span><span class="a">${esc(a)}</span></div>`).join('')}</div>
  <div class="rcard"><h3>👷 Where the human stays in control</h3>${P.human.map(h=>`<div class="li">✋ ${esc(h)}</div>`).join('')}</div>
  <div class="rcard"><h3>🛡️ Guardrails built in</h3>${P.guards.map(h=>`<div class="li">🛡️ ${esc(h)}</div>`).join('')}</div>
 </div>
 <div class="disc">Illustrative teaching demo: data, names, numbers and system outputs are made up to show the flow. Not a real product or company system. Built on the course architecture (FastAPI + UI + RAG + LangGraph + MCP). Advisory only: airworthiness, release and safety decisions rest with authorised personnel under approved procedures.</div>
</main>`;
function nav(){const i=LIST.findIndex(x=>x[0]===P.id);if(i<0)return '';const p=LIST[(i-1+LIST.length)%LIST.length],n=LIST[(i+1)%LIST.length];return `<a href="${p[0]}.html">◀ ${esc(p[1])}</a><a href="${n[0]}.html">${esc(n[1])} ▶</a>`}

$('steps').innerHTML=P.steps.map((s,i)=>`<div class="step" id="s${i}"><div class="n">${i+1}</div><div><h4>${esc(s.title)} ${(s.comp||[]).map(c=>`<span class="ctag" style="background:${COMP[c][2]}">${COMP[c][0]}</span>`).join('')}</h4><p>${esc(s.what)}</p>${s.data?`<div class="data">${esc(s.data)}</div>`:''}</div></div>`).join('');

let k=0,busy=false,auto=false;
function feed(html){$('feed').insertAdjacentHTML('beforeend',html);$('feed').scrollTop=1e6}
function lightComps(cs){ORDER.forEach(c=>{const e=$('c_'+c);if(!e)return;if((cs||[]).includes(c)){e.classList.add('on','used')}else e.classList.remove('on')})}
function screen(s){const v=s.screen;if(!v)return;
 if(v.user)feed(`<div class="bub u">${esc(v.user)}</div>`);
 if(v.sys)feed(`<div class="bub sys">${esc(v.sys)}</div>`);
 if(v.bot)feed(`<div class="bub a">${esc(v.bot)}</div>`);
 if(v.card){const c=v.card;feed(`<div class="art" style="border-color:${c.color||'#1a8a4a'}"><h4><span>${esc(c.title)}</span>${c.badge?`<span class="pill" style="background:${c.badgeColor||'#1a8a4a'}">${esc(c.badge)}</span>`:''}</h4><table>${c.rows.map(([a,b])=>`<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</table>${c.note?`<div style="font-size:12px;color:var(--mut);margin-top:6px">${esc(c.note)}</div>`:''}</div>`)}}
async function approval(s){return new Promise(res=>{feed(`<div class="appr" id="ap${k}">✋ <b>${esc(s.approve.ask)}</b><br><span style="font-size:13px;color:var(--mut)">${esc(s.approve.who)}</span><br><button class="btn go" id="ya${k}" style="margin-top:6px">✅ ${esc(s.approve.yes||'Approve')}</button> <button class="btn red" id="na${k}">❌ ${esc(s.approve.no||'Reject')}</button></div>`);
 $('ya'+k).onclick=()=>{$('ap'+k).innerHTML='✅ Approved by '+esc(s.approve.who.split(':')[0]);res(true)};$('na'+k).onclick=()=>{$('ap'+k).innerHTML='❌ Rejected: the flow stops safely and nothing is changed in any system.';res(false)}})}
async function next(){if(busy||k>=P.steps.length)return false;busy=true;const s=P.steps[k];
 if(k>0){$('s'+(k-1)).classList.remove('on');$('s'+(k-1)).classList.add('done')}
 const el=$('s'+k);el.classList.add('on');el.scrollIntoView({block:'nearest',behavior:'smooth'});lightComps(s.comp);
 $('prog').style.width=((k+1)/P.steps.length*100)+'%';$('pt').textContent=`Step ${k+1} / ${P.steps.length}`;
 await sleep(250);screen(s);
 if(s.approve){const ok=await approval(s);if(!ok){busy=false;auto=false;k=P.steps.length;$('run').disabled=true;$('stepB').disabled=true;return false}}
 k++;busy=false;
 if(k>=P.steps.length){el.classList.remove('on');el.classList.add('done');lightComps([]);ORDER.forEach(c=>{const e=$('c_'+c);if(e)e.classList.add('used')});$('results').classList.remove('locked');feed(`<div class="bub sys">🏁 Scenario complete</div>`);$('run').disabled=true;$('stepB').disabled=true}
 return true}
$('stepB').onclick=()=>{if(!k)$('feed').innerHTML='';next()};
$('run').onclick=async()=>{if(!k)$('feed').innerHTML='';auto=true;$('run').disabled=true;while(auto&&k<P.steps.length){const ok=await next();if(!ok)break;await sleep(P.steps[k-1]&&P.steps[k-1].approve?400:1500)}};
$('reset').onclick=()=>location.reload();
document.addEventListener('click',e=>{const st=e.target.closest('.step.done');if(st)st.classList.toggle('show')});
})();
