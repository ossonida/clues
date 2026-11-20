// 기록 공유 미리보기 이미지: og/rec/noteNN-G.png 바탕의 RECORD 칸에 걸린 시간·힌트·틀린 암호를 찍어 PNG로 돌려준다.
// /api/og?n=02&g=0&t=132&h=0&w=0   (의존성 없음: Node 내장 zlib + api/_png.js)
const fs=require('fs'),path=require('path'),zlib=require('zlib'),P=require('./_png.js');
const DIR=path.join(process.cwd(),'og','rec');
const cache={};
function load(file){if(cache[file])return cache[file];const b=fs.readFileSync(path.join(DIR,file)),p=P.parse(b),raw=zlib.inflateSync(Buffer.from(p.idat));return cache[file]={w:p.w,h:p.h,px:P.unfilter(raw,p.w,p.h,p.bpp)}}
const int=v=>/^\d{1,6}$/.test(v||'')?+v:-1;
module.exports=(req,res)=>{
  try{
    const q=new URL(req.url,'https://x').searchParams;
    const n=/^0[1-9]$/.test(q.get('n')||'')?q.get('n'):'',g=/^[0-3]$/.test(q.get('g')||'')?q.get('g'):'0';
    let file=`note${n}-${g}.png`;if(!n||!fs.existsSync(path.join(DIR,file)))file=`note${n||'02'}-0.png`;
    const b=load(file),base={w:b.w,h:b.h,px:new Uint8Array(b.px)},gl=load('glyphs.png'),bd=gl.bd||(gl.bd=[P.glyphBounds(gl,0),P.glyphBounds(gl,1)]);
    const t=int(q.get('t')),h=int(q.get('h')),w=int(q.get('w'));
    P.drawRecord(P,base,gl,bd,t,h,w);
    const png=P.build(base.w,base.h,zlib.deflateSync(Buffer.from(P.toRaw(base.px,base.w,base.h)),{level:6}));
    res.statusCode=200;res.setHeader('Content-Type','image/png');res.setHeader('Cache-Control','public, max-age=31536000, immutable');res.end(Buffer.from(png));
  }catch(e){res.statusCode=302;res.setHeader('Location','/og/main.png');res.end()}
};
