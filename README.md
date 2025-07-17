# 감정 일기 (Emotion Diary)

React + Next.js + Tailwind CSS로 만든 간단한 감정 일기 앱입니다.

## 주요 기능

- 6가지 감정 선택 (기쁨, 슬픔, 화남, 불안, 평온, 흥분)
- 각 감정별 이모지와 색상 테마
- 일기 작성 및 저장 (로컬 스토리지 사용)
- 일기 목록 보기
- 일기 삭제 기능
- 반응형 디자인

## 시작하기

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

### 빌드
```bash
npm run build
```

### 프로덕션 실행
```bash
npm start
```

## 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Local Storage** - 데이터 저장

## 프로젝트 구조

```
emotion-diary/
├── app/
│   ├── components/
│   │   ├── DiaryEntry.tsx    # 일기 작성 컴포넌트
│   │   └── DiaryList.tsx     # 일기 목록 컴포넌트
│   ├── globals.css           # 전역 스타일
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 메인 페이지
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```