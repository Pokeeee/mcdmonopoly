// ==UserScript==
// @name         PlayAtMCD – Gmail → Verify → Request Autofill
// @namespace    https://github.com/Pokeeee/mcdmonopoly
// @version      2.6
// @description  Gmail: bottom-right Auto-Verify button only; expands collapsed threads, finds verify links, appends OTP, opens; verify page auto-pastes/continues; request form prompts once for profile (suffix/state included), autofills, validates, submits.
// @match        https://mail.google.com/*
// @match        https://amoe.playatmcd.com/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @author       Jade and Pokeeee
// ==/UserScript==

(function () {
  'use strict';
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const sleep = ms=>new Promise(r=>setTimeout(r,ms));
  const norm = s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();

  /* ========================= Gmail ========================= */
  if (location.hostname === 'mail.google.com') {
    // single bottom-right button
    function ensureButton() {
      if (document.getElementById('pamcd_btn_br')) return;
      const b = document.createElement('button');
      b.id='pamcd_btn_br';
      b.textContent='Auto-Verify Links';
      Object.assign(b.style,{
        position:'fixed',bottom:'20px',right:'20px',zIndex:'2147483647',
        padding:'10px 14px',fontSize:'14px',borderRadius:'8px',
        border:'1px solid rgba(0,0,0,.2)',background:'#111',color:'#fff',
        cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,.3)'
      });
      b.onclick=runOpenLinks;
      document.body.appendChild(b);
    }
    new MutationObserver(()=>ensureButton()).observe(document.documentElement,{childList:true,subtree:true});
    ensureButton();
    setInterval(ensureButton, 2000);
  }

  // --- Gmail expanders and OTP link opener ---
  async function expandCollapsedParts(timeoutMs=8000){
    const t0=Date.now(); const bodies=()=>document.querySelectorAll('div.a3s').length; let before=bodies();
    const clickAll=(l)=>l.forEach(e=>{try{e.click();}catch{}});
    clickAll(document.querySelectorAll('span.aQJ,span.ajR,[aria-label*="Show trimmed"],[data-tooltip*="Show trimmed"]'));
    clickAll(document.querySelectorAll('a[href*="view=om"]'));
    clickAll(document.querySelectorAll('div[role="button"][aria-label*="Expand"],[aria-label*="Expand all"]'));
    // numeric conversation bubbles
    const bubbles=Array.from(document.querySelectorAll('span,div,a')).filter(el=>{
      const t=(el.textContent||'').trim();
      if(!/^\d{1,3}$/.test(t))return false;
      const r=el.getBoundingClientRect(); if(!r.width||r.width>60||r.height>60)return false;
      const style=getComputedStyle(el); return parseFloat(style.borderRadius)>8||style.borderRadius.includes('%');
    });
    bubbles.forEach(el=>{let n=el;for(let i=0;i<3&&n;i++){try{n.click();}catch{}n=n.parentElement;}});
    window.scrollBy(0,600);await sleep(120);window.scrollBy(0,-600);
    while(Date.now()-t0<timeoutMs){
      clickAll(document.querySelectorAll('span.aQJ,span.ajR,[aria-label*="Show trimmed"],[data-tooltip*="Show trimmed"],a[href*="view=om"],div[role="button"][aria-label*="Expand"]'));
      bubbles.forEach(el=>{try{el.click();}catch{}});
      const after=bodies();
      if(after>before)break;
      await sleep(200);
    }
  }

  function nearestSixDigit(a){
    const c=a.closest('div.a3s')||document.body;
    const m=(c.innerText||'').match(/\b\d{6}\b/);
    return m?m[0]:null;
  }

  async function runOpenLinks(){
    await expandCollapsedParts();
    const anchors=$$('div.a3s a');
    const targets=anchors.filter(a=>a.href&&a.href.startsWith('https://amoe.playatmcd.com/verify_your_email'));
    if(!targets.length){alert('No PlayAtMCD verify links found.');return;}
    let opened=0;
    for(const a of targets){
      const code=nearestSixDigit(a);
      const url=code?`${a.href}#${code}`:a.href;
      try{GM_openInTab(url,{active:false});}catch{window.open(url,'_blank');}
      if(++opened>=20)break;
    }
    alert(`Opened ${opened} verify page(s).`);
  }

  /* ========================= Verify page ========================= */
  if (location.hostname === 'amoe.playatmcd.com' && location.pathname.startsWith('/verify_your_email')) {
    const getCode=()=>{const h=(location.hash||'').slice(1);const q=new URLSearchParams(location.search).get('otp')||'';return[h,q].find(v=>/^\d{6}$/.test(v))||'';};
    function pasteAndGo(){
      const code=getCode();if(!code)return;
      const input=document.getElementById('otp');
      if(input){input.value=code;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}
      const btn=document.querySelector('#verifyemail_btn button[type="submit"]')||$$('button').find(b=>/verify|continue/i.test(b.textContent||''));
      btn&&setTimeout(()=>btn.click(),150);
    }
    new MutationObserver(()=>{if(document.querySelector('#verifyemail_btn button[type="submit"]'))pasteAndGo();})
      .observe(document.body,{childList:true,subtree:true});
    window.addEventListener('load',()=>setTimeout(pasteAndGo,250));
  }

  /* ========================= Request form ========================= */
  if (location.hostname === 'amoe.playatmcd.com') waitForForm().then(fillAndSubmit).catch(()=>{});

  function waitForForm(){
    return new Promise((res,rej)=>{
      const ready=()=>document.getElementById('state')||document.querySelector('select#state')||document.querySelector('input[placeholder*="First Name" i]');
      const e=ready();if(e)return res(e);
      const mo=new MutationObserver(()=>{const x=ready();if(x){mo.disconnect();res(x);}});
      mo.observe(document.body,{childList:true,subtree:true});
      setTimeout(()=>{mo.disconnect();rej();},15000);
    });
  }

  const LS='playatmcd_profile';
  const need=(p)=>!p||!p.first||!p.last||!p.street||!p.city||!p.zip||!p.state||p.state.length!==2||!p.suffix;
  function promptProfile(seed={}){
    const cur=Object.assign({first:'',last:'',suffix:'Mr',street:'',apt:'',city:'',state:'NY',zip:''},seed);
    const first=prompt('First Name:',cur.first)??cur.first;
    const last=prompt('Last Name:',cur.last)??cur.last;
    const suffix=prompt('Suffix (Mr, Ms, Mrs, Dr, Jr, Sr, II):',cur.suffix)??cur.suffix;
    const street=prompt('Street Address:',cur.street)??cur.street;
    const apt=prompt('Apartment/Unit (optional):',cur.apt)??cur.apt;
    const city=prompt('City:',cur.city)??cur.city;
    const state=(prompt('State (2-letter, e.g., NY):',cur.state)??cur.state).toUpperCase();
    const zip=prompt('Zip Code:',cur.zip)??cur.zip;
    const p={first,last,suffix,street,apt,city,state,zip};GM_setValue(LS,p);return p;
  }
  function setVal(el,v){if(!el||v==null)return false;el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;}
  function findInput(keys){const ok=i=>{const ph=(i.placeholder||'').toLowerCase(),nm=(i.name||'').toLowerCase(),id=(i.id||'').toLowerCase();return keys.some(w=>ph.includes(w)||nm.includes(w)||id.includes(w));};return $$('input,textarea').find(ok);}
  function selectBy(sel,val){const el=typeof sel==='string'?(document.getElementById(sel.replace('#',''))||document.querySelector(sel)):sel;if(!el||el.tagName!=='SELECT')return false;const goal=String(val).trim().toUpperCase();const opts=Array.from(el.options);const match=opts.find(o=>(o.value||'').toUpperCase()===goal)||opts.find(o=>(o.text||'').toUpperCase()===goal)||opts.find(o=>(o.text||'').toUpperCase().startsWith(goal));if(!match)return false;el.value=match.value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;}
  function findBtn(txt){const want=norm(txt);return $$('button,input[type="submit"],a').find(el=>norm(el.value||el.textContent||'').includes(want));}

  async function fillAndSubmit(){
    let p=GM_getValue(LS,null);if(need(p))p=promptProfile(p||{});
    setVal(findInput(['first','first name']),p.first);
    setVal(findInput(['last','last name','surname']),p.last);
    let suffixOK=selectBy('#suffix',p.suffix)||selectBy('suffix',p.suffix);if(!suffixOK)setVal(findInput(['suffix']),p.suffix);
    setVal(findInput(['street','address']),p.street);if(p.apt)setVal(findInput(['apartment','unit','apt']),p.apt);
    setVal(findInput(['city']),p.city);
    let stateOK=selectBy('#state',p.state)||selectBy('state',p.state);if(!stateOK)setVal(findInput(['state']),p.state);
    setVal(findInput(['zip','postal']),p.zip);
    if(!suffixOK){const fix=prompt('Suffix is required (Mr, Ms, Mrs, Dr, Jr, Sr, II):',p.suffix||'Mr')||'Mr';if(selectBy('#suffix',fix)||selectBy('suffix',fix)||setVal(findInput(['suffix']),fix)){const cur=GM_getValue(LS,p);cur.suffix=fix;GM_setValue(LS,cur);}else{alert('Please choose a Suffix from the dropdown.');return;}}
    const v=findBtn('Validate My Address')||findBtn('Validate Address');if(v){v.scrollIntoView({behavior:'smooth',block:'center'});await sleep(150);v.click();}
    const s=findBtn('Submit Game Code Request')||findBtn('Submit');if(!s)return;
    const ready=()=>{const aria=s.getAttribute?.('aria-disabled');const dis=s.disabled||(aria&&aria.toLowerCase()==='true');const r=s.getBoundingClientRect?.()||{width:10,height:10};return!dis&&r.width>2&&r.height>2;};
    const dl=Date.now()+15000;while(Date.now()<dl&&!ready())await sleep(250);
    if(ready()){s.scrollIntoView({behavior:'smooth',block:'center'});await sleep(120);s.click();}
  }
})();
