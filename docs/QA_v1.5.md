# MOON MART v1.5 — 통합 빌드와 UI 개선 검증

## 배포
- 게임: https://omjun0807-del.github.io/moonmart-escape/?v=15
- 배포 결과: https://github.com/omjun0807-del/moonmart-escape/actions/runs/38539154555 (성공)
- QA 결과: https://github.com/omjun0807-del/moonmart-escape/actions/runs/38539340303 (Chromium/WebKit 모두 성공)

## 코드 구조 개선
- `scripts/build-v15.py`를 통해 기존 v0.9~v1.3 게임 확장 모듈 5개와 v1.5 UI 스타일·스크립트를 **원래 순서 그대로 연결**해 `v15-runtime.js` / `v15-runtime.css` 두 개의 파일로 생성.
- 이전 확장 JS/CSS 파일은 빌드 과정에서만 사용하며 실제 배포물에서는 중복 제공하지 않음.
- 기존 v0.8 메인 게임의 인라인 자바스크립트와 저장 데이터 스키마는 변경하지 않음.
- 복원용 `v14-restore-preload.js`는 여전히 게임 본체 코드보다 **앞**에 삽입되며, 번들 통합 후에도 백업 복원 기능을 유지.
- 컴파일러/전처리기나 추가 유료 서비스 의존 없이 GitHub Actions의 Python 및 Node 문법 검사를 활용.
- 고유한 `v15-runtime.js?v=15` 및 `v15-runtime.css?v=15` URL을 사용해 이전 버전 브라우저 캐시의 영향을 줄임.

## UI 개선
- 게임의 패널·장면·임무 카드·상호작용 버튼·확대 조사 화면의 명암과 민트/앰버 포인트 색상 통일.
- **몰입 보기에서 현재 목표와 퍼즐 진행률을 화면 위에 표시**. 기존 `#missionTitle`, `#progress`의 실제 값만 읽기 때문에 별도의 가짜 진행 상태를 만들지 않음.
- 휴대폰 화면 크기에 맞춰 HUD 크기를 조절하고, HUD가 조사 버튼을 가로막지 않도록 `pointer-events: none` 적용.
- 새 배경 이미지 3종은 여전히 미제작. 기존 게임 전용 SVG 배경 유지.

## 자동 QA: 6/6 통과
- Chromium: PC 1440px, 모바일 390px 및 320px 모두 통과
- WebKit: PC 1440px, 모바일 390px 및 320px 모두 통과
- 테스트 자동화: `tests/qa-v15.mjs`, `.github/workflows/qa-v15.yml`
- 게시된 사이트의 기존 버전 JS/CSS 개별 로딩 0개, v1.5 통합 JS 1개, CSS 1개 로딩 확인.
- 백업 복원 선행 스크립트가 번들보다 앞에 배치돼 있는지 검증.
- 기존 게임 시작, 힌트·사건 일지, 조사 확대, 몰입 보기 가방으로 열쇠 선택, 창고·분전반·스캐너·관리실·CCTV·셔터 및 최종 탈출.
- 파일 내보내기, 잘못된 백업 거부, **진행 시간·단서·인벤토리를 변경한 백업** 불러오기, 게임 재진입 후 데이터 일치, 이전 진행 기록 복구.
- 모의 모바일 환경은 Playwright의 viewport / touch 환경이며 **실제 아이폰 Safari 실기기 직접 검사와는 다름**.

## 남은 작업
- 새 독립 배경 아트 3종 제작과 조사 좌표 눈검수.
- 원본 v0.8 ZIP 기반 게임 소스를 일반 정적 파일로 전환하는 장기적 리팩터링.
- 실제 아이폰 Safari 실기기 및 저장 복원 수동 QA.
