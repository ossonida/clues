# Note 05 소리 작업 명세 (인계용)

이 문서만 보고 Note 05에 소리를 넣을 수 있게 정리했다. 다른 AI(GPT, Codex 등)나 사람이 이어서 작업해도 되도록, **무엇을 바꾸고 무엇을 건드리지 않는지**를 먼저 적는다. 막히면 추측해서 고치지 말고 여기 적힌 범위 안에서만 움직인다.

- 정한 날: 2026-11-17 (사용자 결정: BGM 없이 장소의 소리만, 놀래키는 소리 없음)
- 대상: `notes/05/index.html` 하나 (+ 이 문서, `notes/05/PLAN.md` 한 줄, 끝나면 `AGENTS.md` 표 한 칸)
- 현재 상태: 2차 수정 반영 (2026-11-18). 퍼즐·이야기는 1~8장 + 문단속 결말까지 완성·검증된 상태

## 1. 절대 하지 말 것

1. ~~음악(BGM)을 넣지 않는다.~~ → 2026-11-18 사용자 결정으로 바뀜: **공포 미스터리 분위기의 잔잔한 합성 배경 음악을 넣는다** (7절). 귀에 꽂히는 멜로디·박자·드럼은 여전히 없음.
2. **놀래키는 소리를 넣지 않는다.** 발자국, 등신대(7장 입간판), 호출등 깜빡임, 영사실 창 불 켜짐 같은 "이상한 것" 장면에 쾅·비명·속삭임·심장 소리 등을 붙이지 않는다. 공포는 화면과 글(어둠, 문장)로만 준다.
3. **소리 파일·외부 주소를 쓰지 않는다.** mp3/ogg/wav 파일 추가, CDN, 외부 라이브러리(Howler, Tone.js 등) 금지. 모든 소리는 Web Audio API로 코드 안에서 합성한다. (사건 페이지 = 단일 HTML 규칙)
4. **퍼즐·이야기·저장 구조를 바꾸지 않는다.** 아래는 손대지 않는다.
   - `LOG`, `HINTS`, `PULL`, `TAP`, `DEVS`, `SC`(장면 그림), 정답, 토스트 문구, 결말 문구
   - `fresh()`, `S`의 구조, `SAVE_KEY`(`hn.note05.v4`), `save()`, `clearP()`, `record()`
   - 기존 `ACT.*` 함수의 몸통 (감싸기만 한다, 아래 4절)
   - 다른 노트(`notes/01`~`04`), 메인 `index.html`(Note 05는 메인에서 계속 숨김), `lang.js`, `analytics.js`, `fonts/`
5. **사용자가 누르기 전에는 소리를 내지 않는다.** 휴대폰 브라우저는 막는다. 첫 클릭/터치에서 `AudioContext`를 만들거나 `resume()`한다.
6. 정리·리팩터링·포맷 변경 금지. 줄바꿈은 기존 그대로(CRLF), 파일은 UTF-8(BOM 없음).

## 2. 무엇을 넣나

### 바탕 소리 (장마다 아주 작게, 계속 깔림)

| 화면 (`S.v`) | 소리 | 합성 방법 (예시, 비슷하면 됨) |
| --- | --- | --- |
| `cover` | 무음 | 첫 사용자 조작 전과 표지에서는 BGM을 시작하지 않음 |
| `p1`~`p4` | 합성 BGM | D 단조 드론·패드·드문 음. `p3`·`p4`에는 2~6초 물방울을 더함 |
| `p5`~`p8` | 합성 BGM + 긴장 층 | E♭3의 옅은 불협을 더함. `p6`·`p7`은 패드를 더 답답하게 필터링 |
| `map` | 직전 소리 유지 | |
| `end` | 3초에 걸쳐 모두 줄여서 무음 (결말: "비는 그쳐 있었다") | |

- BGM은 첫 사용자 조작 뒤 3초에 걸쳐 들어오고, 장이 바뀌어도 끊지 않는다. 장마다 층과 필터만 바꾼다.
- `S.w[5].run`, `power()`, `S.w[8].out`처럼 **상태에 따라 바뀌므로** 화면이 다시 그려질 때마다 "지금 깔려야 할 소리"를 계산해서 맞춘다 (4절의 `SND.after()`).

### 효과음 (사용자가 조작했을 때만, 짧게, 최대 gain 0.3)

