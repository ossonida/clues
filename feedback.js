// 한 줄 피드백: 사건을 끝낸 결말 화면에 반응 버튼 + 한 줄 칸을 붙인다.
// - 노트 코드는 건드리지 않는다. 결말마다 있는 「처음부터 다시」 버튼(#again)을 찾아 그 줄 바로 위에 끼운다.
// - 노트 id는 <html data-note="noteNN">. 저장은 메인 추천 버튼과 같은 Firebase 프로젝트의 clueFeedback 컬렉션 (쓰기만, 읽기 불가).
// - 적은 글은 GA(analytics.js)로 보내지 않는다. 로그인 없음. 기기마다 사건당 한 번 (hn.fb.noteNN).
(()=>{
  const NOTE=document.documentElement.dataset.note;
  if(!NOTE||!/^note\d\d$/.test(NOTE))return;
  const EN=window.HN_LANG==='en';
  const T=EN?{
    q:'How was this case?',fun:'Loved it',meh:'It was okay',hard:'Too hard',
    ph:'One line, if you like: a moment you remember, or where you got stuck',only:'Only the author reads this.',
    send:'Send',sending:'Sending…',thanks:'Thanks! The author will read it.',fail:'Could not send. Please try again.',pick:'Pick one first.'
  }:{
    q:'이번 사건 어땠어요?',fun:'재밌었다',meh:'그냥 그랬다',hard:'어려웠다',
    ph:'한 줄 남겨도 좋아요. 기억에 남는 장면, 막혔던 곳',only:'만든 사람만 봐요.',
    send:'보내기',sending:'보내는 중…',thanks:'고마워요. 만든 사람이 꼭 읽을게요.',fail:'보내지 못했어요. 다시 눌러 주세요.',pick:'먼저 하나를 골라 주세요.'
  };
  const KEY='hn.fb.'+NOTE;
  const sent=()=>{try{return !!localStorage.getItem(KEY)}catch{return false}};
  // 결말 화면이 다시 그려져도 고른 것·적던 글이 남게 메모리에 둔다
  const draft={r:'',text:'',busy:false,msg:''};

  const css=`.hnfb{margin:18px 0 6px;padding:12px 14px;border:2px dashed rgba(60,50,40,.35);border-radius:6px;background:rgba(255,253,244,.75);color:#2a2422;max-width:560px}
.hnfb p{margin:0 0 8px;font-weight:bold}
.hnfb .hnfb-r{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.hnfb button{font:inherit;cursor:pointer;border:2px solid #3a322c;background:#fffdf4;color:#2a2422;border-radius:4px;padding:6px 10px}
.hnfb .hnfb-r button[aria-pressed="true"]{background:#3a322c;color:#fffdf4}
.hnfb textarea{box-sizing:border-box;width:100%;min-height:58px;font:inherit;border:1px solid #8a8170;border-radius:4px;padding:6px 8px;background:#fff;color:#2a2422;resize:vertical}
.hnfb .hnfb-s{display:flex;align-items:center;gap:10px;margin-top:6px;flex-wrap:wrap}
.hnfb small{color:#5a5046}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function html(){
    if(sent())return `<p>${T.thanks}</p>`;
    const b=(k)=>`<button type="button" data-r="${k}" aria-pressed="${draft.r===k}">${T[k]}</button>`;
    return `<p>${T.q}</p><div class="hnfb-r">${b('fun')}${b('meh')}${b('hard')}</div>
<textarea maxlength="200" placeholder="${esc(T.ph)}">${esc(draft.text)}</textarea>
<div class="hnfb-s"><button type="button" class="hnfb-send"${draft.busy?' disabled':''}>${draft.busy?T.sending:T.send}</button><small role="status">${draft.msg||T.only}</small></div>`;
  }
  function paint(box){box.innerHTML=html()}

  // Firebase는 보낼 때만 불러온다 (메인 index.html의 추천 버튼과 같은 프로젝트)
  const firebaseConfig={apiKey:"AIzaSyDKYbgVzDYBrdlXgIkIWASoIIpc9B_IkTc",authDomain:"score-1948e.firebaseapp.com",projectId:"score-1948e",appId:"1:846954040500:web:a963b214d62bd393451be1"};
  const base='https://www.gstatic.com/firebasejs/12.4.0/';
  let fb;
  const connect=()=>fb||(fb=Promise.all([import(base+'firebase-app.js'),import(base+'firebase-firestore.js')]).then(([app,store])=>({store,db:store.getFirestore(app.initializeApp(firebaseConfig,'clues-feedback'))})).catch(e=>{fb=null;throw e}));
  function stats(){
    let ms=0,hints=-1;
    try{const c=JSON.parse(localStorage.getItem('hn.clear.'+NOTE)||'{}');ms=Math.max(0,Math.round(+c.last||0))}catch{}
    const h=document.getElementById('hintCount');if(h&&/^\d+$/.test(h.textContent.trim()))hints=+h.textContent.trim();
    return {ms,hints};
  }
  async function send(box){
    if(!draft.r){draft.msg=T.pick;paint(box);return}
    draft.busy=true;draft.msg='';paint(box);
    try{
      const {store,db}=await connect(),s=stats();
      await store.addDoc(store.collection(db,'clueFeedback'),{note:NOTE,r:draft.r,text:draft.text.trim().slice(0,200),ms:s.ms,hints:s.hints,lang:EN?'en':'ko',at:store.serverTimestamp()});
      try{localStorage.setItem(KEY,draft.r)}catch{}
      draft.busy=false;paint(box);
    }catch(e){draft.busy=false;draft.msg=T.fail;paint(box)}
  }

  // 클리어 수: 결말 화면이 처음 보일 때 이 기기에서 한 번만 (분석 제외한 내 기기는 세지 않음) clueLikes/clear_noteNN count +1 (메인 사건 대장 「클리어」 칸이 읽음)
  async function countClear(){
    const again=document.getElementById('again');if(!again||again.offsetParent===null)return;
    const k='hn.clearCounted.'+NOTE;try{if(localStorage.getItem('score.analytics.exclude.v1')==='1')return;if(localStorage.getItem(k))return;const c=JSON.parse(localStorage.getItem('hn.clear.'+NOTE)||'{}');if(!c.ok)return;localStorage.setItem(k,'1')}catch{return}
    try{const {store,db}=await connect();await store.setDoc(store.doc(db,'clueLikes','clear_'+NOTE),{count:store.increment(1)},{merge:true})}catch{try{localStorage.removeItem(k)}catch{}}
  }
  function mount(){
    countClear();
    const again=document.getElementById('again');if(!again)return;
    const row=again.parentElement;if(!row||row.parentElement.querySelector(':scope>.hnfb'))return;
    const box=document.createElement('section');box.className='hnfb';box.setAttribute('aria-label',T.q);
    row.parentElement.insertBefore(box,row);paint(box);
    box.addEventListener('click',e=>{
      const r=e.target.closest('[data-r]');if(r){draft.r=r.dataset.r;draft.msg='';paint(box);return}
      if(e.target.closest('.hnfb-send')&&!draft.busy)send(box);
    });
    box.addEventListener('input',e=>{if(e.target.tagName==='TEXTAREA')draft.text=e.target.value});
  }
  new MutationObserver(mount).observe(document.body||document.documentElement,{childList:true,subtree:true});
  mount();
  // 기록 공유(share.js)도 같이 붙인다. 피드백 칸 아래에 놓이도록 피드백을 먼저 붙인 뒤 불러온다
  const me=document.currentScript;if(me){const s=document.createElement('script');s.src=me.src.replace(/feedback.js.*$/,'share.js');s.defer=true;document.head.appendChild(s)}
})();
