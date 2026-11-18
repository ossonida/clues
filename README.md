# 히든노트 · Hidden Note

브라우저에서 바로 플레이하는 추리 사건 파일 시리즈입니다.

## 사건 파일

| 번호 | 제목 | 인원 | 시간 |
| --- | --- | --- | --- |
| [Note 01](notes/01/) | FUN보드 사건 파일: 보드게임 카페의 마지막 손님 | 1인~ | 60~90분 |
| [Note 02](notes/02/) | 문예부 교환일기: 노트 방탈출 | 1인~ | 20~30분 |
| [Note 03](notes/03/) | 은하분교 숙직 일지: 노트 방탈출 | 1인~ | 30~40분 |
| [Note 04](notes/04/) | 깡총이 연습장: 낙서 방탈출 (1~6장) | 1인~ | 25~35분 |
| [Note 05](notes/05/) | 폐극장 2번 출구: 영사기사 일지 방탈출 | 1인~ | 35~45분 (예상) |

## 구조

```
index.html          메인 페이지 (사건 파일 목록)
notes/01/index.html Note 01 사건 파일 (단일 HTML)
```

새 사건은 `notes/02/index.html`처럼 폴더를 추가하고 메인 페이지 목록에 카드를 하나 더하면 됩니다.

## 공개하기 (GitHub Pages)

Settings → Pages → Build and deployment에서 Source를 **Deploy from a branch**, Branch를 **main / (root)** 로 저장하면
`https://clues-kappa.vercel.app/` 에서 플레이할 수 있습니다.
