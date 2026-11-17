---
description: 사건 노트별 진행 상황(메인 등록, 영어판, 분석, 저장 키, 정할 것, 커밋 상태)을 표로 보여 준다
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(ls:*), Read, Grep, Glob
argument-hint: "[노트 번호, 예: 03 (비우면 전체)]"
---

히든노트 사건 노트의 진행 상황을 정리한다. 파일은 고치지 않는다.

대상: $ARGUMENTS 가 있으면 `notes/$ARGUMENTS/`만, 없으면 `notes/*/` 전체.

## 노트마다 확인할 것

| 열 | 확인 방법 |
| --- | --- |
| 제목·장르 | `notes/NN/index.html`의 `<title>`, PLAN.md 첫 표 |
| 메인 카드 | 루트 `index.html`에 `href="notes/NN/"`인 `<a class="note` 가 있는지 |
| 사건 대장 | 루트 `index.html` 표에 `NOTE NN` 행이 있는지 |
| README | `README.md` 표에 `notes/NN/` 행이 있는지 |
| 영어판 | `notes/NN/en.js`가 있거나 페이지가 `lang.js`를 불러오는지. 메인 카드의 `data-en`에 "Korean only"가 있으면 그렇게 표시 |
| 분석 | 페이지에 `data-note="noteNN"`과 `analytics.js` 불러오기, `hn(` 호출이 있는지 |
| 저장 키 | `SAVE_KEY` 값 |
| 정할 것 | PLAN.md `## 정할 것`의 `- [ ]` 개수와 항목 |
| 최근 커밋 | `git log -1 --format='%h %ad %s' --date=short -- notes/NN` |
| 미커밋 | `git status --short -- notes/NN` |

메인 카드의 난이도·시간이 PLAN.md 첫 표와 다르면 따로 표시한다.

## 출력

1. 요약 표 한 개 (노트 × 위 열). 있음 ✅, 없음 —, 부분 △.
2. 표 아래에 노트별로 "다음에 할 일"을 1~3줄. 남은 "정할 것", 메인 미등록, 미커밋 변경을 우선한다.
3. 저장소 전체의 미커밋 파일이 노트 밖에도 있으면 마지막에 한 줄로 알린다.

한국어로 짧게 쓴다.
