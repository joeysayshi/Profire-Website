(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------------- data ---------------- */
const MEASURES=["Access panels, doors and hoppers to fire-resisting shafts","Automatic fail-safe devices","Automatic fire detection and alarm systems (level 1)","Automatic fire detection and alarm systems (level 2)","Automatic fire suppression systems (level 1)","Automatic fire suppression systems (level 2)","Division 7 miscellaneous fire safety offences","Emergency lifts","Emergency lighting","Emergency planning","Emergency warning and intercommunication systems","Exit signs","Fire control centres and rooms","Fire dampers","Fire doors","Fire hose reel systems","Fire hydrant systems (level 1)","Fire hydrant systems (level 2)","Fire seals protecting openings in fire-resisting components","Fire shutters","Fire windows","Lightweight construction","Perimeter vehicle access for emergency vehicles","Mechanical air handling systems (e.g. pressurisation systems)","Portable fire extinguishers","Safety curtains in proscenium openings","Smoke alarms and heat alarms","Smoke and heat vents","Smoke dampers","Smoke detectors and heat detectors","Smoke doors","Solid core doors","Standby power systems","Wall-wetting sprinkler and drencher systems","Warning and operational signs"];
const SVCS=["Fire Panel","Automatic Fire Detection Systems","Fire Suppression System","Mechanical Air Handling Systems","Smoke Detectors","Fire Dampers","Fire Extinguishers","Fire Doors","Exit Lighting & Signage","Emergency Lighting","Fire Hose Reels","Fire Hydrant System","Building Occupant Warning System","Sprinkler Systems","Fire Blanket","Passive Fire","Smoke Detectors & Dampers","Hydrant & Sprinkler Flow Test","Block Plans","Diesel Hydrant Pump Test"];
const CLIENTS=["CNG Property Group","Whelan Property Group","Titles Strata","Strata Real Estate Services","Sydney Strata Specialists","Strata Sense","Strata Republic","StrataLife","Stratachoice","Robinson Strata Management","Real Property Services","RPM Property Group","PICA Property & Financial Services","Ramsay Health Care","Netstrata","Pacific Building Management Group","Jamesons","Kooper & Levi Strata Management","Group Homes Australia","Integrity Strata","Gordon Robinson Real Estate","Bright & Duggan","BCS Body Corporate Services","Fresh Strata","BME Group"];
const ALARMS=[["240v hard-wired photoelectric smoke alarms","with 9v back-up batteries","hard"],["240v hard-wired photoelectric smoke alarms","with 10-year lithium back-up batteries","hard"],["10-year lithium operated photoelectric smoke alarms","Battery operated","lith"],["9v battery operated photoelectric smoke alarms","Battery operated","nine"],["Wireless interconnecting photoelectric smoke alarms","Wirelessly interlinked","wifi"],["240v hard-wired heat alarms","Heat detection","heat"]];
const ISSUES=["Beeping alarms can need a new back-up battery or a replacement alarm. Call and our after-hours technician can attend.","A chirping fire panel needs a technician's eyes. Call any time to be put through to the technician on call.","A fire door that won't close properly can't do its job. We can urgently attend and fix it.","A leaking hydrant system needs urgent attention. Call us 24/7 to organise a technician."];
const PICKS=["AFSS Certification","Routine Inspections","Repairs & Preventative","Smoke Alarm Testing","After Hours","Something else"];

/* ---------------- sound (Web Audio, generated) ---------------- */
const Snd={on:store.get('pf-snd')==='1',ctx:null,
  ac(){if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;this.ctx=new C()}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx},
  blip(f=880,d=.06,v=.05,type='sine'){if(!this.on)return;const c=this.ac();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,c.currentTime);o.frequency.exponentialRampToValueAtTime(f*.6,c.currentTime+d);g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02)},
  tick(){this.blip(2400+Math.random()*600,.018,.018,'square')},
  whoosh(){if(!this.on)return;const c=this.ac();if(!c)return;const n=c.sampleRate*.7,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/n);const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(300,c.currentTime);f.frequency.exponentialRampToValueAtTime(2600,c.currentTime+.6);const g=c.createGain();g.gain.value=.12;s.connect(f).connect(g).connect(c.destination);s.start()},
  chime(){if(!this.on)return;[880,1320].forEach((f,i)=>setTimeout(()=>this.blip(f,.35,.05),i*110))}
};
const sndBtn=$('#sndBtn');
function paintSnd(){sndBtn.setAttribute('aria-pressed',Snd.on);$('.sw-on',sndBtn).style.display=Snd.on?'':'none';$('.sw-off',sndBtn).style.display=Snd.on?'none':'';sndBtn.title=Snd.on?'Sound on':'Sound off'}
sndBtn.addEventListener('click',()=>{Snd.on=!Snd.on;store.set('pf-snd',Snd.on?'1':'0');paintSnd();Snd.chime()});
paintSnd();
document.addEventListener('click',e=>{if(e.target.closest('a,button'))Snd.blip(1100,.05,.035)},true);

