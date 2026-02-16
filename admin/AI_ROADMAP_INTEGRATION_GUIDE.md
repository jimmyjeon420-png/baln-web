# AI 개발 로드맵 추천 시스템 - 통합 가이드

## 완료된 작업

### 1. UI 섹션 추가 ✅
`index.html`의 WBS 탭에 새로운 섹션이 추가되었습니다:
- 🤖 AI 개발 로드맵 추천 섹션
- 📊 현재 상황 분석 (리텐션/성장/전환율 갭)
- 🎯 다음 주 우선 개발 과제 (ROI 기반 정렬)
- 🔮 시나리오 시뮬레이션 (What-If 분석)
- 📚 AI 학습 현황

### 2. JavaScript 함수 작성 ✅
별도 파일 `/Users/nicenoodle/baln-web/admin/ai-roadmap.js`에 저장됨:
- `loadAIRoadmap()`: 데이터 기반 AI 추천 생성
- `runWhatIfSimulation()`: 시나리오 시뮬레이션
- `FEATURE_IMPACT_DB`: 6개 기능의 예상 영향도 데이터

---

## 🔧 수동 통합 필요 작업

### 옵션 A: 별도 스크립트 파일로 로드 (권장)

`index.html`의 `<head>` 섹션 또는 `</body>` 직전에 추가:

```html
<!-- AI Roadmap 시스템 -->
<script src="ai-roadmap.js"></script>
```

그런 다음, 기존 WBS 탭 이벤트 리스너를 수정하여 `loadAIRoadmap()` 호출 추가:

**수정 위치**: `index.html` 약 3337행 부근

**기존 코드**:
```javascript
if (wbsTabBtn) {
  wbsTabBtn.addEventListener('click', () => {
    setTimeout(() => loadPhaseTasks(), 100);
  });
}
```

**수정 후**:
```javascript
if (wbsTabBtn) {
  wbsTabBtn.addEventListener('click', () => {
    setTimeout(() => {
      loadPhaseTasks();
      loadAIRoadmap();  // 추가
    }, 100);
  });
}
```

---

### 옵션 B: index.html에 직접 통합

`ai-roadmap.js`의 전체 내용을 복사하여 `index.html` 내부의 `</script>` 태그 직전에 붙여넣기.

**삽입 위치**: 약 3330행 (function refreshPhaseTasks() 다음)

---

## 🎯 AI 추천 시스템 작동 방식

### 1. 데이터 수집
- MAU (월간 활성 사용자)
- D7 리텐션 (7일 리텐션율)
- 유료 전환율
- `profiles`, `analytics_events` 테이블 쿼리

### 2. 갭 분석 (Gap Analysis)
```javascript
gaps = {
  retention: 목표 40% - 현재 리텐션,
  growth: 목표 500명 - 현재 MAU,
  conversion: 목표 5% - 현재 전환율
}
```

### 3. 우선순위 결정 로직

**상황별 가중치**:
- **리텐션 위기** (갭 > 10%): 리텐션 영향 기능 우선
- **성장 지연** (MAU 갭 > 300): MAU 증가 기능 우선
- **전환율 부족** (갭 > 3%): Premium 관련 기능 우선
- **균형**: 전체 균형 개선

**ROI 계산**:
```
ROI = 영향도 점수 / 개발 기간(일)
```

### 4. 시나리오 시뮬레이션

사용자가 드롭다운에서 기능 선택 시:
- 현재 KPI + 예상 효과 계산
- 6월 목표 달성률 예측
- MRR(월 반복 수익) 증가 추정
- ROI 시각화

---

## 📊 기능별 예상 영향도 데이터

| 기능 | 리텐션 | MAU | 전환율 | 개발기간 | 신뢰도 |
|------|--------|-----|--------|----------|--------|
| 알림 시스템 | +12% | +30 | +0.5% | 7일 | 90% |
| 연속 기록(스트릭) | +10% | +40 | +1.5% | 10일 | 85% |
| 맥락 카드 개선 | +8% | +50 | +1% | 14일 | 85% |
| 또래 비교 넛지 | +5% | +20 | +1% | 7일 | 70% |
| 공유 기능 | +3% | +100 | +0.5% | 10일 | 75% |
| Premium 가치 비교 | +2% | 0 | +3% | 5일 | 80% |

**중요**: 이 숫자들은 예시값입니다. 실제 데이터가 축적되면 조정하세요.

---

## 🔄 학습 기능 (향후 확장)

### Phase 1: 예측 기록
기능 구현 전 예측값을 DB에 저장:

