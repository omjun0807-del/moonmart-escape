# MOON MART v1.4 — 진행 기록 복원 무결성 검증

## 이번 릴리스
- 사이트: https://omjun0807-del.github.io/moonmart-escape/?v=14
- 핵심 수정: 백업 불러오기/이전 기록 복구 직후 `location.reload()`가 실행될 때, 구버전 게임의 `pagehide` 자동 저장이 복원 데이터를 덮어쓸 가능성을 해결.
- `v14-restore-preload.js`: 같은 탭 `sessionStorage`에 임시 저장한 복원 데이터를 게임 본체의 초기화 스크립트 **전에** `localStorage`에 적용. 데이터 형식·용량 검증 후 보관된 임시 데이터를 정리.
- `v13-playable-focus.js`: 백업 불러오기와 되돌리기에서 검증한 게임 데이터의 임시 복원 정보를 먼저 저장하고 새로고침. 실제 적용 성공 시 게임 내 보관함 상태 표시.
- 기존 진행 기록(localStorage `moon_mart_escape_ep01_v1`), 기존 퍼즐과 인벤토리, 일지, 그래픽, 몰입 보기는 유지.

## 테스트 — 성공
- 전체 결과: https://github.com/omjun0807-del/moonmart-escape/actions/runs/38520576212
- 자동 검사: Playwright Chromium + WebKit, 1440px/390px/320px의 총 6조합 **모두 성공**
- 테스트: 초기 게임, 영수증, 계산대, 창고, 분전반, 스캐너, 공구함, 관리실, CCTV, 셔터, 탈출 엔딩.
- 백업: JSON 다운로드, 잘못된 JSON 거부, 진행 시간 18,888초/메모 단서/영수증 아이템을 갖는 **수정된 백업**을 로드. 복원 결과와 기존 기록으로 되돌리기 결과를 각각 검사. 실제 `pagehide` 후 새로고침에서도 변경 사항 유지.
- QA 파일: `tests/qa-v14.mjs`, 워크플로: `.github/workflows/qa-v14.yml`.
- Chromium 화면: 자동 테스트 산출물 `moonmart-v14-chromium-screenshots`
- WebKit 화면: 자동 테스트 산출물 `moonmart-v14-webkit-screenshots`

## 미검증/다음 단계
- **실제 아이폰 Safari 기기에서 수동 테스트는 아직 시행하지 않음**. WebKit 자동 시뮬레이션과 실기기 확인은 다름.
- 실사풍 전용 게임 배경 3종은 미제작이며 기존 2D SVG 아트를 계속 사용 중.
- 버전별 JS/CSS를 연속 삽입하는 오래된 배포 구조는 단계적 리팩터링 필요. 진행 중인 사용자의 저장 데이터 키와 호환성 보존을 최우선으로 할 것.
