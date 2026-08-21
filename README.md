# Yuna's 5th birthday invitation

정적 페이지 한 장(`index.html`)입니다. 빌드 과정 없음, 의존성 없음.

- **파티**: 2026년 9월 19일(토) 오전 11시
- **장소**: Lets Play Indoor Playground, 7/50 Curran Dr, Nicholls ACT 2913
- **RSVP**: 페이지의 폼 → 구글 폼으로 전송 → 구글 시트에 쌓임

---

## 구글 폼 연동 (연결 완료)

RSVP는 아래 폼으로 전송되어 응답 시트에 쌓입니다.

- 폼: <https://docs.google.com/forms/d/e/1FAIpQLSfuMaCe0OQw4aOE2MTk4_yowqCLRJXGKaIghE_MfUMeN4mCJA/viewform>
- 응답 보기: 폼 편집 화면 → **응답** 탭 → 스프레드시트 아이콘 → 거기서 CSV로 내려받기

`index.html`의 `<script>` 맨 위 설정이 폼의 질문과 이렇게 연결돼 있습니다.

| 폼 질문 | 유형 | entry ID | 코드의 필드 |
|---------|------|----------|-------------|
| Attending | 단답형 | `entry.1773114326` | `attending` (`Coming` / `Can't come`) |
| Name | 단답형 | `entry.1222470394` | `name` |
| Phone | 단답형 | `entry.1637117082` | `phone` |
| Kids | 단답형 | `entry.2125723721` | `kids` |
| Adults | 단답형 | `entry.1929876314` | `adults` |
| Note | 장문형 | `entry.1326875089` | `note` |

⚠️ **폼의 질문을 지우고 다시 만들면 entry ID가 바뀝니다.** 그럴 땐 폼 편집 화면
**⋮ → 사전 작성된 링크 가져오기**로 새 ID를 확인해서 `FIELDS`를 갱신하세요.
질문 문구만 고치는 건 ID가 유지되므로 안전합니다.

## 4. Vercel 배포

```sh
npx vercel          # 미리보기 배포
npx vercel --prod   # 실제 배포
```

또는 이 저장소를 GitHub에 올리고 [vercel.com/new](https://vercel.com/new) 에서 import 하면 됩니다.
빌드 설정은 건드릴 필요 없습니다 — Framework Preset은 **Other**, 나머지는 비워두세요.

## 페이지 안의 "RSVP log"

맨 아래 작은 `RSVP log` 링크는 **그 기기에서 제출된 응답만** 보여주는 예비 기록입니다
(구글 폼이 먹통일 때를 대비한 백업). 전체 명단은 항상 구글 시트를 보세요.