```sql
CREATE TABLE IF NOT EXISTS feature_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL,
  predicted_retention_boost DECIMAL,
  predicted_mau_boost INTEGER,
  predicted_conversion_boost DECIMAL,
  implementation_date TIMESTAMP,
  measurement_date TIMESTAMP,
  actual_retention_boost DECIMAL,
  actual_mau_boost INTEGER,
  actual_conversion_boost DECIMAL,
  accuracy_score DECIMAL
);
```

### Phase 2: 실제 효과 측정
구현 후 2주 뒤:
1. 해당 기능 구현 전후 KPI 비교
2. 예측 vs 실제 차이 계산
3. AI 모델의 신뢰도 점수 업데이트

### Phase 3: 자동 보정
```javascript
// 실제 효과가 예측보다 낮으면 다음 추천 시 가중치 감소
if (actual < predicted * 0.8) {
  FEATURE_IMPACT_DB[feature_key].confidence -= 10;
}
```

---

## 🎨 UI 커스터마이징

### 색상 변경
- 최우선 기능 배경: `rgba(76, 175, 80, 0.1)` (초록)
- ROI 숫자 색상: `var(--green)`
- 경고 카드: `var(--yellow)`

### 추천 개수 조정
기본: 6개 기능 모두 표시

원하는 개수만 표시하려면 `loadAIRoadmap()` 함수 내:
```javascript
const recommendationsHTML = features
  .slice(0, 3)  // 상위 3개만
  .map((f, index) => { ... })
```

---

## 🐛 트러블슈팅

### 1. "데이터 로딩 실패" 에러
**원인**: Supabase 연결 문제
**해결**:
- Supabase URL과 Service Key 확인
- `profiles`, `analytics_events` 테이블 존재 확인

### 2. 시뮬레이션 결과가 안 나옴
**원인**: `runWhatIfSimulation()` 함수 미로드
**해결**:
- 브라우저 콘솔에서 `typeof runWhatIfSimulation` 확인
- 'undefined'면 스크립트 로딩 실패

### 3. ROI 값이 이상함
**원인**: `FEATURE_IMPACT_DB` 데이터 오류
**해결**:
- 각 기능의 `retentionBoost`, `mauBoost` 등 값 확인
- `timeToImplement`가 0이 아닌지 확인

---

## 📱 모바일 최적화

현재 UI는 반응형이지만, 좁은 화면에서는 일부 조정 필요:

```css
@media (max-width: 768px) {
  #ai-sprint-recommendations > div {
    grid-template-columns: 1fr !important;
  }
}
```

---

## 🚀 다음 단계

1. **✅ 즉시**: `ai-roadmap.js` 로드 + WBS 탭 이벤트 연결
2. **1주 후**: 첫 기능 구현 시작 (AI 추천 1순위)
3. **2주 후**: 실제 효과 측정 시작
4. **1개월 후**: AI 학습 데이터 축적, 추천 정확도 개선

---

## 📝 비즈니스 설명 (비개발자용)

### 이 시스템이 하는 일:
1. **데이터 분석**: 현재 앱의 건강 상태를 진단합니다
2. **문제 파악**: 가장 시급한 문제(리텐션/성장/전환율)를 찾습니다
3. **해결책 추천**: 6가지 기능 중 ROI가 가장 높은 것을 추천합니다
4. **시뮬레이션**: "이 기능을 만들면 어떻게 될까?" 미리 보여줍니다

### 비유:
- **회사 건강검진**: 앱의 혈압(리텐션), 체중(MAU), 혈당(전환율) 측정
- **의사 처방**: "지금은 리텐션이 가장 위험하니 알림 시스템부터 만드세요"
- **약효 시뮬레이션**: "이 약(기능)을 먹으면 2주 후 이렇게 좋아집니다"

### 의사결정 예시:
```
현재: MAU 50명, D7 리텐션 25%, 전환율 2%
↓
AI 분석: "리텐션 위기! 사용자가 1주일 안에 80% 이탈 중"
↓
추천 1위: 알림 시스템 (ROI 5.2)
- 예상 효과: 리텐션 +12%, MAU +30명
- 개발 기간: 7일
- 투자 대비 효과: 최고
↓
의사결정: "알림 시스템부터 만들자"
```

---

## 📞 문의

문제 발생 시 콘솔 로그 확인:
```javascript
console.log('[AI Roadmap]', ...);
```

---

**작성일**: 2026-02-15
**작성자**: Claude (Sonnet 4.5)
**버전**: 1.0.0
