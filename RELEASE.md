# RELEASE.md · 노트 공개·결말 연결 절차

새 노트를 메인에 올리거나 결말·공유·미리보기 이미지를 고칠 때만 읽는다. 평소 작업에는 필요 없다.

## 결말 기록

- 사건을 끝내면 각 노트가 `hn.clear.noteNN`(`{ok, best, last}`, ms)에 기록을 남기고, 메인 사건 대장의 "내 기록" 칸이 그걸 읽는다.
- 새 노트는 결말에 `id="again"` 버튼을 두고 `<script src="../../feedback.js" defer></script>`를 넣는다 (피드백 칸이 #again 위에 자동으로 붙는다, Firestore `clueFeedback`, 쓰기만).
- 끝나는 자리에서 `record(ms, ok)`를 부르고 루트 `index.html`의 `SAVES`에 저장 키를 추가한다.

## 기록 공유 (share.js, api/r.js)

- `share.js`: 결말 기록 카드 → `/api/r` 링크. 링크 미리보기에 등급 도장·기록이 나오고, 받은 사람은 친구 기록 카드 → 시작 화면으로 간다. 틀린 암호 수는 `analytics.js`가 `hn.wrong.noteNN`에 센다.
- `api/r.js`: 의존성 없는 Vercel 함수. og 메타를 만들고 노트로 보낸다. 이미지는 `og/rec/noteNN-등급번호.png`. 노트·등급이 바뀌면 `NOTES` 표와 이미지도 같이 고친다.

## 링크 미리보기 이미지 (og/)

- 1200×630, Edge로 찍는다.
- `og/noteNN.png` = `note.html?n=NN` (메인 카드 폴라로이드를 그대로 가져옴). 메인 카드를 바꾸면 다시 찍는다.
- `og/rec/` = 기록 공유용.
- 새 노트는 페이지에 `og:*` 메타를 넣고 `og/noteNN.png`를 추가한다.

## 메인에 올릴 때

- 루트 `index.html` 카드(+`data-en`)와 사건 대장 행, `README.md` 표, `AGENTS.md` 사건 표를 함께 갱신한다.
- 난이도는 ●○○○○ 5단계, 시간은 실제 플레이 기준.