/* ---------------- theme ---------------- */
const thmBtn=$('#thmBtn');const modes=['auto','light','dark'];
function applyTheme(m){if(m==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',m);thmBtn.title='Theme: '+m;thmBtn.setAttribute('aria-label','Theme: '+m)}
let theme=store.get('pf-theme')||'auto';applyTheme(theme);
thmBtn.addEventListener('click',()=>{theme=modes[(modes.indexOf(theme)+1)%3];store.set('pf-theme',theme);applyTheme(theme)});

/* ---------------- ticker ---------------- */
const tk=$('#tickerT');const tkItems=['24/7 Fire Maintenance Service','Call 02 9948 4494','AFSS Certification across NSW','Accredited Fire Safety Practitioners','All repairs under one roof'];
tk.innerHTML=[...tkItems,...tkItems,...tkItems,...tkItems].map(t=>`<span>${t}</span>`).join('');

/* ---------------- split-flap ---------------- */
const CH=' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·-:+';
function flapTo(el,text,{delay=0,steps=10}={}){
  text=String(text).toUpperCase();
  let cells=$$('.c',el);
  if(cells.length!==text.length){el.innerHTML=[...text].map(()=>'<span class="c"> </span>').join('');cells=$$('.c',el)}
  el.setAttribute('aria-label',text);
  cells.forEach((c,i)=>{
    const target=text[i];c.classList.toggle('sp',target===' ');
    if(RM){c.textContent=target;return}
    let n=steps+i*2,k=0;
    clearInterval(c._t);
    setTimeout(()=>{c._t=setInterval(()=>{
      if(k++>=n){clearInterval(c._t);c.textContent=target;c.classList.remove('f');return}
      c.textContent=CH[Math.floor(Math.random()*CH.length)];c.classList.remove('f');void c.offsetWidth;c.classList.add('f');
      if(i%3===0&&Math.random()<.5)Snd.tick();
    },45)},delay);
  });
}

/* ---------------- loader (first visit only, real progress) ---------------- */
const SS={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}},del(k){try{sessionStorage.removeItem(k)}catch(e){}}};
const curtain=$('#curtain'),PAGE=document.body.dataset.page||'';
async function boot(){
  initPage(document,PAGE);
  const ld=$('#loader');
  if(ld&&!document.documentElement.classList.contains('pf-seen')){
    const ims=$$('main img,header img').filter(i=>i.loading!=='lazy');
    const total=ims.length+1;let done=0;
    const msgs=['Charging extinguishers','Testing exit lights','Checking fire doors','Pressurising hydrants','Calibrating smoke alarms','Certifying measures'];
    const fill=$('#ldfill'),flame=$('#ldflame'),pct=$('#ldpct'),bar=$('#ldbar'),msg=$('#ldmsg');
    const paint=()=>{const p=done/total;fill.setAttribute('y',146-106*p);flame.setAttribute('opacity',.25+.75*p);pct.textContent=Math.round(p*100)+'%';bar.style.width=p*100+'%';msg.textContent=msgs[Math.min(msgs.length-1,Math.floor(p*msgs.length))]};
    const t0=performance.now();
    const jobs=ims.map(im=>new Promise(res=>{const d=()=>{done++;paint();res()};if(im.complete)d();else{im.addEventListener('load',d,{once:true});im.addEventListener('error',d,{once:true})}}));
    jobs.push((document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{done++;paint()}));
    await Promise.race([Promise.all(jobs),sleep(4000)]);
    done=total;paint();
    await sleep(Math.max(0,(RM?0:700)-(performance.now()-t0))+200);
    ld.classList.add('done');Snd.chime();setTimeout(()=>ld.remove(),1100);
    SS.set('pf-seen','1');
  }else if(ld)ld.remove();
  document.body.classList.remove('locked');
  enter();
}
function enter(){
  const pg=$('main .page');
  if(document.documentElement.classList.contains('pf-trans')){
    SS.del('pf-trans');
    requestAnimationFrame(()=>{curtain.className='leave';document.documentElement.classList.remove('pf-trans');setTimeout(()=>curtain.className='',760)});
    setTimeout(()=>{pg.classList.add('entered');pg.classList.remove('enter')},250);
  }else requestAnimationFrame(()=>requestAnimationFrame(()=>{pg.classList.add('entered');pg.classList.remove('enter')}));
}

