# MOON MART v0.7 사진 배경 베타

v0.7은 게임 전용 배경을 완성한 정식 버전이 아니라, **독립된 실사 사진 세 장을 사용하는 시험 기능**입니다. 이미지 생성 결과가 합성 화면으로 나와 이번 버전에는 사용하지 않았습니다.

- 매장: Bruno BD, [Unsplash](https://unsplash.com/photos/interior-of-a-small-convenience-store-with-shelves-stocked-DOycDWzx-dQ)
- 창고: Chris Diamond, [Unsplash](https://unsplash.com/photos/a-dimly-lit-storage-room-with-shelves-and-ladders-Tni9sb7mEkw)
- 관리실: Igor Omilaev, [Unsplash](https://unsplash.com/photos/a-room-filled-with-lots-of-desks-covered-in-monitors-5ma_XqDCiG4)

모두 무료 사진이며 출처 링크를 화면에 표시합니다. 사진은 [Unsplash License](https://unsplash.com/license)를 참고했습니다. 실사 사진은 원본 CDN에서 직접 불러옵니다.

## 기능

- 게임 화면에 **실사 사진 / 기존 아트** 전환 버튼
- 화면 전환 및 페이지 새로고침 후 선택값 유지
- CDN 이미지 불러오기 실패 시 기존 장면 이미지로 자동 복귀
- 퍼즐 진행도, 아이템, 저장 형식은 v0.6과 동일

## 품질 검사 상태

- Chromium PC 1440px, 모바일 390px 및 320px에서 기존 핵심 게임 전 구간 자동 조작 테스트 완료. (v0.7 인라인 개발 후보)
- GitHub Pages 배포 파이프라인에서 index.html, v07-photo.js, v07-photo.css 게시 성공.
- **GitHub에서 서비스되는 분리형 사진 전환 파일의 실제 브라우저 실행은 미검증**.
- **실제 아이폰 Safari의 사진 표시 및 조작은 미검증**.
- 무료 사진은 게임 전용 아트가 아니므로 사진 속 물체와 조사 버튼의 위치가 완전히 일치하지 않습니다. 정식 고화질 게임 배경 제작 시 다시 교체해야 합니다.

## 비용

추가 결제나 유료 이미지 생성은 하지 않았습니다.
