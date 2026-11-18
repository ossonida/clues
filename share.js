// 기록 공유: 결말 화면(#again 줄 위, 한 줄 피드백 아래)에 「기록 카드 공유」「친구에게 링크 보내기」를 붙인다.
// - feedback.js가 이 파일을 불러온다. 노트 코드는 건드리지 않는다.
// - 기록은 hn.clear.noteNN({ok,best,last}), 힌트 수는 #hintCount. 줄거리·정답은 카드에 넣지 않는다.
// - 기록 카드는 캔버스로 그린 1080×1080 PNG. 휴대폰은 공유 창, 안 되면 이미지 저장 + 문구 복사.
(()=>{
  const NOTE=document.documentElement.dataset.note;
  if(!NOTE||!/^note\d\d$/.test(NOTE))return;
  const EN=window.HN_LANG==='en';
  const NUM=NOTE.slice(4);
  const URL_=`https://clues-kappa.vercel.app/notes/${NUM}/${EN?'?lang=en':''}`;
  const TITLE=(document.title.split(' | ')[0]||'').replace(/^Note\s*\d+\s*·\s*/i,'').trim();
  const T=EN?{
    h:'Share your record',card:'Share record card',link:'Send to a friend',saved:'Image saved and text copied.',savedOnly:'Image saved.',manual:'Copy the text below and send it.',textOnly:'This browser blocks the card image, so the text was copied instead.',hold:'Text copied. Press and hold the card below to save it.',holdOnly:'Press and hold the card below to save it.',copied:'Link copied.',
    fail:'Could not share. Please try again.',time:'Time',hints:'Hints',none:'none',done:'ESCAPED',open:'UNSOLVED',
    tease:'Can you beat it?',line:(t,h)=>`I finished Hidden Note ${NUM} "${TITLE}" in ${t}${h}. Your turn?`,hl:h=>h<0?'':h===0?' with no hints':` with ${h} hint${h>1?'s':''}`,
    friend:`A free mystery escape game in your browser: Hidden Note ${NUM} "${TITLE}". Keep a scrap of paper handy.`
  }:{
    h:'기록 공유',card:'기록 카드 공유',link:'친구에게 링크 보내기',saved:'이미지를 저장하고 문구를 복사했어요.',savedOnly:'이미지를 저장했어요.',manual:'아래 문구를 복사해서 보내 주세요.',textOnly:'이 브라우저는 카드 그림을 막아서, 기록 문구만 복사했어요.',hold:'문구를 복사했어요. 아래 카드를 길게 눌러 저장하세요.',holdOnly:'아래 카드를 길게 눌러 저장하세요.',copied:'링크를 복사했어요.',
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
  // 메인 사건 노트 카드의 현장 사진(svg)과 설명을 가져온다. 사진은 메인 한 군데에만 두고 여기서 빌려 쓴다
  async function photo(){
    try{const html=await (await fetch('../../index.html')).text();
      const d=new DOMParser().parseFromString(html,'text/html'),p=d.querySelector(`a.note[href="notes/${NUM}/"] .photo`);if(!p)return null;
      const sv=p.querySelector('svg:not(.clip)'),cap=p.querySelector('.cap');if(!sv)return null;
      sv.setAttribute('xmlns','http://www.w3.org/2000/svg');const vb=(sv.getAttribute('viewBox')||'0 0 320 240').split(/\s+/).map(Number);
      sv.setAttribute('width',vb[2]*3);sv.setAttribute('height',vb[3]*3);
      const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(sv));
      await img.decode();return {img,ratio:vb[3]/vb[2],cap:cap?(EN&&cap.dataset.en||cap.textContent):''}}catch{return null}}
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
    // 현장 사진: 오른쪽 위 폴라로이드 + 클립
    const ph=await photo();
    if(ph){const pw=330,phh=Math.round(pw*ph.ratio),fw=pw+28,fh=phh+80;
      g.save();g.translate(860,250);g.rotate(.07);
      g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=24;g.shadowOffsetY=10;g.fillStyle='#fff';g.fillRect(-fw/2,-fh/2,fw,fh);g.shadowColor='transparent';
      g.drawImage(ph.img,-pw/2,-fh/2+14,pw,phh);
      g.fillStyle='#333';g.font='30px HEEJOY,cursive';g.fillText(ph.cap,-pw/2+4,fh/2-22,pw-8);
      g.strokeStyle='#8d969c';g.lineWidth=6;g.lineCap='round';g.beginPath();
      const cx=-fw/2+60,cy=-fh/2-40,s=3;g.moveTo(cx+11*s,cy+14*s);g.lineTo(cx+11*s,cy+38*s);g.arc(cx+7*s,cy+38*s,4*s,0,Math.PI);g.lineTo(cx+3*s,cy+8*s);g.arc(cx+8.5*s,cy+8*s,5.5*s,Math.PI,0);g.lineTo(cx+14*s,cy+34*s);g.arc(cx+11.5*s,cy+34*s,2.5*s,0,Math.PI);g.lineTo(cx+9*s,cy+14*s);g.stroke();
      g.restore()}
    const maxW=ph?W-150-420:W-210;
    g.fillStyle='#2a2422';let fs=96;g.font=`${fs}px LevelUp,serif`;while(g.measureText(TITLE).width>maxW&&fs>(ph&&TITLE.includes(" ")?88:48)){fs-=4;g.font=`${fs}px LevelUp,serif`}
    // 사진이 있으면 제목이 길 때 두 줄로
    const words=TITLE.split(' ');
    if(ph&&g.measureText(TITLE).width>maxW&&words.length>1){fs=88;g.font=`${fs}px LevelUp,serif`;const k=Math.ceil(words.length/2);g.fillText(words.slice(0,k).join(' '),150,240);g.fillText(words.slice(k).join(' '),150,335)}
    else g.fillText(TITLE,150,255);
    g.font=`36px ${mono}`;g.fillStyle='#5a5046';g.fillText(T.time,150,400);if(r.hints>=0)g.fillText(T.hints,150,560);
    g.font='110px HEEJOY,cursive';g.fillStyle='#1b3a8a';g.fillText(r.ms?fmt(r.ms):'—',150,500);
    if(r.hints>=0)g.fillText(r.hints===0?T.none:String(r.hints),150,660);
    // 도장
    g.save();g.translate(800,560);g.rotate(-.14);g.strokeStyle=g.fillStyle='#a3312a';g.lineWidth=10;g.strokeRect(-150,-62,300,124);
    g.font=`700 64px ${mono}`;g.textAlign='center';g.fillText(r.ok?T.done:T.open,0,22);g.restore();
    g.font='64px HEEJOY,cursive';g.fillStyle='#2a2422';g.fillText(T.tease,150,820);
    g.font=`30px ${mono}`;g.fillStyle='#5a5046';g.fillText('clues-kappa.vercel.app',150,1010);
    return new Promise(res=>{const done=b=>{if(b&&b.size){res({blob:b,r});return}
      try{const u=c.toDataURL('image/png'),bin=atob(u.split(',')[1]),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);res({blob:new Blob([a],{type:'image/png'}),r})}catch{res({blob:null,r})}};
      try{c.toBlob(done,'image/png')}catch{done(null)}});
  }
  async function copy(s){try{await navigator.clipboard.writeText(s);return true}catch{}
    try{const a=document.createElement('textarea');a.value=s;a.setAttribute('readonly','');a.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();return ok}catch{return false}}
  function showText(box,s){let ta=box.querySelector('textarea');if(!ta){ta=document.createElement('textarea');ta.readOnly=true;box.appendChild(ta)}ta.value=s;ta.focus();ta.select()}
  // 카드는 결말이 뜰 때 미리 그려 둔다. 누른 뒤에 그리면 휴대폰이 "사용자가 누른 동작"으로 안 쳐서 공유 창을 막는다
  let READY=null;
  async function prep(){const {blob,r}=await draw();
    READY={blob,file:blob?new File([blob],`hiddennote-${NUM}.png`,{type:'image/png'}):null,text:T.line(r.ms?fmt(r.ms):'',T.hl(r.hints)).replace('  ',' ')+' '+URL_}}
  function showImg(box){if(!READY.blob)return false;let im=box.querySelector('img');if(!im){im=document.createElement('img');im.alt=T.card;box.appendChild(im)}
    if(im.src)URL.revokeObjectURL(im.src);im.src=URL.createObjectURL(READY.blob);return true}
  async function shareCard(box){
    if(!READY)await prep();
    const {file,text}=READY;let canFile=false;try{canFile=!!(file&&navigator.canShare&&navigator.canShare({files:[file]}))}catch{}
    if(canFile){try{await navigator.share({files:[file],text});return ''}catch(e){if(e&&e.name==='AbortError')return ''}}
    // 그림 공유가 막히면 문구+주소만이라도 공유 창으로
    if(navigator.share){try{await navigator.share({text});return ''}catch(e){if(e&&e.name==='AbortError')return ''}}
    // 공유 창이 안 되는 곳(카톡 안 브라우저, PC 등): 카드를 화면에 띄우고 문구 복사. PC는 파일로도 저장
    const shown=showImg(box);const ok=await copy(text);
    if(!ok)showText(box,text);
    if(!shown)return ok?T.textOnly:T.manual;
    if(!matchMedia('(pointer:coarse)').matches){const a=document.createElement('a');a.href=box.querySelector('img').src;a.download=file.name;document.body.appendChild(a);a.click();a.remove();return ok?T.saved:T.savedOnly+' '+T.manual}
    return ok?T.hold:T.holdOnly+' '+T.manual;
  }
  async function shareLink(box){
    if(navigator.share){try{await navigator.share({title:document.title,text:T.friend,url:URL_});return ''}catch(e){if(e&&e.name==='AbortError')return ''}}
    const s=T.friend+' '+URL_;if(await copy(s))return T.copied;showText(box,s);return T.manual;
  }

  const st=document.createElement('style');st.textContent=`.hnsh{margin:10px 0 6px;max-width:560px;color:#2a2422}
.hnsh p{margin:0 0 6px;font-weight:bold}
.hnsh .row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.hnsh button{font:inherit;cursor:pointer;border:2px solid #3a322c;background:#fffdf4;color:#2a2422;border-radius:4px;padding:6px 10px}
.hnsh button.main{background:#3a322c;color:#fffdf4}
.hnsh small{color:#5a5046}
.hnsh textarea{display:block;box-sizing:border-box;width:100%;min-height:70px;margin-top:8px;font:inherit;font-size:14px;border:1px solid #8a8170;border-radius:4px;padding:6px 8px;background:#fff;color:#2a2422}
.hnsh img{display:block;width:100%;max-width:320px;margin-top:8px;border:1px solid #8a8170}`;document.head.appendChild(st);

  function mount(){
    const again=document.getElementById('again');if(!again)return;
    const row=again.parentElement;if(!row||row.parentElement.querySelector(':scope>.hnsh'))return;
    const box=document.createElement('section');box.className='hnsh';box.setAttribute('aria-label',T.h);
    box.innerHTML=`<p>${T.h}</p><div class="row"><button type="button" class="main" data-sh="card">${T.card}</button><button type="button" data-sh="link">${T.link}</button><small role="status"></small></div>`;
    row.parentElement.insertBefore(box,row);READY=null;prep().catch(()=>{});
    box.addEventListener('click',async e=>{const b=e.target.closest('[data-sh]');if(!b||b.disabled)return;
      const msg=box.querySelector('small');b.disabled=true;msg.textContent='';
      try{msg.textContent=await (b.dataset.sh==='card'?shareCard(box):shareLink(box))}catch{msg.textContent=T.fail}
      b.disabled=false});
  }
  new MutationObserver(mount).observe(document.body||document.documentElement,{childList:true,subtree:true});
  mount();
})();
