# MOON MART: 심야 탈출

브라우저에서 즐기는 한국어 싱글플레이 방탈출 게임입니다. 현재 개발 버전은 **v0.3 베타**입니다.

## 최초 배포 순서

1. 저장소 [Settings → Pages](https://github.com/omjun0807-del/moonmart-escape/settings/pages)에서 **Source: GitHub Actions**로 지정합니다.
2. 저장소 메인 화면의 **Add file → Upload files**에서 파일 `MOON_MART_심야탈출_v0.3_전체프로젝트.zip` 하나를 **최상위 위치에** 업로드합니다.
3. **Commit changes**를 누릅니다. GitHub Actions가 ZIP 내부의 `MOON_MART_v0.3/` 게임 파일을 자동으로 배포합니다.
4. [Actions](https://github.com/omjun0807-del/moonmart-escape/actions)에서 **Deploy MOON MART escape**의 성공 여부를 확인합니다.
5. 배포가 성공하면 **https://omjun0807-del.github.io/moonmart-escape/** 로 플레이할 수 있습니다.

ZIP은 **압축을 풀지 않은 그대로** 업로드하세요. 처음에는 ZIP 한 개만 필요합니다. 이후 업데이트 때는 기존 ZIP을 교체하거나 워크플로를 확장합니다.

## 현재 구현

- 매장, 창고, 관리실 탐색
- 인벤토리 / 단서 / 힌트
- 비밀번호 키패드 및 전력 복구 등 퍼즐
- 자동 저장과 이어하기
- PC 및 모바일 화면 크기 대응

## 검증 및 주의

자동 브라우저 테스트는 수행했지만, 실제 아이폰 Safari 검증과 외부 테스터 검증은 아직입니다. AI 배경 이미지의 글자 왜곡과 일부 연출 미완성도 남아 있습니다.

게임 기록은 각 브라우저의 localStorage에 저장합니다. 브라우저 데이터를 삭제하면 초기화될 수 있습니다.