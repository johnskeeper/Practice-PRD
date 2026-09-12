# 🎼 학교 음악회 안전 좌석 배치 시스템
> **School Concert Hall Safety Seating & Evacuation Routing System**  
> 29학급 580석의 좌석 배치, 무작위 추첨, 휠체어석 사전 지정, 비상 안전 대피 및 입·퇴장 시뮬레이션을 원스톱으로 지원하는 웹 애플리케이션

[![Deploy to GitHub Pages](https://github.com/johnskeeper/Practice-PRD/actions/workflows/deploy.yml/badge.svg)](https://github.com/johnskeeper/Practice-PRD/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-34C759?style=flat&logo=github)](https://johnskeeper.github.io/Practice-PRD/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌐 라이브 데모 (Live Demo)
👉 **웹 브라우저에서 바로 사용하기**: [https://johnskeeper.github.io/Practice-PRD/](https://johnskeeper.github.io/Practice-PRD/)

---

## 📌 프로젝트 소개 (Overview)
학교 전체 음악회 및 대규모 강당 행사 시 수백 명의 학생과 관람객이 동시에 이동할 때 발생할 수 있는 안전사고(압사, 동선 엉킴 등)를 예방하고, 공정하고 신속하게 좌석을 배정하기 위해 개발된 시스템입니다.

애플(Apple) 감성의 절제된 카드 UI와 여백의 미를 살린 레이아웃, 직관적인 인터랙션을 통해 복잡한 580석 규모의 배치도를 한눈에 파악하고 제어할 수 있습니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. 29학급 580석 자동 연동 & 넘버링
- **29개 학급**(학급당 20명) 기준 총 **580석**의 좌석 번호 및 블록 자동 생성
- 중앙 통로 및 좌우 비상 대피 통로를 고려한 3개 섹션(좌측, 중앙, 우측) 구조

### 2. 휠체어 학생 안전석 사전 지정
- 거동이 불편한 학생 및 휠체어 이용 학생을 위해 비상구 및 통로에 인접한 안전 구역 우선 배정
- 학급별 휠체어 학생 여부에 맞춰 즉각적인 위치 확인 및 보호 동선 확보

### 3. 부드러운 텍스처 그라데이션 무작위 배치 (Random Shuffle)
- 버튼 한 번으로 공정하게 전체 학급의 구역 및 좌석을 무작위 셔플
- 부드러운 인터랙션 애니메이션 및 컨페티(Confetti) 효과로 재미와 공정성 제공

### 4. 안전 동선 시뮬레이션 (Safety Simulation)
- **순차 입장 모드**: 인원 집중을 막기 위해 지정된 순서대로 블록별 안전 입장 시뮬레이션
- **비상/안전 퇴장 모드**: 비상구와 가까운 구역부터 순차적으로 안전하게 퇴장하는 단계별 가이드

### 5. 빔프로젝터 전광판 모드 (Projector View)
- 강당이나 체육관의 대형 빔프로젝터/스크린에 띄워 학생들이 자신의 좌석 위치를 멀리서도 한눈에 확인할 수 있는 전광판 뷰 제공

### 6. 학급별 좌석표 인쇄 & 내보내기 (Print & Export)
- 담임교사 및 인솔교사를 위해 학급별 좌석 번호와 배치 명단을 A4 용지에 맞춤 인쇄할 수 있는 프린트 최적화 뷰

### 7. 로컬 스토리지 자동 저장 & 다국어 지원
- 서버나 DB 없이 브라우저 **LocalStorage**에 모든 배치 정보 자동 보관
- **한국어 / 영어 (KO / EN)** 원클릭 언어 전환 지원

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 사용 기술 |
| :--- | :--- |
| **Frontend** | React 19, TypeScript |
| **Build & Tooling** | Vite 8, Oxlint |
| **Styling** | Vanilla CSS (Apple Design System Tokens, Glassmorphism, CSS Grid) |
| **Icons & Effects** | Lucide React, Canvas-Confetti |
| **Storage** | Browser LocalStorage (No Server/No DB required) |
| **CI/CD** | GitHub Actions & GitHub Pages |

---

## 🚀 로컬 실행 방법 (Getting Started)

### 1. 저장소 복제 (Clone)
```bash
git clone https://github.com/johnskeeper/Practice-PRD.git
cd Practice-PRD
```

### 2. 패키지 설치 (Install Dependencies)
```bash
npm install
```

### 3. 개발 서버 실행 (Run Dev Server)
```bash
npm run dev
```
브라우저에서 `http://localhost:5173/`으로 접속합니다.

### 4. 프로덕션 빌드 (Build for Production)
```bash
npm run build
```
`dist/` 디렉터리에 정적 빌드 결과물이 생성됩니다.

---

## ⚙️ GitHub Pages 배포 설정 안내

본 저장소에는 `.github/workflows/deploy.yml` 워크플로우가 포함되어 있어, `main` 브랜치에 푸시될 때마다 자동으로 빌드 및 배포됩니다.

1. GitHub 저장소의 **Settings** 탭으로 이동합니다.
2. 좌측 메뉴의 **Pages**를 클릭합니다.
3. **Build and deployment > Source** 옵션에서 **GitHub Actions**를 선택합니다.
4. 배포가 완료되면 `https://johnskeeper.github.io/Practice-PRD/` 에서 즉시 확인하실 수 있습니다.

---

## 📄 라이선스 (License)
This project is licensed under the MIT License.
