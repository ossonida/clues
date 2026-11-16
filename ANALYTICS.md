# 히든노트 이용 분석 설계

스코어카운터와 같은 GA4 속성(`G-NFEYJ27K5H`)을 씁니다. 히든노트 페이지는 `content_group = hidden_note`로 들어가서, 보고서에서 **콘텐츠 그룹** 또는 **페이지 경로 `/clues/`** 로 걸러 보면 됩니다.

- 코드: [analytics.js](analytics.js) (스키마·전송), 각 페이지에서는 `hn('이벤트', {...})` 호출
- 스키마에 없는 이벤트나 값은 전송하지 않습니다. 후기 내용, 이메일, Firebase UID는 보내지 않습니다.
- 모든 이벤트에 `note`(예: `note01`), `lang`(`ko`/`en`)이 자동으로 붙습니다.
- 처음 방문하면 화면 아래에 안내가 한 번 뜨고, 여기서 끌 수 있습니다. 스코어카운터와 끄기 설정을 공유합니다(같은 도메인).
- **내 방문 제외:** `https://ossonida.github.io/clues/?analytics=off` 를 한 번 열면 그 브라우저는 계속 제외됩니다. 스코어카운터에서 이미 제외했다면 그대로 적용됩니다.
- 디버그: 콘솔에서 `hnDebug = true` 후 조작하면 보내는 이벤트가 콘솔에 찍힙니다.

## 자동으로 모이는 것 (GA4 기본)

방문자 수, 세션, 신규/재방문, 국가·도시, 언어, 기기·브라우저, 유입 경로(referrer, UTM), 페이지별 조회, 참여 시간, 스크롤(향상된 측정).

## 이벤트

| 이벤트 | 언제 | 파라미터 |
| --- | --- | --- |
| `case_link_clicked` | 메인에서 사건 열기 | `place` (folder / ledger) |
| `recommend_clicked` | 사건 대장의 추천 버튼 | `action` (add / remove) |
| `language_changed` | 언어 전환 | `to` (ko / en) |
| `case_intro_viewed` | 사건 페이지 도착, 도입부 표시 | — |
| `case_started` | "조사 시작" 누름 | — |
| `case_resumed` | 새로고침·재방문 시 저장된 진행을 이어서 시작 (`case_left`는 새로고침 때도 찍힘) | `clue_count`, `minutes_used` |
| `help_opened` | 게임 방법 다시 보기 | — |
| `location_opened` | 장소 이동 | `location`, `minutes_used` |
| `hotspot_checked` | 물건 조사 | `hotspot`, `location`, `outcome` (found / nothing_new / blocked / revisit), `step`, `minutes_used` |
| `clue_found` | 새 단서 획득 | `clue`, `source` (scene / phone / interrogation), `clue_count`, `minutes_used` |
| `puzzle_tried` | 비밀번호·자물쇠 시도 | `puzzle` (dvr / phone / storeDoor), `outcome` (wrong / solved), `attempt`, `minutes_used` |
| `phone_app_opened` | 휴대폰 앱 처음 열기 | `app`, `minutes_used` |
| `statement_heard` | 진술 듣기 | `suspect`, `minutes_used` |
| `evidence_shown` | 증거 제시 | `suspect`, `clue`, `outcome` (new_clue / reaction / no_reaction), `minutes_used` |
| `time_ran_out` | 조사 시간 0분 | `clue_count` |
| `accuse_started` | 범인 지목 시작 | `forced`, `clue_count`, `minutes_used`, `play_minutes` |
| `accuse_cancelled` | 지목 도중 그만둠 | `step` (1~3) |
| `case_finished` | 결과 화면 | `grade` (solved / almost / culprit_only / unsolved), `points`, `accused`, `culprit_correct`, `time_correct`, `evidence_correct`, `evidence_count`, `forced`, `clue_count`, `clue_total`, `minutes_used`, `play_minutes` |
| `case_restarted` | 처음부터 다시 | — |
| `case_left` | 끝내지 않고 페이지를 떠남 | `stage` (intro / investigating / accusing), `location`, `clue_count`, `minutes_used`, `play_minutes` |

- `minutes_used`: 게임 속 조사 시간(80분 중 쓴 분)
- `play_minutes`: "조사 시작"부터 실제로 흐른 분

## GA4에서 한 번 해 둘 설정

**관리 → 맞춤 정의**에 등록해야 보고서·탐색에서 파라미터를 쓸 수 있습니다(등록한 날부터 집계).

- 맞춤 측정기준(이벤트 범위): `note`, `lang`, `place`, `outcome`, `action`, `location`, `hotspot`, `clue`, `source`, `puzzle`, `app`, `suspect`, `stage`, `grade`, `accused`, `culprit_correct`, `time_correct`, `evidence_correct`, `forced`
- 맞춤 측정항목(이벤트 범위): `minutes_used`(분), `play_minutes`(분), `clue_count`, `clue_total`, `points`, `attempt`, `step`, `evidence_count`
- **관리 → 이벤트 → 주요 이벤트**로 표시: `case_started`, `case_finished`, `recommend_clicked`

## 보면 좋은 탐색 보고서

1. **유입 → 완주 퍼널** (유입경로 탐색): `page_view`(/clues/) → `case_link_clicked` → `case_intro_viewed` → `case_started` → `clue_found` → `puzzle_tried`(outcome=solved) → `accuse_started` → `case_finished`. 어디서 많이 빠지는지 봅니다.
2. **이탈 지점**: `case_left`를 `stage` × `location`으로 보고, `clue_count`·`minutes_used` 평균을 봅니다. 특정 장소에서 막혀 나가는지 알 수 있습니다.
3. **퍼즐 난이도**: `puzzle_tried`를 `puzzle` × `outcome`으로 봅니다. 풀기 전 평균 `attempt`, 아예 못 푼 비율을 확인합니다.
4. **단서 발견율**: `clue_found`를 `clue`별 사용자 수로 보고 `case_started` 사용자 수로 나눕니다. 아무도 못 찾는 단서와 너무 쉬운 단서를 찾을 수 있습니다.
5. **결과 분포**: `case_finished`를 `grade`, `accused`로 봅니다. 함정 용의자에게 얼마나 걸리는지, `forced=yes`(시간 초과) 비율은 어떤지 확인합니다.
6. **심문 효과**: `evidence_shown`을 `suspect` × `clue` × `outcome`으로 봅니다. 어떤 증거 제시가 실제로 새 단서로 이어지는지 알 수 있습니다.
7. **언어·국가**: `lang` × 국가로 영어판 이용과 완주율을 봅니다.

## 새 사건을 추가할 때

`<html data-note="note02">`처럼 사건 번호만 바꾸고, Note 01과 같은 위치에서 `hn(...)`을 부르면 됩니다. 장소·단서·퍼즐 id는 영문·숫자·밑줄로 짓습니다(`^[a-zA-Z][a-zA-Z0-9_]{0,39}$`, 40자 이내). 이 형식이 아닌 값은 전송되지 않습니다.
