// 기록 공유 링크: 메신저 미리보기(og)에 친구 기록을 넣고, 사람은 노트로 보낸다.
// /api/r?n=02&r=명예 문예부원&t=132&h=0&w=0  →  /notes/02/?r=…&t=…&h=…&w=…
// 의존성 없음. 이미지는 og/rec/noteNN-I.png (등급별로 미리 찍어 둔 것), 모르는 등급은 og/noteNN.png.
const BASE='https://clues-kappa.vercel.app';
const NOTES={
  '01':{t:'FUN보드 사건 파일',g:['완전 해결','거의 해결','범인은 맞혔지만…','미해결']},
  '02':{t:'문예부 교환일기',g:['명예 문예부원','문예부원','견학생']},
  '03':{t:'은하분교 숙직 일지',g:['숙직 교사','순찰 대원','비 피한 손님']},
  '04':{t:'깡총이 연습장',g:['짝꿍','낙서 친구','전학생']},
  '05':{t:'폐극장 2번 출구',g:['영사기사','단골 관객','귀신 구경꾼']},
  '06':{t:'구름재',g:['구름재 관측원','야간 관측원','견습 관측원']}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const int=v=>/^\d{1,6}$/.test(v||'')?+v:-1;
module.exports=(req,res)=>{
  const q=new URL(req.url,BASE).searchParams;
  const n=q.get('n'),note=NOTES[n];
  if(!note){res.statusCode=302;res.setHeader('Location',BASE+'/');return res.end()}
  const r=(q.get('r')||'').slice(0,20),t=int(q.get('t')),h=int(q.get('h')),w=int(q.get('w')),en=q.get('lang')==='en';
  const gi=note.g.indexOf(r);
  const img=`${BASE}/og/${gi>=0?`rec/note${n}-${gi}`:`note${n}`}.png`;
  const p=new URLSearchParams();if(en)p.set('lang','en');if(r)p.set('r',r);[['t',t],['h',h],['w',w]].forEach(([k,v])=>{if(v>=0)p.set(k,v)});
  const to=`${BASE}/notes/${n}/?${p}`;
  const stats=[t>=0&&`걸린 시간 ${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`,h>=0&&`힌트 ${h}장`,w>=0&&`틀린 암호 ${w}번`].filter(Boolean).join(' · ');
  const title=`히든노트 ${n} 「${note.t}」${r?` · ${r}`:''}`,desc=`${stats?stats+' · ':''}너도 해 볼래?`;
  res.statusCode=200;
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=86400');
  res.end(`<!doctype html><html lang="ko"><head><meta charset="utf-8">
<title>${esc(title)}</title><meta name="robots" content="noindex">
<meta property="og:type" content="website"><meta property="og:site_name" content="히든노트">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(img)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${esc(to)}"><meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=${esc(to)}"><link rel="canonical" href="${esc(to)}">
</head><body><script>location.replace(${JSON.stringify(to)})</script><a href="${esc(to)}">${esc(title)}</a></body></html>`);
};
