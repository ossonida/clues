// 기록 공유 미리보기 이미지: og/rec/noteNN-G.png 바탕의 RECORD 칸에 걸린 시간·힌트·틀린 암호를 찍어 PNG로 돌려준다.
// /api/og?n=02&g=0&t=132&h=0&w=0   (의존성 없음: Node 내장 zlib + api/_png.js)
const fs=require('fs'),path=require('path'),zlib=require('zlib'),P=require('./_png.js');
const DIR=path.join(process.cwd(),'og','rec');
const ROWS=[180,300,420],RX=1112,DY=-6; // og/rec.html의 .r 줄 위치와 맞춘다
const cache={};
function load(file){if(cache[file])return cache[file];const b=fs.readFileSync(path.join(DIR,file)),p=P.parse(b),raw=zlib.inflateSync(Buffer.from(p.idat));return cache[file]={w:p.w,h:p.h,px:P.unfilter(raw,p.w,p.h,p.bpp)}}
const int=v=>/^\d{1,6}$/.test(v||'')?+v:-1;
module.exports=(req,res)=>{
  try{
    const q=new URL(req.url,'https://x').searchParams;
    const n=/^0[1-9]$/.test(q.get('n')||'')?q.get('n'):'',g=/^[0-3]$/.test(q.get('g')||'')?q.get('g'):'0';
    let file=`note${n}-${g}.png`;if(!n||!fs.existsSync(path.join(DIR,file)))file=`note${n||'02'}-0.png`;
    const b=load(file),base={w:b.w,h:b.h,px:new Uint8Array(b.px)},gl=load('glyphs.png'),bd=gl.bd||(gl.bd=P.glyphBounds(gl));
    const t=int(q.get('t')),h=int(q.get('h')),w=int(q.get('w'));
    const clock=s=>s>=3600?`${Math.floor(s/3600)}:${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`:`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
    const vals=[t>=0?clock(t):'-',h>=0?h+'개':'-',w>=0?w+'번':''];
    if(w<0)for(let y=414;y<526;y++)for(let x=752;x<1126;x++){const d=(y*base.w+x)*3;base.px[d]=255;base.px[d+1]=253;base.px[d+2]=244} // 틀린 암호를 안 세는 노트는 셋째 줄을 지운다
    vals.forEach((v,i)=>v&&P.stamp(base,gl,bd,v,RX,ROWS[i]+DY));
    const png=P.build(base.w,base.h,zlib.deflateSync(Buffer.from(P.toRaw(base.px,base.w,base.h)),{level:6}));
    res.statusCode=200;res.setHeader('Content-Type','image/png');res.setHeader('Cache-Control','public, max-age=31536000, immutable');res.end(Buffer.from(png));
  }catch(e){res.statusCode=302;res.setHeader('Location','/og/main.png');res.end()}
};