/* ---------------- page transitions between real pages (Barba-style leave → load → enter) ---------------- */
const LABELS={"/": "Home", "/about/": "About", "/team/": "The team", "/certifications/": "Certifications", "/services/": "Services", "/afss-inspections/": "AFSS inspections", "/routine-fire-inspections/": "Routine inspections", "/fire-equipment-repairs/": "Repairs", "/smoke-alarm-testing/": "Smoke alarms", "/after-hours-fire-service/": "24/7 after hours", "/contact/": "Get in touch", "/blog/": "Blog"};
const norm=u=>{const x=new URL(u,location.href);let p=x.pathname.replace(/index\.html$/,'');if(!p.endsWith('/'))p+='/';return p};
let leaving=false;
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
  const h=a.getAttribute('href');if(!h.startsWith('/'))return;
  const url=new URL(h,location.href);if(url.origin!==location.origin)return;
  const sv=a.closest('[data-svc]');if(sv)SS.set('pf-svc',sv.dataset.svc);
  if(a.dataset.msg)SS.set('pf-msg','I\'d like to enquire about: '+a.dataset.msg+'.');
  if(norm(url.href)===norm(location.href)&&!url.hash){e.preventDefault();closeMenu();scrollTo({top:0,behavior:RM?'auto':'smooth'});return}
  if(RM||leaving)return;
  e.preventDefault();leaving=true;closeMenu();
  $('#cttxt').textContent=LABELS[norm(url.href)]||'Profire';
  Snd.whoosh();curtain.className='cover';SS.set('pf-trans',$('#cttxt').textContent);
  setTimeout(()=>{location.href=url.href},700);
});
addEventListener('pageshow',e=>{if(e.persisted){leaving=false;curtain.className='';document.documentElement.classList.remove('pf-trans')}});
/* prefetch on hover so the next page is ready when the curtain lifts */
const pf=new Set();document.addEventListener('pointerover',e=>{const a=e.target.closest&&e.target.closest('a[href^="/"]');if(!a)return;const u=norm(new URL(a.getAttribute('href'),location.href).href);if(pf.has(u))return;pf.add(u);const l=document.createElement('link');l.rel='prefetch';l.href=u;document.head.appendChild(l)});

/* ---------------- page init ---------------- */
let parallax=[],stories=[],cleanups=[];
function initPage(p,r){p=p===document?$('main'):p;
  $$('[data-clients]',p).forEach(t=>{const[a,b]=t.dataset.clients.split('-').map(Number);let h='';for(let i=a;i<=b;i++)h+=`<div class="cl"><img loading="lazy" width="210" height="90" src="/img/cl${i}.webp" alt="${CLIENTS[i-1]}"></div>`;t.innerHTML=h+h.replace(/alt="[^"]*"/g,'alt="" aria-hidden="true"')});
  $$('.split',p).forEach(splitWords);
  parallax=$$('[data-speed]',p);stories=$$('[data-story]',p);
  observe(p);
  $$('[data-flap]',p).forEach((el,i)=>{el.innerHTML='';flapTo(el,el.dataset.flap.replace(/./g,' '),{steps:0});const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){flapTo(el,el.dataset.flap,{delay:300});io.disconnect()}});io.observe(el);cleanups.push(()=>io.disconnect())});
  $$('[data-embers]',p).forEach(embers);
  $$('[data-proc]',p).forEach(proc);
  $$('[data-calc]',p).forEach(calc);
  $$('[data-faq]',p).forEach(faq);
  $$('[data-drag]',p).forEach(drag);
  if(r==='certifications')certs(p);
  if(r==='services')flips(p);
  if(r==='smoke')alarms(p);
  if(r==='after-hours')issues(p);
  if(r==='contact')contact(p);
  if(FINE){$$('.mag',p).forEach(mag);$$('.tilt',p).forEach(tilt)}
  onScroll();
}