| 이름 | 언제 | 소리 |
| --- | --- | --- |
| `tick` | 다이얼 숫자가 바뀜 | 아주 짧은 딸깍 (노이즈 15ms, highpass 3kHz) |
| `rattle` | 자물쇠 당겼는데 안 열림 | 둔한 철컥 두 번 |
| `unlock` | 자물쇠·열쇠함·빗장이 열림 | 딸깍 + 짧은 금속 울림 |
| `door` | 열쇠로 문이 열림 (3·4·5장 `door`) | 걸쇠 딸깍 → 경첩 삐걱 → 문틀에 닿는 낮은 쿵 |
| `shutter` | 1장 셔터가 올라감 | bandpass 1200Hz 노이즈를 5~8Hz로 끊는 0.9초 금속 셔터 소리 |
| `breaker` | 차단기 하나 올리거나 내림 | 묵직한 철컥 |
| `trip` | 차단기가 한꺼번에 떨어짐 | 철컥 여러 번 + 바탕 소리 잠깐 끊김 |
| `projStart` / `projStop` | 영사기 레버 올림/내림 | 모터가 올라가는/내려가는 소리 1.5초 |
| `switch` | 6장 호출등 스위치 내림 | 작은 딸깍 |
| `rope` | 7장 막 줄을 당김 | 천 스치는 노이즈 0.6초 |
| `splice` | 8장 필름 조각을 칸에 붙임 | 딸깍 + 테이프 |
| `crank` | 8장 뷰어 손잡이 돌리기 켬 | 돌아가는 동안 작은 "따르르" 반복, 끄면 멈춤 |
| `doorOpen` | 8장 전기 잠금 열고 문이 밀림 | 걸쇠 딸깍 → 철 울림 → 무거운 경첩 삐걱. 끝에 BGM을 잠깐 키웠다가 되돌림 |
| `latch` | 결말로 넘어갈 때 (걸쇠 걸기) | 걸쇠 철컥 한 번, 그 뒤 바탕 소리 페이드아웃 |

발자국·입간판·호출등 깜빡임·영사실 창 불 켜짐에는 **아무 소리도 붙이지 않는다** (1절 2번).

## 3. 켜고 끄기

- 머리말 `<button class="btn" id="btnHint">힌트</button>` **바로 앞에** 버튼 하나를 추가한다:
  `<button class="btn" id="btnSnd" aria-pressed="true" title="소리">🔈</button>` (끄면 🔇, `aria-pressed="false"`)
- 선택은 `localStorage`의 **`hn.sound`** 에 `'on'`/`'off'`로 저장한다. 기본값 `'on'`. 저장 구조 `S`에 넣지 않는다 (그러면 저장 버전을 올려야 하므로).
- localStorage 읽기/쓰기는 try/catch로 감싼다.
- 끈 상태에서는 `AudioContext`를 만들지 않거나 마스터 gain을 0으로 둔다.

## 4. 코드를 붙이는 자리 (이 세 군데만 기존 코드를 건드린다)

새 코드는 모두 **한 덩어리**로, `function take(id){` 바로 위에 `// ── 소리 ──` 주석과 함께 넣는다. 전역 객체 하나 `SND`만 만든다.

```js
// ── 소리 ── (설계: notes/05/SOUND.md) 음악·놀래키는 소리 없음, 장소의 소리만
const SND={ ctx:null, on:true, log:[], prev:null, /* ... */
  init(){ /* 첫 사용자 조작에서 AudioContext 생성·resume, 마스터 gain */ },
  fx(name){ /* 2절 효과음. 디버그용으로 this.log.push(name) */ },
  amb(){ /* 2절 표에 따라 지금 깔릴 바탕 소리 key 계산, 바뀌면 크로스페이드 */ },
  after(){ /* render 끝에서 불림: 상태 비교로 효과음 + amb() */ },
};
```

1. **`render()` 마지막 줄** `renderBag();bindScene();bindDev();` 뒤에 `SND.after();` 한 줄만 추가한다.
2. **머리말 버튼** (3절). 클릭 처리는 `SND` 덩어리 안에서 `document.getElementById('btnSnd').onclick=...`로 단다.
3. **첫 조작에서 켜기**: `SND` 덩어리 안에서 `document.addEventListener('pointerdown',()=>SND.init(),{once:true})` 와 `keydown` 같은 방식. 표지 `#start` 코드는 바꾸지 않는다.

### 효과음은 "상태 비교"로 낸다 (퍼즐 함수 몸통을 고치지 않기 위해)

`SND.after()`는 매번 아래 값들을 뽑아 `SND.prev`와 비교하고, 달라진 것만 소리를 낸다. **처음 한 번(페이지 열 때)은 비교만 저장하고 소리를 내지 않는다.**

