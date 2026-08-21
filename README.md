# Yuna's 5th birthday invitation

정적 페이지 한 장(`index.html`)입니다. 빌드 과정 없음, 의존성 없음.

- **파티**: 2026년 9월 19일(토) 오전 11시
- **장소**: Lets Play Indoor Playground, 7/50 Curran Dr, Nicholls ACT 2913
- **RSVP**: 페이지의 폼 → 구글 폼으로 전송 → 구글 시트에 쌓임

---

## RSVP가 저장되는 경로

```
브라우저 폼  ──POST /api/rsvp──▶  Vercel 서버리스 함수  ──POST──▶  구글 폼 ──▶ 응답 시트
   (같은 출처)                        (api/rsvp.js)
```

브라우저는 **자기 사이트 주소로만** 요청합니다. 예전에는 브라우저가 직접
`docs.google.com`으로 보냈는데, 모바일에서 그 요청이 차단돼서 응답이 유실됐습니다
(데스크톱은 정상). 서버가 대신 보내면서 그 문제가 사라졌고, 같은 출처 요청이라
**진짜 상태 코드를 받을 수 있어서** 실패를 감지해 사용자에게 알릴 수 있습니다.

- 폼: <https://docs.google.com/forms/d/e/1FAIpQLSfuMaCe0OQw4aOE2MTk4_yowqCLRJXGKaIghE_MfUMeN4mCJA/viewform>
- 응답 보기: 폼 편집 화면 → **응답** 탭 → 스프레드시트 아이콘 → CSV 다운로드

폼 ID와 entry ID는 이제 `api/rsvp.js` 안에 있습니다 (`index.html`에는 없음).

| 폼 질문 | 유형 | entry ID |
|---------|------|----------|
| Attending | 단답형 | `entry.1773114326` |
| Name | 단답형 | `entry.1222470394` |
| Phone | 단답형 | `entry.1637117082` |
| Kids | 단답형 | `entry.2125723721` |
| Adults | 단답형 | `entry.1929876314` |
| Note | 장문형 | `entry.1326875089` |

⚠️ 폼 질문을 **삭제하고 다시 만들면 entry ID가 바뀝니다.** 그럴 땐 폼 편집 화면
**⋮ → 사전 작성된 링크 가져오기**로 새 ID를 확인해 `api/rsvp.js`의 `FIELDS`를 고치세요.
질문 문구만 수정하는 건 ID가 유지되므로 안전합니다.

### 릴레이 함수 직접 테스트

```sh
node -e '
const h = require("./api/rsvp.js");
h({method:"POST", body:{attending:"yes", name:"test", phone:"0400 000 000",
   kids:"1", adults:"1", note:""}},
  {setHeader(){}, status(c){this.c=c;return this}, json(o){console.log(this.c,o)}});
'
```

`200 { ok: true }` 가 나오면 시트까지 들어간 것입니다 (테스트 행은 지워주세요).

## 4. Vercel 배포

```sh
npx vercel          # 미리보기 배포
npx vercel --prod   # 실제 배포
```

또는 이 저장소를 GitHub에 올리고 [vercel.com/new](https://vercel.com/new) 에서 import 하면 됩니다.
빌드 설정은 건드릴 필요 없습니다 — Framework Preset은 **Other**, 나머지는 비워두세요.
