// 기록 공유: 결말 화면(#again 줄 위, 한 줄 피드백 아래)에 「기록 카드 공유」「친구에게 링크 보내기」를 붙인다.
// - feedback.js가 이 파일을 불러온다. 노트 코드는 건드리지 않는다.
// - 기록은 hn.clear.noteNN({ok,best,last}), 힌트 수는 #hintCount, 틀린 암호 수는 hn.wrong.noteNN. 줄거리·정답은 넣지 않는다.
// - 기록 카드는 /api/r 링크로 보낸다(메신저 미리보기에 등급 도장 이미지·기록, 누르면 노트로). 링크 보내기는 노트 주소 그대로.
(()=>{
  const NOTE=document.documentElement.dataset.note;
  if(!NOTE||!/^note\d\d$/.test(NOTE))return;
  const EN=window.HN_LANG==='en';
  const NUM=NOTE.slice(4);
  const URL_=`https://clues-kappa.vercel.app/notes/${NUM}/${EN?'?lang=en':''}`;
  const grade=()=>{const g=document.querySelector('.result .seal,.seal,.res-score');return g?g.textContent.replace(/s+/g,' ').trim().slice(0,20):''};
  // 기록 카드 링크: 받은 사람이 열면 친구 기록 카드를 먼저 보여 주고, 닫으면 그 노트의 시작 화면
  // 등급 번호표 (api/r.js NOTES와 같게). 링크를 짧게: g=번호
  const GR={'01':['완전 해결','거의 해결','범인은 맞혔지만…','미해결'],'02':['명예 문예부원','문예부원','견학생'],'03':['숙직 교사','순찰 대원','비 피한 손님'],'04':['짝꿍','낙서 친구','전학생'],'05':['영사기사','단골 관객','귀신 구경꾼'],'06':['구름재 관측원','야간 관측원','견습 관측원']};
  function recURL(){const r=rec(),p=new URLSearchParams({n:NUM}),gi=(GR[NUM]||[]).indexOf(grade());if(gi>=0)p.set('g',gi);if(r.ms)p.set('t',Math.round(r.ms/1000));if(r.hints>=0)p.set('h',r.hints);if(r.wrong>=0)p.set('w',r.wrong);if(EN)p.set('lang','en');return `https://clues-kappa.vercel.app/api/r?${p}`}
  const TITLE=(document.title.split(' | ')[0]||'').replace(/^Note\s*\d+\s*·\s*/i,'').trim();
  const T=EN?{
    h:'Share your record',card:'Share my record',link:'Send to a friend',manual:'Copy the text below and send it.',copied:'Copied. Paste it into a chat.',
    fail:'Could not share. Please try again.',time:'Time',hints:'Hints',wrong:'Wrong codes',none:'none',done:'Escaped!',open:'Unsolved',
    line:'Your turn?',friend:`A free mystery escape game in your browser: Hidden Note ${NUM} "${TITLE}". Keep a scrap of paper handy.`
  }:{
    h:'기록 공유',card:'기록 카드 공유',link:'친구에게 링크 보내기',manual:'아래 문구를 복사해서 보내 주세요.',copied:'복사했어요. 채팅방에 붙여 넣어 주세요.',
    fail:'공유하지 못했어요. 다시 눌러 주세요.',time:'걸린 시간',hints:'힌트',wrong:'틀린 암호',none:'없음',done:'탈출!',open:'미해결',
    line:'너도 해 볼래?',friend:`브라우저에서 바로 하는 무료 추리·방탈출, 히든노트 ${NUM} 「${TITLE}」. 메모지 한 장 옆에 두고 해 봐.`
  };
  function rec(){
    let ok=true,ms=0,hints=-1,wrong=-1;
    try{const c=JSON.parse(localStorage.getItem('hn.clear.'+NOTE)||'{}');ms=Math.max(0,Math.round(+c.last||0));if(c.ok===false)ok=false}catch{}
    const h=document.getElementById('hintCount');if(h&&/^\d+$/.test(h.textContent.trim()))hints=+h.textContent.trim();
    // 틀린 암호 수는 analytics.js가 이 기기에만 센다(puzzle_tried 오답). 센 기록이 없으면 줄을 뺀다
    try{const w=localStorage.getItem('hn.wrong.'+NOTE);if(w!==null&&/^\d+$/.test(w))wrong=+w}catch{}
    return {ok,ms,hints,wrong};
  }
  const fmt=ms=>{const m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60;return EN?(m?`${m}m ${s}s`:`${s}s`):(m?`${m}분 ${s}초`:`${s}초`)};
  // 공유 문구: 카톡 등에 글로 보이는 기록 (걸린 시간 · 힌트 · 틀린 암호) + 주소(미리보기 카드는 og 이미지)
  function recordText(){
    const r=rec(),g=grade()||(r.ok?T.done:T.open);
    return EN?`"${TITLE}" ${g}${r.ms?' · '+fmt(r.ms):''}. ${T.line}`:`「${TITLE}」 ${g}${r.ms?' · '+fmt(r.ms):''}. ${T.line}`;
  }
  async function copy(s){try{await navigator.clipboard.writeText(s);return true}catch{}
    try{const a=document.createElement('textarea');a.value=s;a.setAttribute('readonly','');a.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();return ok}catch{return false}}
  function showText(box,s){let ta=box.querySelector('textarea');if(!ta){ta=document.createElement('textarea');ta.readOnly=true;box.appendChild(ta)}ta.value=s;ta.focus();ta.select()}
  // 공유 창(카톡 등)에 글 + 링크. 공유 창이 없으면(PC, 카톡 안 브라우저) 글과 주소를 복사
  async function share(box,text,url=URL_){
    if(navigator.share){try{await navigator.share({text,url});return ''}catch(e){if(e&&e.name==='AbortError')return ''}}
    const s=text+'\n'+url;if(await copy(s))return T.copied;showText(box,s);return T.manual;
  }

  const st=document.createElement('style');st.textContent=`.hnsh{margin:6px 0;max-width:560px;color:#2a2422}.hnsh:empty{display:none}
.hnsh p{margin:0 0 6px;font-weight:bold}
.hnsh .row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.hnsh button{font:inherit;cursor:pointer;border:2px solid #3a322c;background:#fffdf4;color:#2a2422;border-radius:4px;padding:6px 10px}
.hnsh button.main{background:#3a322c;color:#fffdf4}
.hnsh small{color:#5a5046}
.hnsh textarea{display:block;box-sizing:border-box;width:100%;min-height:70px;margin-top:8px;font:inherit;font-size:14px;border:1px solid #8a8170;border-radius:4px;padding:6px 8px;background:#fff;color:#2a2422}
`;document.head.appendChild(st);

  function mount(){
    const again=document.getElementById('again');if(!again||document.querySelector('[data-sh="card"]'))return;
    const row=again.parentElement;if(!row)return;
    // 결말 버튼 줄 맨 앞(「처음부터 다시」 앞)에 「기록 카드 공유」 하나만. 안내·복사 칸은 버튼 줄 바로 아래
    const b=document.createElement('button');b.type='button';b.className=again.className;b.dataset.sh='card';b.textContent=T.card;
    row.insertBefore(b,again);if(again.previousSibling!==b)row.insertBefore(document.createTextNode(' '),again);
    const box=document.createElement('div');box.className='hnsh';box.setAttribute('role','status');row.after(box);
    b.addEventListener('click',async()=>{if(b.disabled)return;b.disabled=true;box.textContent='';
      try{const m=await share(box,recordText(),recURL());if(m){const s=document.createElement('small');s.textContent=m;box.prepend(s)}}catch{box.textContent=T.fail}
      b.disabled=false});
  }
  // 받은 사람: 링크에 친구 기록(r·t·h·w)이 있으면 기록 카드를 먼저 띄우고, 닫으면 노트 시작 화면
  function friendCard(){
    const q=new URLSearchParams(location.search),r=q.get('r');if(!r)return;
    const num=k=>{const v=q.get(k);return v!==null&&/^\d{1,6}$/.test(v)?+v:-1};
    const t=num('t'),h=num('h'),w=num('w'),esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const clock=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
    const rows=[t>=0&&[T.time,clock(t)],h>=0&&[T.hints,EN?h:h+'장'],w>=0&&[T.wrong,EN?w:w+'번']].filter(Boolean);
    const css=document.createElement('style');css.textContent=`.hnfr{position:fixed;inset:0;z-index:9999;background:rgba(20,16,12,.62);display:flex;align-items:center;justify-content:center;padding:16px}
.hnfr .c{width:100%;max-width:420px;background-color:#fffdf4;background-image:repeating-linear-gradient(transparent 0 37px,#c9d3e6 37px 38px);border-left:3px solid #e6a3a0;padding:20px 22px 18px;box-shadow:0 20px 40px rgba(0,0,0,.4);color:#2a2422;font-family:"Kkakdugi Drafting",var(--mono,monospace)}
.hnfr .who{font-size:13px;color:#6b6358;margin:0 0 10px}
.hnfr .st{display:inline-block;border:4px solid #a3312a;color:#a3312a;font-family:"LevelUp",var(--serif,serif);font-size:clamp(22px,7vw,30px);padding:4px 16px;transform:rotate(-6deg);margin:4px 0 14px}
.hnfr dl{margin:0 0 14px}.hnfr dl div{display:flex;padding:8px 0;border-bottom:1px dotted #b8ad95}.hnfr dt{width:45%;color:#6b6358}.hnfr dd{margin:0;font-size:20px}
.hnfr button{font:inherit;font-weight:700;cursor:pointer;width:100%;border:2px solid #2a2422;background:#2a2422;color:#fffdf4;border-radius:3px;padding:10px}`;
    document.head.appendChild(css);
    const o=document.createElement('div');o.className='hnfr';o.setAttribute('role','dialog');o.setAttribute('aria-label',EN?'Friend record':'친구 기록');
    o.innerHTML=`<div class="c"><p class="who">${EN?`A friend's record · Hidden Note ${NUM} "${esc(TITLE)}"`:`친구의 기록 · 히든노트 ${NUM} 「${esc(TITLE)}」`}</p><div class="st">${esc(r.slice(0,20))}</div>
      <dl>${rows.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><button type="button">${EN?'Try it yourself':'나도 도전하기'}</button></div>`;
    const close=()=>{o.remove();try{const u=new URL(location.href);['r','t','h','w'].forEach(k=>u.searchParams.delete(k));history.replaceState(null,'',u)}catch{}};
    o.querySelector('button').onclick=close;o.onclick=e=>{if(e.target===o)close()};
    (document.body||document.documentElement).appendChild(o);
  }
  if(document.body)friendCard();else addEventListener('DOMContentLoaded',friendCard);

  new MutationObserver(mount).observe(document.body||document.documentElement,{childList:true,subtree:true});
  mount();
})();