| 비교할 값 | 바뀐 방향 | 소리 |
| --- | --- | --- |
| `S.w[n].dial` (n = 1,2,4,8의 배열 문자열) | 아무 변화 | `tick` |
| `S.w[1].open` | false→true | `shutter` |
| `S.w[2].open`, `S.w[4].open`, `S.w[8].open` | false→true | `unlock` |
| `S.w[3].door`, `S.w[4].door`, `S.w[5].door` | false→true | `door` |
| `S.w[3].brk.join('')` | 켜진 개수 변함 / 켜진 게 있다가 전부 0 | `breaker` / `trip` |
| `S.w[5].run` | false→true / true→false | `projStart` / `projStop` |
| `S.w[6].call` | true(또는 undefined)→false | `switch` |
| `S.w[7].pulled.length` | 늘어남 | `rope` |
| `S.w[8].slots.length` | 늘어남 | `splice` |
| `S.w[8].crank` | 켜짐/꺼짐 | `crank` 반복 시작/멈춤 |
| `S.w[8].out` | false→true | `doorOpen` |
| `S.v` | `'p8'`→`'end'` | `latch` 후 바탕 소리 페이드아웃 |

`S.w`가 새로 시작(`fresh()`)되면 값이 줄어드는 쪽으로 바뀌므로 소리를 내지 않는다 (줄어드는 변화는 `brk`, `run`, `crank` 외엔 무시).

**`rattle`만 예외**: 자물쇠가 안 열린 건 상태가 안 바뀌어 비교로 못 잡는다. `SND` 덩어리 안에서 `ACT.pull`을 **감싼다**:

```js
const _pull=ACT.pull;
ACT.pull=b=>{const w=W(),was=w.open;_pull(b);if(W()===w&&!w.open&&!was)SND.fx('rattle')};
```

`ACT.pull` 원래 코드는 고치지 않는다.

## 5. 확인 방법

AGENTS.md "실행·확인"을 따른다. 추가로:

1. 서버: `python -m http.server 8779` (저장소 루트에서). `http://localhost:8779/notes/05/`.
2. 테스트 전 `localStorage.removeItem('hn.note05.v4')`.
3. 콘솔 오류 0. 375px 폭에서 가로 스크롤 없음, 머리말 버튼이 넘치지 않음.
4. **자동 확인**: 아래를 `notes/05/_t.html`로 만들어 열고(헤드리스면 `--dump-dom`), `SND.log`에 순서대로 소리 이름이 찍히는지 본다. 끝나면 `_t.html`을 지운다 (커밋 금지).

```html
<!DOCTYPE html><html><body><pre id="out">running</pre><iframe id="f" src="index.html" style="display:none"></iframe>
<script>
document.getElementById('f').onload=()=>{const w=document.getElementById('f').contentWindow;const E=s=>w.eval(s);const errs=[];w.onerror=m=>errs.push(String(m));
 const s={1:"take('torch');W().dial=[2,1,3,5];refresh();ACT.pull()",
  2:"TAP[2]('drawer',W());take('sheet');TAP[2]('chart',W(),'sheet');W().dial=[8,2,6];ACT.pull();take('keys')",
  3:"TAP[3]('door',W(),'keys');TAP[3]('toolbox',W());take('loupe');[1,4,6].forEach(i=>ACT.brk({dataset:{i:String(i)}}))",
  4:"TAP[4]('door',W(),'keys');W().dial=[3,1,7];ACT.pull();take('reel')",
  5:"TAP[5]('door',W(),'keys');take('film');TAP[5]('reel',W(),'reel');['r0','r1','r2','r3'].map(r=>TAP[5](r,W()));ACT.sw({dataset:{i:'2'}});TAP[5]('lever',W())",
  6:"ACT.seat({dataset:{r:'4',s:'7'}});TAP[6]('bdoor',W(),'skey')",
  7:"['x','o','t','s'].forEach(k=>ACT.rope({dataset:{k}}))"};
 E("S=fresh();S.started=true;S.open=1;save();refresh()");
 for(let i=1;i<=7;i++){E(`S.v='p${i}';refresh()`);E(s[i]);}
 E("S.v='p8';refresh();TAP[8]('splice',W());[0,1,2,3].forEach(i=>ACT.tray({dataset:{i:String(i)}}));ACT.crank();ACT.crank();W().dial=[0,7,1,4];refresh();ACT.pull()");
 E("S.v='p3';refresh();ACT.brk({dataset:{i:'1'}});ACT.brk({dataset:{i:'5'}});S.v='p8';refresh();TAP[8]('strike',W())");
 E("S.v='p5';refresh();TAP[5]('lever',S.w[5]);S.v='p6';refresh();TAP[6]('signal',S.w[6])");
 E("S.v='p3';refresh();[1,2,3,4,5,6,7].forEach(i=>{if(S.w[3].brk[i])ACT.brk({dataset:{i:String(i)}})});S.v='p8';refresh();ACT.leave()");
 document.getElementById('out').textContent='v='+E('S.v')+' done='+E('S.done')+'\nlog='+JSON.stringify(E("typeof SND==='undefined'?null:SND.log"))+'\nerrors='+JSON.stringify(errs)};
</script></body></html>
```

   기대: `v=end done=true`, `errors=[]`, `log`에 `shutter`, `unlock`, `door`, `breaker`, `projStart`, `rope`, `splice`, `crank`, `doorOpen`, `projStop`, `switch`, `latch`가 들어 있음. (헤드리스는 소리가 안 들리지만, 사용자 조작 전이라 `AudioContext`가 없어도 `SND.log`는 쌓이게 만든다.)
   이 스크립트는 소리 없이도 지금 코드에서 `v=end done=true errors=[]`로 끝나는 것이 확인돼 있다. 소리를 넣은 뒤 이게 깨지면 소리 코드가 퍼즐을 건드린 것이다.
