# 철학 기반 AI 추천 시스템 통합 가이드

## 📋 개요

`philosophy-recommender.js`는 **이승건, 레이 달리오, 워렌 버핏 3인의 철학**을 기반으로 baln 앱의 개발 우선순위를 추천하는 시스템입니다.

### 핵심 철학

| 인물 | 핵심 주장 | 가중치 |
|------|----------|--------|
| **이승건** (토스 CEO) | "보상으로 교육을 감싸라" (습관 형성) | 35% |
| **레이 달리오** (Bridgewater) | "맥락이 공포를 이해로 바꾼다" (맥락 제공) | 40% |
| **워렌 버핏** (Berkshire) | "매일 읽는 사람이 결국 이긴다" (매일 읽기) | 25% |

### 최종 점수 산출 공식

```
최종 점수 = 철학 점수(60%) + 데이터 영향도(40%)

철학 점수 = (이승건 점수 × 0.35) + (달리오 점수 × 0.40) + (버핏 점수 × 0.25)

데이터 영향도 = 현재 지표(D7 리텐션, 전환율, MAU)에 따라 동적 계산
```

---

## 🚀 통합 방법

### 1단계: HTML에 스크립트 추가

`index.html`의 `<head>` 또는 `</body>` 직전에 추가:

```html
<script src="philosophy-recommender.js"></script>
```

### 2단계: 기존 AI 추천 코드 교체

`index.html`에서 아래 섹션을 찾아서:

```javascript
// 의사결정 AI 추천
const recommendations = [];
const warnings = [];

// 집중 과제 추천
if (d7Retention < targetRetention) {
  recommendations.push('📌 <strong>리텐션 개선</strong>: ...');
}
// ... (기존 코드)
```

아래 코드로 교체:

```javascript
// ══════════════════════════════════════════════════════════════
// 철학 기반 AI 추천 시스템 (이승건, 달리오, 버핏)
// ══════════════════════════════════════════════════════════════

const metrics = {
  d7Retention: parseFloat(d7Retention),
  conversionRate: parseFloat(conversionRate),
  currentMAU: currentMAU,
  targetMAU: targetMAU
};

// 우선순위 계산
const rankedFeatures = calculatePriorities(metrics);
const top5 = rankedFeatures.slice(0, 5);

// 기존 경고 시스템 유지
const warnings = [];
if (d7Retention < 30) {
  warnings.push('⚠️ <strong>리텐션 위험</strong>: D7 리텐션 30% 미만. 즉시 개선 필요!');
}
if (currentMAU < 50 && new Date().getMonth() >= 1) {
  warnings.push('⚠️ <strong>MAU 성장 지연</strong>: 6월 목표 달성 가능성 낮음. 가속 필요');
}
```

### 3단계: 렌더링 코드 교체

기존 `document.getElementById('wbs-ai-decisions').innerHTML = ...` 부분을 아래로 교체:

```javascript
document.getElementById('wbs-ai-decisions').innerHTML = `
  ${renderRecommendations(metrics)}

  ${warnings.length > 0 ? `
  <div style="background: rgba(207,102,121,0.15); padding: 16px; border-radius: 8px; border-left: 3px solid var(--red); margin-top: 16px;">
    <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--red);">⚠️ 주의 필요 지표</h3>
    ${warnings.map(w => `<div style="color: var(--text2); font-size: 13px; margin-bottom: 8px; line-height: 1.6;">${w}</div>`).join('')}
  </div>
  ` : ''}

  <div style="background: var(--surface2); padding: 16px; border-radius: 8px; margin-top: 16px;">
    <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--text);">📈 6월 목표 달성 예측</h3>
    <div style="display: flex; align-items: center; gap: 16px;">
      <div style="flex: 1;">
        <div style="font-size: 36px; font-weight: 700; color: ${achievementProb >= 80 ? 'var(--green)' : achievementProb >= 50 ? 'var(--yellow)' : 'var(--red)'};">${achievementProb}%</div>
        <div style="color: var(--text3); font-size: 12px; margin-top: 4px;">현재 추세 기준 달성 가능성</div>
      </div>
      <div style="flex: 2; color: var(--text2); font-size: 13px; line-height: 1.6;">
        <strong>예측 MAU:</strong> ${predictedMAU.toLocaleString()}명<br>
        <strong>필요 성장률:</strong> ${growthRate.toFixed(1)}명/일 → ${(targetMAU / daysUntilJune).toFixed(1)}명/일<br>
        <strong>남은 기간:</strong> ${daysUntilJune}일
      </div>
    </div>
  </div>
`;
```

---

## 🎯 UI 구조

### 렌더링 결과 (상위 5개)

```
🎯 철학 기반 AI 추천 (상위 5개)

  ⚠️ 주의: 다음 기능은 baln 철학과 맞지 않습니다
    ❌ 시장_타이밍_알림 → 버핏 철학 위배
    ❌ 단기_수익률_경쟁 → 달리오 철학 위배
    ...

  [1] 맥락_카드_4겹                     종합 9.2
      역사/거시/기관/내포트폴리오 4겹

      철학 점수: 9.0 | 데이터 영향도: 9.0
      📌 달리오 ⭐⭐⭐⭐⭐ / 버핏 ⭐⭐⭐⭐
      💡 "맥락을 제공하면 공포가 이해로 바뀐다"
      📊 D7 리텐션 +10%, 패닉셀 -30%

      🎯 3인 철학자 평가 보기 ▼
        [이승건] ⭐⭐⭐ (6/10) "교육 가치는 높지만..."
        [달리오] ⭐⭐⭐⭐⭐ (10/10) "완벽한 맥락 제공!"
        [버핏] ⭐⭐⭐⭐⭐ (10/10) "매일 읽을 가치 충분"

  [2] 연속_기록_시스템                  종합 8.8
      ...

  [3] 아침_알림_시스템                  종합 8.5
      ...

  📋 전체 기능 목록 보기 (15개) ▼
```

