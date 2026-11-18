// 기록 공유: 결말 화면(#again 줄 위, 한 줄 피드백 아래)에 「기록 카드 공유」「친구에게 링크 보내기」를 붙인다.
// - feedback.js가 이 파일을 불러온다. 노트 코드는 건드리지 않는다.
// - 기록은 hn.clear.noteNN({ok,best,last}), 힌트 수는 #hintCount. 줄거리·정답은 카드에 넣지 않는다.
// - 기록 카드는 캔버스로 그린 1080×1080 PNG. 휴대폰은 공유 창, 안 되면 이미지 저장 + 문구 복사.
(()=>{
  const NOTE=document.documentElement.dataset.note;
  if(!NOTE||!/^note\d\d$/.test(NOTE))return;
  const EN=window.HN_LANG==='en';
  const NUM=NOTE.slice(4);
  const URL_=`https://ossonida.github.io/clues/notes/${NUM}/${EN?'?lang=en':''}`;
  const TITLE=(document.title.split(' | ')[0]||'').replace(/^Note\s*\d+\s*·\s*/i,'').trim();
  const T=EN?{
    h:'Share your record',card:'Share record card',link:'Send to a friend',saved:'Image saved and text copied.',copied:'Link copied.',
    fail:'Could not share. Please try again.',time:'Time',hints:'Hints',none:'none',done:'ESCAPED',open:'UNSOLVED',
    tease:'Can you beat it?',line:(t,h)=>`I finished Hidden Note ${NUM} "${TITLE}" in ${t}${h}. Your turn?`,hl:h=>h<0?'':h===0?' with no hints':` with ${h} hint${h>1?'s':''}`,
    friend:`A free mystery escape game in your browser: Hidden Note ${NUM} "${TITLE}". Keep a scrap of paper handy.`
  }:{
    h:'기록 공유',card:'기록 카드 공유',link:'친구에게 링크 보내기',saved:'이미지를 저장하고 문구를 복사했어요.',copied:'링크를 복사했어요.',
    fail:'공유하지 못했어요. 다시 눌러 주세요.',time:'걸린 시간',hints:'힌트',none:'없음',done:'탈 출',open:'미 해 결',
    tease:'너는 몇 분?',line:(t,h)=>`히든노트 ${NUM} 「${TITLE}」 ${t}${h} 끝냈어. 너도 해 볼래?`,hl:h=>h<0?'':h===0?', 힌트 없이':`, 힌트 ${h}개 쓰고`,
    friend:`브라우저에서 바로 하는 무료 추리·방탈출, 히든노트 ${NUM} 「${TITLE}」. 메모지 한 장 옆에 두고 해 봐.`
  };
  function rec(){
    let ok=true,ms=0,hints=-1;
    try{const c=JSON.parse(localStorage.getItem('hn.clear.'+NOTE)||'{}');ms=Math.max(0,Math.round(+c.last||0));if(c.ok===false)ok=false}catch{}
    const h=document.getElementById('hintCount');if(h&&/^\d+$/.test(h.textContent.trim()))hints=+h.textContent.trim();
    return {ok,ms,hints};
  }
  const fmt=ms=>{const m=Math.floor(ms/60000),s=Math.floor(ms/1000)%60;return EN?(m?`${m}m ${s}s`:`${s}s`):(m?`${m}분 ${s}초`:`${s}초`)};

  // ── 기록 카드 그리기 (리갈패드 바탕, 사건마다 같은 틀) ──
  async function draw(){
    const r=rec(),W=1080,c=document.createElement('canvas');c.width=c.height=W;const g=c.getContext('2d');
    try{await Promise.all(['64px LevelUp','64px HEEJOY','40px "Kkakdugi Drafting"'].map(f=>document.fonts.load(f)))}catch{}
    const mono='"Kkakdugi Drafting",monospace';
    g.fillStyle='#fbf3b8';g.fillRect(0,0,W,W);
    g.fillStyle='#9fb6d8';for(let y=150;y<W;y+=58)g.fillRect(0,y,W,2);
    g.fillStyle='#d9534f';g.fillRect(118,0,3,W);g.fillRect(126,0,3,W);
    g.fillStyle='#6e1f2b';g.fillRect(0,0,W,58);
    g.fillStyle='#fbf3b8';g.font=`26px ${mono}`;g.fillText('HIDDEN NOTE',150,39);
    g.fillStyle='#6e1f2b';g.font=`34px ${mono}`;g.fillText(`NOTE ${NUM}`,150,135);
    g.fillStyle='#2a2422';let fs=96;g.font=`${fs}px LevelUp,serif`;while(g.measureText(TITLE).width>W-210&&fs>48){fs-=4;g.font=`${fs}px LevelUp,serif`}
    g.fillText(TITLE,150,255);
    g.font=`36px ${mono}`;g.fillStyle='#5a5046';g.fillText(T.time,150,400);if(r.hints>=0)g.fillText(T.hints,150,560);
    g.font='110px HEEJOY,cursive';g.fillStyle='#1b3a8a';g.fillText(r.ms?fmt(r.ms):'—',150,500);
    if(r.hints>=0)g.fillText(r.hints===0?T.none:String(r.hints),150,660);
    // 도장
    g.save();g.translate(800,560);g.rotate(-.14);g.strokeStyle=g.fillStyle='#a3312a';g.lineWidth=10;g.strokeRect(-150,-62,300,124);
    g.font=`700 64px ${mono}`;g.textAlign='center';g.fillText(r.ok?T.done:T.open,0,22);g.restore();
    g.font='64px HEEJOY,cursive';g.fillStyle='#2a2422';g.fillText(T.tease,150,820);
    g.font=`30px ${mono}`;g.fillStyle='#5a5046';g.fillText('ossonida.github.io/clues',150,1010);
    return new Promise(res=>c.toBlob(b=>res({blob:b,r}),'image/png'));
  }
  async function copy(s){try{await navigator.clipboard.writeText(s);return true}catch{return false}}
  async function shareCard(){
    const {blob,r}=await draw();
    const text=T.line(r.ms?fmt(r.ms):'',T.hl(r.hints)).replace('  ',' ')+' '+URL_;
    const file=new File([blob],`hiddennote-${NUM}.png`,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      try{await navigator.share({files:[file],text});return ''}catch(e){if(e&&e.name==='AbortError')return '';}
    }
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    await copy(text);return T.saved;
  }
  async function shareLink(){
    if(navigator.share){try{await navigator.share({title:document.title,text:T.friend,url:URL_});return ''}catch(e){if(e&&e.name==='AbortError')return ''}}
    return (await copy(T.friend+' '+URL_))?T.copied:T.fail;
  }

  const st=document.createElement('style');st.textContent=`.hnsh{margin:10px 0 6px;max-width:560px;color:#2a2422}
.hnsh p{margin:0 0 6px;font-weight:bold}
.hnsh .row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.hnsh button{font:inherit;cursor:pointer;border:2px solid #3a322c;background:#fffdf4;color:#2a2422;border-radius:4px;padding:6px 10px}
.hnsh button.main{background:#3a322c;color:#fffdf4}
.hnsh small{color:#5a5046}`;document.head.appendChild(st);

  function mount(){
    const again=document.getElementById('again');if(!again)return;
    const row=again.parentElement;if(!row||row.parentElement.querySelector(':scope>.hnsh'))return;
    const box=document.createElement('section');box.className='hnsh';box.setAttribute('aria-label',T.h);
    box.innerHTML=`<p>${T.h}</p><div class="row"><button type="button" class="main" data-sh="card">${T.card}</button><button type="button" data-sh="link">${T.link}</button><small role="status"></small></div>`;
    row.parentElement.insertBefore(box,row);
    box.addEventListener('click',async e=>{const b=e.target.closest('[data-sh]');if(!b||b.disabled)return;
      const msg=box.querySelector('small');b.disabled=true;msg.textContent='';
      try{msg.textContent=await (b.dataset.sh==='card'?shareCard():shareLink())}catch{msg.textContent=T.fail}
      b.disabled=false});
  }
  new MutationObserver(mount).observe(document.body||document.documentElement,{childList:true,subtree:true});
  mount();
})();
