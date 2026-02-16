# index.html 통합 패치 가이드

## ⚠️ 주의사항

**이 파일을 수정하기 전에 반드시 확인하세요:**

1. 다른 Claude 인스턴스가 `index.html`을 수정 중인지 확인
2. Git 커밋 후 작업 (롤백 가능하도록)
3. 백업 생성: `cp index.html index.html.backup`

---

## 📦 1단계: 스크립트 추가

`index.html`의 `</body>` 태그 **직전**에 추가:

```html
  <!-- 철학 기반 AI 추천 시스템 -->
  <script src="philosophy-recommender.js"></script>
</body>
```

**위치 확인**: 기존 `<script>` 태그들(Supabase, Chart.js 등) 아래에 추가

---

## 🔧 2단계: AI 추천 로직 교체

### 찾을 코드 (2471-2492 라인 근처)

```javascript
        // 의사결정 AI 추천
        const recommendations = [];
        const warnings = [];

        // 집중 과제 추천
        if (d7Retention < targetRetention) {
          recommendations.push('📌 <strong>리텐션 개선</strong>: D7 리텐션이 목표 미달. Phase 10 알림 시스템 집중');
        }
        if (conversionRate < targetConversion) {
          recommendations.push('📌 <strong>전환율 최적화</strong>: Premium 페이월 및 가치 비교 화면 개선 필요');
        }
        if (currentMAU < targetMAU * 0.5) {
          recommendations.push('📌 <strong>사용자 확보</strong>: Phase 11 바이럴 루프 및 공유 기능 우선 구현');
        }

        // 경고 지표
        if (d7Retention < 30) {
          warnings.push('⚠️ <strong>리텐션 위험</strong>: D7 리텐션 30% 미만. 즉시 개선 필요!');
        }
        if (currentMAU < 50 && new Date().getMonth() >= 1) {
          warnings.push('⚠️ <strong>MAU 성장 지연</strong>: 6월 목표 달성 가능성 낮음. 가속 필요');
        }
```

### 교체할 코드

```javascript
        // ══════════════════════════════════════════════════════════════
        // 철학 기반 AI 추천 시스템 (이승건, 달리오, 버핏)
        // ══════════════════════════════════════════════════════════════

        const metricsForPhilosophy = {
          d7Retention: parseFloat(d7Retention),
          conversionRate: parseFloat(conversionRate),
          currentMAU: currentMAU,
          targetMAU: targetMAU
        };

        // 우선순위 계산
        const rankedFeatures = calculatePriorities(metricsForPhilosophy);

        // 기존 경고 시스템 유지
        const warnings = [];
        if (d7Retention < 30) {
          warnings.push('⚠️ <strong>리텐션 위험</strong>: D7 리텐션 30% 미만. 즉시 개선 필요!');
        }
        if (currentMAU < 50 && new Date().getMonth() >= 1) {
          warnings.push('⚠️ <strong>MAU 성장 지연</strong>: 6월 목표 달성 가능성 낮음. 가속 필요');
        }
```

---

## 🎨 3단계: 렌더링 코드 교체

### 찾을 코드 (2501-2528 라인 근처)

```javascript
        document.getElementById('wbs-ai-decisions').innerHTML = `
          <div style="background: ${warnings.length > 0 ? 'rgba(207,102,121,0.1)' : 'var(--surface2)'}; padding: 16px; border-radius: 8px; border-left: 3px solid ${warnings.length > 0 ? 'var(--red)' : 'var(--green)'};">
            <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--text);">🎯 이번 주 집중 과제</h3>
            ${recommendations.length > 0 ? recommendations.map(r => `<div style="color: var(--text2); font-size: 13px; margin-bottom: 8px; line-height: 1.6;">${r}</div>`).join('') : '<div style="color: var(--text3); font-size: 13px;">모든 지표가 목표 달성 중입니다! 🎉</div>'}
          </div>

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

### 교체할 코드

```javascript
        // 6월 목표 달성 예측 (기존 코드 유지)
        const daysFromLaunch = Math.floor((now - new Date('2026-03-01')) / (24 * 60 * 60 * 1000)) + 1;
        const growthRate = daysFromLaunch > 0 ? currentMAU / daysFromLaunch : 0;
        const daysUntilJune = Math.floor((new Date('2026-06-30') - now) / (24 * 60 * 60 * 1000));
        const predictedMAU = Math.round(currentMAU + (growthRate * daysUntilJune));
        const achievementProb = Math.min(100, (predictedMAU / targetMAU * 100)).toFixed(0);

        document.getElementById('wbs-ai-decisions').innerHTML = `
          ${renderRecommendations(metricsForPhilosophy)}

          ${warnings.length > 0 ? `
          <div style="background: rgba(207,102,121,0.15); padding: 16px; border-radius: 8px; border-left: 3px solid var(--red); margin-top: 24px;">
            <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--red);">⚠️ 주의 필요 지표</h3>
            ${warnings.map(w => `<div style="color: var(--text2); font-size: 13px; margin-bottom: 8px; line-height: 1.6;">${w}</div>`).join('')}
          </div>
          ` : ''}

          <div style="background: var(--surface2); padding: 16px; border-radius: 8px; margin-top: 24px;">
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

