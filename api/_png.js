// 아주 작은 PNG 도구 (의존성 없음, 8비트 RGB/RGBA, 인터레이스 없음만). 압축은 호출하는 쪽이 zlib을 넘긴다.
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){let c=0xffffffff;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return (c^0xffffffff)>>>0}
const u32=(b,o)=>((b[o]<<24)|(b[o+1]<<16)|(b[o+2]<<8)|b[o+3])>>>0;

// PNG 바이트 → {w,h,bpp,idat(압축된 것)}
function parse(buf){
  let o=8,w=0,h=0,bpp=0;const parts=[];
  while(o<buf.length){const len=u32(buf,o),type=String.fromCharCode(buf[o+4],buf[o+5],buf[o+6],buf[o+7]),d=buf.subarray(o+8,o+8+len);
    if(type==='IHDR'){w=u32(d,0);h=u32(d,4);if(d[8]!==8||d[12]!==0)throw new Error('png: 8bit, no interlace only');bpp=d[9]===6?4:d[9]===2?3:0;if(!bpp)throw new Error('png: RGB/RGBA only')}
    else if(type==='IDAT')parts.push(d);else if(type==='IEND')break;
    o+=12+len}
  let n=0;parts.forEach(p=>n+=p.length);const idat=new Uint8Array(n);n=0;parts.forEach(p=>{idat.set(p,n);n+=p.length});
  return {w,h,bpp,idat};
}
// 풀린 스캔라인(필터 바이트 포함) → RGB 픽셀 (3바이트씩)
function unfilter(raw,w,h,bpp){
  const stride=w*bpp,out=new Uint8Array(w*h*3),cur=new Uint8Array(stride),prev=new Uint8Array(stride);
  for(let y=0;y<h;y++){const f=raw[y*(stride+1)],s=raw.subarray(y*(stride+1)+1,(y+1)*(stride+1));
    for(let x=0;x<stride;x++){const a=x>=bpp?cur[x-bpp]:0,b=prev[x],c=x>=bpp?prev[x-bpp]:0;let v=s[x];
      if(f===1)v+=a;else if(f===2)v+=b;else if(f===3)v+=(a+b)>>1;else if(f===4){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);v+=pa<=pb&&pa<=pc?a:pb<=pc?b:c}
      cur[x]=v&255}
    for(let x=0;x<w;x++){const i=(y*w+x)*3;out[i]=cur[x*bpp];out[i+1]=cur[x*bpp+1];out[i+2]=cur[x*bpp+2]}
    prev.set(cur)}
  return out;
}
// RGB 픽셀 → 필터 0 스캔라인
function toRaw(px,w,h){const s=w*3,raw=new Uint8Array(h*(s+1));for(let y=0;y<h;y++){raw[y*(s+1)]=0;raw.set(px.subarray(y*s,(y+1)*s),y*(s+1)+1)}return raw}
function chunk(type,data){const b=new Uint8Array(12+data.length),t=[...type].map(c=>c.charCodeAt(0));
  b[0]=data.length>>>24;b[1]=data.length>>>16&255;b[2]=data.length>>>8&255;b[3]=data.length&255;b.set(t,4);b.set(data,8);
  const c=crc32(b.subarray(4,8+data.length));b[8+data.length]=c>>>24;b[9+data.length]=c>>>16&255;b[10+data.length]=c>>>8&255;b[11+data.length]=c&255;return b}
// 압축된 IDAT → PNG 바이트 (RGB)
function build(w,h,zdata){
  const ih=new Uint8Array(13);ih[0]=w>>>24;ih[1]=w>>>16&255;ih[2]=w>>>8&255;ih[3]=w&255;ih[4]=h>>>24;ih[5]=h>>>16&255;ih[6]=h>>>8&255;ih[7]=h&255;ih[8]=8;ih[9]=2;
  const parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zdata),chunk('IEND',new Uint8Array(0))];
  let n=0;parts.forEach(p=>n+=p.length);const out=new Uint8Array(n);n=0;parts.forEach(p=>{out.set(p,n);n+=p.length});return out;
}

// 글자판: 칸 80×100, 칸마다 잉크가 있는 가로 범위를 찾아 둔다
const GLYPHS='0123456789:-개번',CW=80,CH=100;
function glyphBounds(g){const b={};[...GLYPHS].forEach((ch,i)=>{let l=CW,r=-1;
  for(let x=0;x<CW;x++)for(let y=0;y<CH;y++){const p=(y*g.w+i*CW+x)*3;if(g.px[p]+g.px[p+1]+g.px[p+2]<600){if(x<l)l=x;if(x>r)r=x;break}}
  b[ch]=r<0?{l:0,r:CW/4}:{l,r}});return b}
// 바탕 위 (오른쪽 끝 rx, 위 ty)에 글자를 오른쪽 맞춤으로 찍는다
function stamp(base,g,bounds,text,rx,ty,gap=4){
  const cs=[...text].filter(c=>bounds[c]);let wsum=0;cs.forEach(c=>wsum+=bounds[c].r-bounds[c].l+1+gap);
  let x=rx-wsum;
  for(const c of cs){const {l,r}=bounds[c],gi=GLYPHS.indexOf(c);
    for(let yy=0;yy<CH;yy++)for(let xx=l;xx<=r;xx++){const s=(yy*g.w+gi*CW+xx)*3,dx=x+xx-l,dy=ty+yy;if(dx<0||dy<0||dx>=base.w||dy>=base.h)continue;
      const d=(dy*base.w+dx)*3,k=(g.px[s]+g.px[s+1]+g.px[s+2])/765; // 밝을수록 바탕 그대로
      for(let j=0;j<3;j++)base.px[d+j]=Math.round(base.px[d+j]*k+g.px[s+j]*(1-k))}
    x+=r-l+1+gap}
}
module.exports={parse,unfilter,toRaw,build,glyphBounds,stamp,GLYPHS};
