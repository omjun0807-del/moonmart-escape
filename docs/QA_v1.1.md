# MOON MART v1.1 — QA / 릴리스 기록

## 배포
- 주소: https://omjun0807-del.github.io/moonmart-escape/?v=11
- v1.0 퍼즐·사건 일지·게임 저장(localStorage) 그대로 유지.
- v1.1 `v11-aligned.js`와 `v11-aligned.css`를 새로 추가.
- 기존 v0.9 사물 오버레이의 시각 표시를 게임 전용 일러스트 모드에서 비활성화.
- 현재 화면의 `#hotspots .hotspot[data-action]` 좌표를 활용하여 서랍·창고문·관리실문·분전반·스캐너·공구함·CCTV·셔터 연출 위치를 일치시킴.
- 화면 이동 시 동일한 카메라 좌표계 사용: 모바일에서 조사 위치와 연출이 함께 이동.
- 퍼즐 성공 시 상태에 따른 표시, 애니메이션(움직임 감소 설정 존중), 현장 진행 요약 표시.
- 게임 데이터 스키마 수정 없음.

## 자동 QA
- GitHub Pages 배포 워크플로: https://github.com/omjun0807-del/moonmart-escape/actions/runs/38507462757 — 성공
- 실제 게시된 게임 E2E: https://github.com/omjun0807-del/moonmart-escape/actions/runs/38507527973 — 성공
- Playwright Chromium: 1440px / 390px / 320px **모두 통과**
- 영수증 확대·축소, 스토리 일지, 계산대 잠금해제, 서랍 연출, 창고 출입, 전력 복구, 스캐너, 공구함, 관리실 입장, CCTV, 단말기, 셔터 잠금해제, 최종 엔딩.
- 각 주요 연출 위치가 현재 조사 버튼의 top/left 백분율과 동일한지 검증.
- 연출에 pointer-events:none 적용으로 기존 클릭/터치 동작 방해 없음 확인.
- 새로고침 후 전력 복구 상태 유지, 가로 넘침 없음, 자바스크립트 오류 없음.
- 자동 브라우저 QA는 **Safari 엔진이나 실제 아이폰 실기기 테스트가 아닙니다.**

## 개선할 점
- 그래픽은 **2D SVG / CSS 아트**입니다. 고해상도 실사풍 배경 3종으로 교체한 것은 아닙니다.
- 연출 위치를 조사 버튼에 일치시켰지만 사물의 실제 윤곽에 정확히 맞는 고급 애니메이션은 추후 개별 에셋 작업이 필요합니다.
- GitHub Actions의 모바일 검사는 터치 가능한 Chromium 브라우저 에뮬레이션입니다.
