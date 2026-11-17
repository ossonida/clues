# Note 05 소리 작업 명세 (인계용)

이 문서만 보고 Note 05에 소리를 넣을 수 있게 정리했다. 다른 AI(GPT, Codex 등)나 사람이 이어서 작업해도 되도록, **무엇을 바꾸고 무엇을 건드리지 않는지**를 먼저 적는다. 막히면 추측해서 고치지 말고 여기 적힌 범위 안에서만 움직인다.

- 정한 날: 2026-11-17 (사용자 결정: BGM 없이 장소의 소리만, 놀래키는 소리 없음)
- 대상: `notes/05/index.html` 하나 (+ 이 문서, `notes/05/PLAN.md` 한 줄, 끝나면 `AGENTS.md` 표 한 칸)
- 현재 상태: 소리 넣음 (2026-11-17). 퍼즐·이야기는 1~8장 + 문단속 결말까지 완성·검증된 상태

## 1. 절대 하지 말 것

1. **음악(BGM)을 넣지 않는다.** 멜로디·화음·배경 음악 없음.
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
| `cover`, `p1` 로비, `p2` 매표소 | 바깥 빗소리 | 화이트 노이즈 → lowpass 900Hz → gain 0.05 |
| `p3` 매점 창고 | 빗소리 더 작게 + 천장 물방울 | 위 빗소리 gain 0.025 + 2~6초마다 짧은 사인파 "똑"(1400→700Hz, 60ms) |
| `p4` 지하 필름 창고 | 물방울 + 낮은 웅웅 | "똑" + 사인 55Hz gain 0.02 |
| `p5` 영사실 | 영사기가 돌면(`S.w[5].run && power()`) 영사기 소리, 아니면 아주 작은 실내음 | 영사기: 노이즈 bandpass 2kHz를 24Hz로 끊어 "따르르르" + 사인 48Hz, gain 0.06 |
| `p6` 객석 | 영사기가 돌면 먼 영사기 소리(위의 1/3 크기), 아니면 거의 무음 | |
| `p7` 무대 뒤 | 낮은 바람 | 노이즈 bandpass 300Hz, gain 0.02, 천천히 흔들기 |
| `p8` 2번 출입구 | 문틈 바람 + 빗소리. 문이 열리면(`S.w[8].out`) 빗소리·바람 크게 | |
| `map` | 직전 소리 유지 | |
| `end` | 3초에 걸쳐 모두 줄여서 무음 (결말: "비는 그쳐 있었다") | |

- 바탕 소리가 바뀔 때는 0.8초 정도 겹쳐 바꾼다(뚝 끊지 않기). 같은 소리면 다시 시작하지 않는다.
- `S.w[5].run`, `power()`, `S.w[8].out`처럼 **상태에 따라 바뀌므로** 화면이 다시 그려질 때마다 "지금 깔려야 할 소리"를 계산해서 맞춘다 (4절의 `SND.after()`).

### 효과음 (사용자가 조작했을 때만, 짧게, 최대 gain 0.3)

| 이름 | 언제 | 소리 |
| --- | --- | --- |
| `tick` | 다이얼 숫자가 바뀜 | 아주 짧은 딸깍 (노이즈 15ms, highpass 3kHz) |
| `rattle` | 자물쇠 당겼는데 안 열림 | 둔한 철컥 두 번 |
| `unlock` | 자물쇠·열쇠함·빗장이 열림 | 딸깍 + 짧은 금속 울림 |
| `door` | 열쇠로 문이 열림 (3·4·5장 `door`) | 낮은 삐걱 (톱니파 120→90Hz, lowpass) |
| `shutter` | 1장 셔터가 올라감 | 노이즈 0.8초, 점점 커졌다 작아짐 |
| `breaker` | 차단기 하나 올리거나 내림 | 묵직한 철컥 |
| `trip` | 차단기가 한꺼번에 떨어짐 | 철컥 여러 번 + 바탕 소리 잠깐 끊김 |
| `projStart` / `projStop` | 영사기 레버 올림/내림 | 모터가 올라가는/내려가는 소리 1.5초 |
| `switch` | 6장 호출등 스위치 내림 | 작은 딸깍 |
| `rope` | 7장 막 줄을 당김 | 천 스치는 노이즈 0.6초 |
| `splice` | 8장 필름 조각을 칸에 붙임 | 딸깍 + 테이프 |
| `crank` | 8장 뷰어 손잡이 돌리기 켬 | 돌아가는 동안 작은 "따르르" 반복, 끄면 멈춤 |
| `doorOpen` | 8장 전기 잠금 열고 문이 밀림 | 무거운 문 + 바람이 확 커짐 |
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