5. 마지막으로 사람이 휴대폰에서 직접 들어 본다: 🔇/🔈 전환, 새로고침 후 선택 유지, 소리가 거슬리게 크지 않은지.

## 6. 끝나면

1. `notes/05/PLAN.md` 맨 끝 "플레이 점검 반영" 목록에 한 줄: `- 소리 (날짜): 장소의 소리·조작 효과음만, Web Audio 합성, 🔈 버튼, hn.sound. 설계는 SOUND.md`.
2. `AGENTS.md` 사건 표의 Note 05 행 장르 칸 끝에 `· 소리` 추가. 그 외 AGENTS.md 문구는 바꾸지 않는다.
3. 이 문서 맨 위 "현재 상태"를 "소리 넣음 (날짜)"로 고친다.
4. AGENTS.md "Git" 규칙대로 작업 브랜치 → PR → `main`. 커밋 메시지 예: `Add synthesized ambience and action sounds to Note 05`.

## 7. 2차 수정 (2026-11-18 사용자 피드백)

> "게임 시작하자마자 배경 소리가 소음처럼 거슬린다." "문 여는 소리가 이상하다. 문 여는 소리답게 나와야 하고, 노이즈로 들리는 소리는 공포 미스터리 BGM으로 나오게."

1절 2~6번(놀래키는 소리 금지, 파일·외부 라이브러리 금지, 퍼즐 불변, 누르기 전 무음, 리팩터링 금지)과 4절(붙이는 자리), 5절(확인)은 **그대로** 지킨다. 고칠 곳은 `notes/05/index.html`의 `// ── 소리 ──` 묶음(`const SND={...}`와 바로 아래 줄) 안뿐이다.

### 7-1. 노이즈 바탕 소리 → 합성 BGM으로 바꾸기

- `startAmb()`의 **노이즈로 까는 소리를 모두 뺀다**: 빗소리(lowpass 900), 실내음(lowpass 550), 영사기 노이즈(bandpass 2000), 바람(bandpass 300). 물방울 `drop()`(짧은 사인)만 3·4장에 남겨도 된다.
- 대신 **BGM 한 줄기**를 만든다. 장이 바뀌어도 끊고 다시 시작하지 않고 계속 흐르며, 장에 따라 **결(층)만** 바꾼다.
- 조성: D 단조 쪽, 어둡고 느리게. 예시 값 (비슷하면 됨):

| 층 | 만드는 법 | 크기(gain) |
| --- | --- | --- |
| 바닥 드론 | 사인/삼각파 D2 73.4Hz + A2 110Hz, 서로 0.3Hz쯤 어긋나게 해서 천천히 맥놀이. lowpass 500Hz. 0.05Hz LFO로 크기를 아주 천천히 부풀었다 줄었다 | 0.03 |
| 패드 | 삼각파 D3 146.8 · F3 174.6 · A3 220Hz. lowpass 900Hz. 음마다 8~14초 간격으로 따로 천천히 나타났다 사라짐 (같이 울리지 않게) | 음마다 0.01 |
| 드문 음 | 6~12초에 한 번, D4 293.7 · E♭4 311.1 · F4 349.2 · A4 440 · B♭4 466.2 · C5 523.3 중 하나 (같은 음 연달아 금지). 사인 + 아주 옅은 삼각파, 어택 0.01초, 2.5초에 걸쳐 사라짐. DelayNode 0.35초 + 피드백 0.3 (피드백 줄에 lowpass 1500)로 빈 극장 울림 | 0.02 |
| 긴장 (5장 이후) | `p5`~`p8`에서 E♭3 155.6Hz 사인을 0.008로 아주 옅게 더해 불협을 남김. `p6`·`p7`에서는 패드 lowpass를 600Hz로 낮춰 더 답답하게 | 0.008 |