## ✅ 4단계: 테스트

### 브라우저에서 확인

1. `file:///...../baln-web/admin/philosophy-demo.html` 먼저 열어서 독립 테스트
2. 정상 작동하면 `index.html` 열어서 통합 테스트
3. 콘솔 에러 없는지 확인 (F12 → Console 탭)

### 예상 결과

```
🎯 철학 기반 AI 추천 (상위 5개)

  ⚠️ 주의: 다음 기능은 baln 철학과 맞지 않습니다
    (철학 위배 경고 3개)

  [1] 맥락_카드_4겹 (9.2점)
      ...철학자 평가 접기/펼치기...

  [2] 연속_기록_시스템 (8.8점)
      ...

  ...

  📋 전체 기능 목록 보기 (15개) ▼
```

---

## 🐛 트러블슈팅

### 에러: `calculatePriorities is not defined`

**원인**: `philosophy-recommender.js`가 로드되지 않음

**해결**:
```html
<!-- 경로 확인 -->
<script src="philosophy-recommender.js"></script>

<!-- 절대 경로로 변경 -->
<script src="/admin/philosophy-recommender.js"></script>
```

### 에러: `Cannot read property 'innerHTML' of null`

**원인**: `wbs-ai-decisions` 요소가 없음

**해결**: HTML에서 `<div id="wbs-ai-decisions"></div>` 존재 확인

### UI가 깨짐

**원인**: CSS 변수 미정의

**해결**: `index.html`의 `:root { ... }` 섹션에서 변수 확인

---

## 📊 작동 확인 체크리스트

- [ ] 상위 5개 기능 카드 표시됨
- [ ] 각 카드에 종합 점수, 철학 점수, 데이터 영향도 표시됨
- [ ] 철학 근거 (이승건/달리오/버핏 별점) 표시됨
- [ ] 3인 철학자 평가 접기/펼치기 작동
- [ ] 철학 위배 경고 섹션 표시됨
- [ ] 전체 기능 목록 접기/펼치기 작동
- [ ] 경고 지표 (리텐션 위험 등) 정상 표시
- [ ] 6월 목표 달성 예측 정상 표시

---

## 🔄 롤백 방법

문제 발생 시:

```bash
# 백업에서 복원
cp index.html.backup index.html

# Git으로 복원
git checkout index.html
```

---

## 📝 커밋 메시지 (통합 완료 후)

```bash
git add philosophy-recommender.js philosophy-demo.html PHILOSOPHY_RECOMMENDER_GUIDE.md INTEGRATION_PATCH.md
git commit -m "feat: 철학 기반 AI 추천 시스템 추가 (이승건, 달리오, 버핏)

- 3인 철학 점수 매트릭스 (습관 35%, 맥락 40%, 매일읽기 25%)
- 철학 60% + 데이터 영향도 40% 가중 평균
- 15개 기능 우선순위 자동 계산
- 철학 위배 기능 경고 시스템
- 3인 철학자 평가 UI (접기/펼치기)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🎯 다음 단계

통합 완료 후:

1. **데모 공유**: `philosophy-demo.html`을 팀과 공유하여 피드백 수집
2. **철학 점수 조정**: 실제 사용하면서 가중치 미세 조정
3. **새 기능 추가**: Phase 별로 신규 기능을 `PHILOSOPHY_SCORES`에 추가
4. **A/B 테스트 연동**: 실제 효과 측정 후 `calculateDataImpact()` 로직 개선

---

## 💡 팁

### 빠른 테스트

지표 시나리오별 추천 순위 확인:

```javascript
// 콘솔에서 직접 실행
const testScenarios = [
  { name: "위기", d7Retention: 25, conversionRate: 3, currentMAU: 30, targetMAU: 2000 },
  { name: "성장", d7Retention: 45, conversionRate: 7, currentMAU: 500, targetMAU: 2000 },
  { name: "안정", d7Retention: 50, conversionRate: 8, currentMAU: 1500, targetMAU: 2000 }
];

testScenarios.forEach(scenario => {
  console.log(`\n=== ${scenario.name} 시나리오 ===`);
  const ranked = calculatePriorities(scenario);
  ranked.slice(0, 3).forEach((f, i) => {
    console.log(`${i+1}. ${f.name} (${f.finalScore}점)`);
  });
});
```

### 철학 가중치 A/B 테스트

```javascript
// 맥락 중심 (달리오 50%)
const dalioFocus = (s * 0.30 + d * 0.50 + b * 0.20);

// 습관 중심 (이승건 50%)
const seunggunFocus = (s * 0.50 + d * 0.30 + b * 0.20);

// 비교
console.log('달리오 중심:', dalioFocus);
console.log('이승건 중심:', seunggunFocus);
```
