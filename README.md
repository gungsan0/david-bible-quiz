# 다윗 성경 퀴즈 대회 (David Bible Quiz)

오클랜드 감리교회 (Auckland Korean Methodist Church) — 실시간 멀티플레이 성경 퀴즈 웹앱

참여자들이 QR코드를 스캔해 휴대폰으로 접속하고, 메인 화면(프로젝터)에 나오는 문제를
함께 보며 사지선다형 답을 선택합니다. 문제마다 30초 제한시간과 배점이 있고,
문제가 끝날 때마다 순위가 표시됩니다.

## 📁 파일 구성

- index.html / main.js — 메인(프로젝터) 화면. 6:4 비율, 큰 폰트, QR코드, 진행자 컨트롤
- play.html / play.js — 참여자(모바일) 화면
- admin.html / admin.js — 문제 편집기 (문제 입력/수정, 배점·제한시간 설정)
- questions.js — 문제 데이터 (직접 수정 가능, 기본 30문제)
- firebase-config.js — Firebase 설정 (직접 입력 필요)
- style.css — 테마 (검정/골드)

## 🔧 설정 방법 (Firebase)

1. Firebase 콘솔(console.firebase.google.com)에서 프로젝트를 만듭니다.
2. **Realtime Database**를 생성합니다 (테스트 모드로 시작 가능).
3. 프로젝트 설정 > 내 앱 > 웹앱(</>)을 추가하고 SDK 설정값을 복사합니다.
4. firebase-config.js 파일을 열어 firebaseConfig 값을 붙여넣습니다.
   - databaseURL 값이 반드시 포함되어야 합니다.

## 🚀 배포 (GitHub Pages)

Settings > Pages > Branch를 main / (root)로 설정하면 아래 주소로 배포됩니다:

  https://gungsan0.github.io/david-bible-quiz/

- 메인 화면: .../index.html
- 참여자: .../play.html (메인 화면의 QR코드)
- 관리자: .../admin.html

## 🎮 진행 방법

1. 프로젝터에 index.html을 띄웁니다. 참여자는 QR코드로 play.html에 접속해 이름을 입력합니다.
2. 하단 "진행 패널"에서:
   - **대회 시작/리셋**: 점수 초기화 후 1번 문제로
   - **문제 보이기**: 문제만 표시 (보기 숨김)
   - **보기 공개**: 2초 뒤 보기 4개 등장 + 30초 타이머 시작 + 참여자 디바이스에도 보기 표시
   - **정답 공개**: 정답 표시 및 점수 정산
   - **순위 보기**: 현재 순위 표시
   - **다음 문제**: 다음 문제로 이동
   - **최종 결과**: 최종 순위

## ✏️ 문제 수정

- admin.html에서 문제를 편집한 뒤 "questions.js 코드 생성"을 눌러 나온 코드를
  questions.js 파일에 붙여넣어 저장하면 반영됩니다.
- 또는 questions.js를 직접 편집해도 됩니다. 문제 개수는 자유롭게 늘리고 줄일 수 있습니다.

---
"말씀을 알고, 믿음을 세우는 시간!"