function splitWords(el){
  let i=0;
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const parts=c.textContent.split(/(\s+)/);const f=document.createDocumentFragment();
      parts.forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return}
        const o=document.createElement('span');o.className='sw';const s=document.createElement('span');s.textContent=w;s.style.transitionDelay=(i++*.045)+'s';o.appendChild(s);f.appendChild(o)});
      c.replaceWith(f)}
    else if(c.nodeType===1)walk(c)})};
  walk(el);el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
}

function observe(p){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');io.unobserve(t);
    $$('[data-count]',t).forEach(countUp);if(t.matches('[data-count]'))countUp(t)}),{rootMargin:'0px 0px -12% 0px',threshold:.01});
  $$('.rv,.split,.clip,.cy,.story .it',p).forEach((el,i)=>{if(el.classList.contains('rv')&&!el.style.transitionDelay){const sib=[...el.parentElement.children].filter(x=>x.classList.contains('rv'));const k=sib.indexOf(el);if(k>0)el.style.transitionDelay=Math.min(k,6)*.07+'s'}io.observe(el)});
  cleanups.push(()=>io.disconnect());
}
function countUp(el){const n=+el.dataset.count;if(RM){el.textContent=n;return}const t0=performance.now(),d=1600;const f=t=>{const k=Math.min(1,(t-t0)/d);el.textContent=Math.round(n*(1-Math.pow(1-k,4)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}

/* embers: particle field with mouse parallax */
function embers(sec){
  const cv=$('canvas.embers',sec);if(!cv||RM)return;const g=cv.getContext('2d');let W,H,dpr=Math.min(2,devicePixelRatio||1),raf,vis=true,mx=0,my=0,tx=0,ty=0;
  const size=()=>{W=sec.offsetWidth;H=sec.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0)};size();
  const N=Math.round(Math.min(110,W/12));
  const mk=(init)=>({x:Math.random()*W,y:init?Math.random()*H:H+10,z:.3+Math.random()*1.2,r:.6+Math.random()*2.2,vy:.25+Math.random()*.9,ph:Math.random()*6.28,life:0,hue:Math.random()<.6?322:Math.random()<.5?18:0});
  const ps=Array.from({length:N},()=>mk(true));
  const mm=e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5};
  addEventListener('pointermove',mm);addEventListener('resize',size);
  const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting});io.observe(sec);
  const loop=t=>{raf=requestAnimationFrame(loop);if(!vis)return;tx+=(mx-tx)*.05;ty+=(my-ty)*.05;g.clearRect(0,0,W,H);g.globalCompositeOperation='lighter';
    for(const p of ps){p.y-=p.vy*p.z;p.x+=Math.sin(t/900+p.ph)*.35*p.z;p.life+=.004;
      if(p.y<-20){Object.assign(p,mk(false))}
      const fade=Math.min(1,p.y/H*1.4)*(.55+.45*Math.sin(t/180+p.ph));
      const x=p.x+tx*60*p.z,y=p.y+ty*40*p.z,rad=p.r*p.z*3;
      const col=p.hue===0?'255,240,248':p.hue===18?'255,140,60':'253,32,187';
      const gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,`rgba(${col},${.9*fade})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.beginPath();g.arc(x,y,rad,0,6.283);g.fill()}
  };raf=requestAnimationFrame(loop);
  cleanups.push(()=>{cancelAnimationFrame(raf);removeEventListener('pointermove',mm);removeEventListener('resize',size);io.disconnect()});
}

/* sticky process stage */
function proc(el){
  const steps=$$('.step',el),imgs=$$('.proc-stage img',el),bars=$$('.proc-bar i',el),num=$('.proc-num',el);let cur=0;
  const set=i=>{if(i===cur)return;cur=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));imgs.forEach((m,k)=>m.classList.toggle('on',k===i));bars.forEach((b,k)=>b.classList.toggle('on',k<=i));
    if(RM)num.textContent='0'+(i+1);else flapNum(num,'0'+(i+1));Snd.blip(660+i*110,.08,.04)};
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)set(steps.indexOf(e.target))}),{rootMargin:'-45% 0px -45% 0px'});
  steps.forEach(s=>io.observe(s));cleanups.push(()=>io.disconnect());
}
function flapNum(el,t){let k=0;clearInterval(el._t);el._t=setInterval(()=>{el.textContent=k++<6?String(Math.floor(Math.random()*90)+10):t;if(k>6)clearInterval(el._t)},40)}

/* AFSS 90-day calculator */
function calc(el){
  const inp=$('#calcD',el),due=$('[data-flap-id="due"]',el),left=$('[data-flap-id="left"]',el),st=$('#calcS',el);
  const M=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const today=new Date();today.setHours(0,0,0,0);inp.value=iso(today);
  let dueD=null;
  const upd=()=>{if(!inp.value)return;const[y,m,d]=inp.value.split('-').map(Number);const a=new Date(y,m-1,d);dueD=new Date(a);dueD.setDate(dueD.getDate()+90);
    const days=Math.round((dueD-today)/864e5);
    flapTo(due,String(dueD.getDate()).padStart(2,'0')+' '+M[dueD.getMonth()]+' '+dueD.getFullYear());
    flapTo(left,days<0?'OVERDUE':String(days).padStart(3,' ')+' DAYS');
    st.className='calc-status'+(days<0?' bad':days<=30?' warn':'');
    $('span',st).textContent=days<0?`Overdue by ${-days} day${days===-1?'':'s'}: Council can issue weekly fines`:days===0?'Due today':days<=30?'Due soon. Allow time for any repairs':'On track. Plenty of time to resolve defects';
  };
  inp.addEventListener('change',upd);inp.addEventListener('input',upd);
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){upd();io.disconnect()}});io.observe(el);cleanups.push(()=>io.disconnect());
  $('#calcIcs',el).addEventListener('click',()=>{if(!dueD)upd();const f=d=>d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');const n=new Date(dueD);n.setDate(n.getDate()+1);
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Profire//AFSS reminder//EN','BEGIN:VEVENT','UID:afss-'+f(dueD)+'@profireaustralia.com.au','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z','DTSTART;VALUE=DATE:'+f(dueD),'DTEND;VALUE=DATE:'+f(n),'SUMMARY:AFSS due to Council','DESCRIPTION:Annual Fire Safety Statement due (90 days from date of assessment). Profire 02 9948 4494','BEGIN:VALARM','TRIGGER:-P14D','ACTION:DISPLAY','DESCRIPTION:AFSS due to Council in 14 days','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='afss-due-'+f(dueD)+'.ics';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)});
}

function faq(el){$$('.qa',el).forEach(q=>{const b=$('button',q);b.addEventListener('click',()=>{const o=!q.classList.contains('open');$$('.qa.open',el).forEach(x=>{x.classList.remove('open');$('button',x).setAttribute('aria-expanded','false')});q.classList.toggle('open',o);b.setAttribute('aria-expanded',o)})})}

function drag(el){let down=false,sx=0,sl=0,v=0,lx=0,raf;
  const md=e=>{if(e.pointerType!=='mouse')return;down=true;el.classList.add('down');sx=e.clientX;sl=el.scrollLeft;lx=e.clientX;v=0;cancelAnimationFrame(raf)};
  const mv=e=>{if(!down)return;el.scrollLeft=sl-(e.clientX-sx);v=e.clientX-lx;lx=e.clientX};
  const mu=()=>{if(!down)return;down=false;el.classList.remove('down');const glide=()=>{v*=.94;el.scrollLeft-=v;if(Math.abs(v)>.5)raf=requestAnimationFrame(glide)};glide()};
  el.addEventListener('pointerdown',md);addEventListener('pointermove',mv);addEventListener('pointerup',mu);
  cleanups.push(()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',mu);cancelAnimationFrame(raf)});
}

function certs(p){
  const g=$('#certG',p),q=$('#certQ',p),n=$('#certN',p),em=$('#certE',p);
  const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  g.innerHTML=MEASURES.map((m,i)=>`<div class="m rv" data-t="${esc(m.toLowerCase())}"><img src="/img/icon.png" alt=""><span>${esc(m)}</span></div>`).join('');
  observe(g);
  const run=()=>{const v=q.value.trim().toLowerCase();let c=0;$$('.m',g).forEach((el,i)=>{const hit=!v||el.dataset.t.includes(v);el.classList.toggle('hidden',!hit);if(hit){c++;el.classList.add('in');const t=MEASURES[i];$('span',el).innerHTML=v?esc(t).replace(new RegExp('('+v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>'):esc(t)}});
    n.innerHTML=v?`<b>${c}</b> match${c===1?'':'es'}`:`<b>${MEASURES.length}</b> measures listed`;em.style.display=c?'none':'block'};
  q.addEventListener('input',run);run();
}

function flips(p){
  const w=$('#flips',p);
  w.innerHTML=SVCS.map((s,i)=>`<div class="flip rv" tabindex="0" role="button" aria-label="${s}: show details" data-cur="Flip"><div class="fc front"><img src="/img/svc${i+1}.webp" loading="lazy" alt="${s}"><i>${String(i+1).padStart(2,'0')}</i><span>${s}</span></div><div class="fc back"><b>${s}</b><ul><li>Inspect</li><li>Test</li><li>Repair</li><li>Install</li><li>Certify</li></ul><a href="/contact/" data-svc="Repairs & Preventative" data-msg="${s}">Enquire →</a></div></div>`).join('');
  observe(w);
  $$('.flip',w).forEach(f=>{const t=()=>{f.classList.toggle('on');Snd.blip(520,.06,.04)};f.addEventListener('click',e=>{if(!e.target.closest('a'))t()});f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}})});
}

function alarms(p){
  const w=$('#alarms',p);
  const icon=k=>`<svg viewBox="0 0 96 96"><circle class="wave" cx="48" cy="40" r="40"/><circle class="wave w2" cx="48" cy="40" r="40"/><ellipse cx="48" cy="40" rx="34" ry="12" fill="var(--paper)" stroke="var(--line)" stroke-width="2"/><path d="M14 40v8c0 7 15 12 34 12s34-5 34-12v-8" fill="var(--card)" stroke="currentColor" stroke-opacity=".25" stroke-width="2"/><circle class="led" cx="62" cy="40" r="3.5"/>${k==='heat'?'<path d="M40 30c2 3 6 4 6 8a4 4 0 0 1-8 0c0-2 1-3 2-4z" fill="var(--pink)"/>':k==='wifi'?'<path d="M36 34a16 16 0 0 1 20 0M40 38a9 9 0 0 1 12 0" stroke="var(--pink)" stroke-width="2.4" fill="none" stroke-linecap="round"/>':k==='hard'?'<path d="M48 60v18M42 78h12" stroke="currentColor" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"/><path d="M44 66l6-4-4 8 6-4" stroke="var(--pink)" stroke-width="2" fill="none"/>':'<rect x="38" y="35" width="14" height="9" rx="2" fill="none" stroke="var(--pink)" stroke-width="2"/><path d="M52 38v3" stroke="var(--pink)" stroke-width="2"/>'}</svg>`;
  w.innerHTML=ALARMS.map(([a,b,k])=>`<div class="al rv">${icon(k)}<b>${a}</b><span class="tag">${b}</span></div>`).join('');
  observe(w);$$('.al',w).forEach(a=>a.addEventListener('pointerenter',()=>Snd.blip(3200,.08,.02,'square')));
}

function issues(p){const out=$('#issueTxt',p);$$('.issue',p).forEach(b=>b.addEventListener('click',()=>{$$('.issue',p).forEach(x=>x.classList.toggle('on',x===b));out.textContent=ISSUES[+b.dataset.i];const s=$('svg',b);s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');Snd.blip(440,.12,.05,'triangle')}))}

function contact(p){
  const pk=$('#pick',p);pk.innerHTML=PICKS.map((s,i)=>`<input type="checkbox" id="pk${i}" value="${s}"${s===SS.get('pf-svc')?' checked':''}><label for="pk${i}">${s}</label>`).join('');
  const pm=SS.get('pf-msg');if(pm){$('#fMsg',p).value=pm}SS.del('pf-svc');SS.del('pf-msg');
  $('#cform',p).addEventListener('submit',e=>{e.preventDefault();
    const f=$('#fFirst',p),em=$('#fEmail',p),m=$('#fMsg',p);
    for(const x of [f,em,m]){if(!x.value.trim()||(x===em&&!/^\S+@\S+\.\S+$/.test(x.value))){x.focus();x.parentElement.classList.add('shake');setTimeout(()=>x.parentElement.classList.remove('shake'),500);return}}
    const svc=$$('input:checked',pk).map(i=>i.value);
    const name=(f.value+' '+$('#fLast',p).value).trim();
    const body=`${m.value}\n\n---\nName: ${name}\nEmail: ${em.value}${svc.length?'\nAbout: '+svc.join(', '):''}`;
    location.href='mailto:office@profireaustralia.com.au?subject='+encodeURIComponent('Website enquiry'+(svc.length?': '+svc.join(', '):'')+' ('+name+')')+'&body='+encodeURIComponent(body);
    $('#fOk',p).style.display='block';Snd.chime();
  });
}

/* magnetic + tilt */
function mag(el){const mv=e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`};const lv=()=>{el.style.transform=''};el.addEventListener('pointermove',mv);el.addEventListener('pointerleave',lv)}
function tilt(el){el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-6px)`});el.addEventListener('pointerleave',()=>{el.style.transform=''})}

/* ---------------- header / scroll ---------------- */
const hdr=$('#hdr'),prog=$('#prog'),mcall=$('#mcall');let lastY=0,ticking=false;
function onScroll(){
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  hdr.classList.toggle('scrolled',y>40);
  if(!document.body.classList.contains('locked'))hdr.classList.toggle('hide',y>300&&y>lastY+2);
  if(y<lastY-2)hdr.classList.remove('hide');
  lastY=y;prog.style.transform=`scaleX(${h>0?y/h:0})`;mcall.classList.toggle('show',y>500);
  if(!RM)for(const el of parallax){const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;el.style.transform=`translate3d(0,${(-r.top*+el.dataset.speed).toFixed(1)}px,0)`}
  for(const s of stories){const r=s.getBoundingClientRect();const k=Math.max(0,Math.min(1,(innerHeight*.6-r.top)/r.height));$('.fill',s).style.height=(k*100)+'%'}
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{onScroll();ticking=false})}},{passive:true});
$('#topBtn').addEventListener('click',()=>scrollTo({top:0,behavior:RM?'auto':'smooth'}));
$('#yr').textContent=new Date().getFullYear();

/* mobile menu */
const mnav=$('#mnav'),burger=$('#burger');
function openMenu(){mnav.classList.add('open');mnav.setAttribute('aria-hidden','false');burger.setAttribute('aria-expanded','true');document.body.classList.add('locked');$$('.big',mnav).forEach((a,i)=>a.style.transitionDelay=(.15+i*.06)+'s');Snd.whoosh()}
function closeMenu(){if(!mnav.classList.contains('open'))return;mnav.classList.remove('open');mnav.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');document.body.classList.remove('locked');$$('.big',mnav).forEach(a=>a.style.transitionDelay='0s')}
burger.addEventListener('click',openMenu);$('#mclose').addEventListener('click',closeMenu);
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();
  if(e.key==='/'&&!/input|textarea/i.test(document.activeElement.tagName)){const q=$('#certQ');if(q){e.preventDefault();q.focus();q.scrollIntoView({block:'center'})}}});

/* cursor */
if(FINE&&!RM){const c=$('#cur'),r=$('#curR');let x=-100,y=-100,rx=-100,ry=-100;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;c.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;const t=e.target.closest&&e.target.closest('[data-cur]');r.classList.toggle('big',!!t);r.textContent=t?t.dataset.cur:''});
  const f=()=>{rx+=(x-rx)*.18;ry+=(y-ry)*.18;r.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(f)};f();
  document.addEventListener('pointerleave',()=>{x=y=-100})}
else{$('#cur').remove();$('#curR').remove()}

/* same-hash clicks still scroll to top */

boot();
})();