---

## 📊 점수 시스템 상세

### 철학 점수 매트릭스 (일부)

| 기능 | 이승건 (35%) | 달리오 (40%) | 버핏 (25%) | 철학 점수 |
|------|--------------|--------------|------------|----------|
| 맥락_카드_4겹 | 6 | 10 | 10 | **9.0** |
| 연속_기록_시스템 | 10 | 4 | 9 | **7.4** |
| 아침_알림_시스템 | 5 | 4 | 10 | **5.9** |
| 공유_기능 | 5 | 2 | 3 | **3.3** |

### 데이터 영향도 (동적 계산)

```javascript
// 예시: D7 리텐션 < 40%일 때
"연속_기록_시스템": 9점   // 리텐션 개선에 직접 영향
"아침_알림_시스템": 10점  // 리텐션 개선 최고 효과

// D7 리텐션 >= 40%일 때
"연속_기록_시스템": 5점   // 우선순위 낮음
"아침_알림_시스템": 6점
```

---

## 🔧 커스터마이징

### 1. 철학 가중치 조정

`philosophy-recommender.js`에서 수정:

```javascript
// 현재: 맥락 40%, 습관 35%, 매일읽기 25%
return (seunggunScore * 0.35 + dalioScore * 0.40 + buffettScore * 0.25);

// 습관 중심으로 변경: 습관 50%, 맥락 30%, 매일읽기 20%
return (seunggunScore * 0.50 + dalioScore * 0.30 + buffettScore * 0.20);
```

### 2. 새 기능 추가

`PHILOSOPHY_SCORES`와 `FEATURE_DESCRIPTIONS`에 추가:

```javascript
const PHILOSOPHY_SCORES = {
  seunggun: {
    // 기존...
    "VIP_라운지": 7  // 새 기능 추가
  },
  dalio: {
    // 기존...
    "VIP_라운지": 5
  },
  buffett: {
    // 기존...
    "VIP_라운지": 3
  }
};

const FEATURE_DESCRIPTIONS = {
  // 기존...
  "VIP_라운지": {
    desc: "Premium 전용 커뮤니티",
    effect: "전환율 +8%, 충성도 +20%",
    philosophy: "이승건 ⭐⭐⭐⭐ / 달리오 ⭐⭐⭐",
    quote: "'소속감이 이탈을 막는다'"
  }
};
```

### 3. 데이터 영향도 로직 수정

```javascript
function calculateDataImpact(feature, metrics) {
  const impacts = {
    // 기존...
    "VIP_라운지": metrics.conversionRate < 6 ? 9 : 5  // 조건 추가
  };
  return impacts[feature] || 5;
}
```

---

## 🎨 UI 커스터마이징

### 색상 변경

```javascript
const colors = {
  seunggun: '#4CAF50',  // 이승건 = 초록
  dalio: '#2196F3',     // 달리오 = 파랑
  buffett: '#FF9800'    // 버핏 = 주황
};
```

### 카드 레이아웃 조정

`renderFeatureCard()` 함수에서 수정:

```javascript
// 기본: 세로형 카드
<div style="display: flex; flex-direction: column;">

// 변경: 가로형 카드
<div style="display: flex; flex-direction: row;">
```

---

## ⚠️ 주의사항

### 1. 파일 소유권 (병렬 작업 규칙)

- `philosophy-recommender.js`: 철학 시스템 전담 Claude만 수정
- `index.html`: 통합 시 다른 Claude와 조율 필요
- 충돌 방지: 통합 전 git pull 필수

### 2. 브라우저 호환성

- ES6+ 문법 사용 (화살표 함수, 템플릿 리터럴)
- IE11 미지원 (괜찮음, 관리자 대시보드는 모던 브라우저용)

### 3. 성능

- 기능 15개 × 계산 → 0.5ms 이하 (문제 없음)
- 접기/펼치기 사용으로 초기 렌더링 최적화

---

## 📈 사용 예시

### 시나리오 1: D7 리텐션 25% (위험)

```
현재 지표: D7 25%, 전환율 4%, MAU 30
→ 추천 순위:
  1. 아침_알림_시스템 (9.2점)      ← 리텐션 직접 타겟
  2. 연속_기록_시스템 (9.0점)      ← 습관 형성
  3. 맥락_카드_4겹 (8.8점)         ← 안심 제공
```

### 시나리오 2: D7 리텐션 45% (양호)

```
현재 지표: D7 45%, 전환율 5%, MAU 80
→ 추천 순위:
  1. 맥락_카드_4겹 (9.2점)         ← 철학 점수 최고
  2. 또래_비교_넛지 (8.3점)        ← 전환율 개선
  3. 예측_게임_확장 (8.0점)        ← 참여 증가
```

---

## 🔄 업데이트 로그

### v1.0 (2026-02-15)
- 초기 릴리스
- 15개 기능, 3인 철학 점수 시스템
- 철학 위배 경고 시스템
- 접기/펼치기 UI

### 향후 계획
- [ ] 기능별 구현 난이도 추가 (점수에 반영)
- [ ] 월별 목표 연동 (6월 목표 달성률에 따라 가중치 조정)
- [ ] A/B 테스트 결과 자동 반영
- [ ] 사용자 피드백 점수 통합

---

## 💬 문의

철학 시스템 관련 질문은 `CLAUDE.md`의 "팀 워크플로우 가이드" 참조.

**핵심**: 데이터만 보지 말고, baln의 정체성(습관+맥락+매일읽기)에 맞는 기능을 우선 추천