- 장별 결:
  - `cover`: **무음.** 표지에서 바로 소리가 나지 않는다.
  - `p1`~`p4`: 드론 + 패드 + 드문 음. `p3`·`p4`는 물방울 `drop()`을 2~6초마다 더해도 됨.
  - `p5`~`p8`: 위 + 긴장 층.
  - `map`: 직전 결 유지.
  - `end`: 3초에 걸쳐 모두 줄여 무음 (결말 "비는 그쳐 있었다").
- 6장 빛 장면 동안 줄이기(`duck()`), 8장 손잡이 소리, 🔈 버튼, `hn.sound`는 그대로 둔다. `duck()`이 BGM 전체 크기에 걸리게만 맞춘다.
- BGM은 새로 시작할 때 3초에 걸쳐 천천히 들어온다. 마스터 크기 `master.gain` 0.72 → 0.55.
- 박자감 있는 반복, 드럼, 높은 음이 갑자기 튀는 것(놀래키기)은 넣지 않는다.

### 7-2. 문 소리를 "문 여는 소리"답게

지금 `door`/`doorOpen`은 sawtooth `tone()`이라 버저(삐—)처럼 들린다. **sawtooth `tone()`을 문에 쓰지 않는다.** 실제 문은 "손잡이·걸쇠 딸깍 → 경첩 삐걱 → 문이 벽/문틀에 닿는 쿵" 순서다. SND 안에 함수 셋을 추가한다:

- `latchClick(level)`: 걸쇠 딸깍. 노이즈 20ms, highpass 2500Hz + 아주 짧은 사인 1800Hz(10ms).
- `creak(secs, from, to, level)`: 경첩 삐걱.
  - `noise()` → BiquadFilter bandpass, Q 18, 주파수를 from → to로 exponentialRamp(secs 동안).
  - 크기 모양: 0.08초에 level까지, secs×0.7까지 유지, secs에 0.
  - 끊기는 느낌: 30~40Hz OscillatorNode → GainNode(level×0.6) → 위 gain.gain에 연결. 끝나면 노이즈·오실레이터 모두 stop.
  - 같은 문이 매번 똑같지 않게 from/to를 ±8% 무작위로 흔든다.
- `thud(level)`: 낮은 쿵. 사인 70→42Hz 0.18초 + `burst(level*.5,.06)`.

문 종류별:

| 효과음 | 문 | 소리 |
| --- | --- | --- |
| `door` | 3장 창고·4장 지하·5장 영사실 나무문 (열쇠로 엶) | `latchClick(.08)` → 0.12초 뒤 `creak(.8, 640, 380, .07)` → 0.85초 뒤 `thud(.08)` |
| `doorOpen` | 8장 반입문 (무거운 철문, 밖으로 밀림) | `latchClick(.1)` → 0.1초 뒤 철 울림(사인 180Hz + 267Hz를 함께 0.5초 감쇠, 각 0.05) → `creak(1.4, 420, 230, .08)` → 끝날 때 바깥 공기가 들어오는 것처럼 BGM을 0.6초간 살짝(×1.3) 키웠다가 되돌림 |
| `shutter` (1장 셔터) | 금속 셔터 | 노이즈를 쓰되 bandpass 1200Hz Q 2에 5~8Hz로 끊어서 "드르르륵" 0.9초 (지금처럼 뭉개진 노이즈 금지) |

### 7-3. 확인

- 5절 확인 스크립트: `v=end done=true`, `errors=[]`, `log`가 지금과 **같은 이름·같은 순서**여야 한다 (효과음 이름을 바꾸지 말 것).
- 375px 폭 가로 스크롤 없음.
- 끝나면: 이 문서 맨 위 "현재 상태"를 "2차 수정 반영 (날짜)"로, 2절 표의 `door`·`doorOpen`·`shutter` 설명과 "바탕 소리" 표를 7절에 맞게 고친다. `notes/05/PLAN.md` "소리" 줄 끝에 "BGM(합성, 공포 미스터리)·문 소리 2차 수정 (2026-11-18)." 추가.
- 브랜치 `note05-sound-bgm`, 커밋 메시지 `Replace Note 05 noise beds with a synthesized score and real door sounds`, PR로 `main`.
