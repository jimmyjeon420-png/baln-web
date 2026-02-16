/**
 * ══════════════════════════════════════════════════════════════
 * baln 철학 기반 AI 추천 시스템
 * ══════════════════════════════════════════════════════════════
 *
 * 이승건(토스 CEO), 레이 달리오(Bridgewater), 워렌 버핏(Berkshire)
 * 3인의 철학을 기반으로 개발 우선순위를 추천합니다.
 *
 * 핵심 원칙:
 * - 이승건: "보상으로 교육을 감싸라" (습관 형성 35%)
 * - 달리오: "맥락이 공포를 이해로 바꾼다" (맥락 제공 40%)
 * - 버핏: "매일 읽는 사람이 결국 이긴다" (매일 읽기 25%)
 *
 * 최종 점수 = 철학 점수(60%) + 데이터 영향도(40%)
 */

// ══════════════════════════════════════════════════════════════
// 1. 철학 점수 매트릭스
// ══════════════════════════════════════════════════════════════

const PHILOSOPHY_SCORES = {
  // 이승건: 습관 형성 (35% 가중치)
  seunggun: {
    "연속_기록_시스템": 10,
    "출석_보상_강화": 9,
    "예측_게임_확장": 9,
    "배지_시스템_고도화": 8,
    "또래_비교_넛지": 7,
    "맥락_카드_4겹": 6,
    "아침_알림_시스템": 5,
    "공유_기능": 5,
    "Premium_가격_조정": 3,
    "UI_디자인_개선": 2
  },

  // 달리오: 맥락 제공 (40% 가중치)
  dalio: {
    "맥락_카드_4겹": 10,
    "역사적_맥락_추가": 9,
    "거시경제_체인": 9,
    "기관_행동_분석": 8,
    "포트폴리오_영향_분석": 8,
    "예측_게임_확장": 7,
    "또래_비교_넛지": 6,
    "연속_기록_시스템": 4,
    "아침_알림_시스템": 4,
    "공유_기능": 2
  },

  // 버핏: 매일 읽기 (25% 가중치)
  buffett: {
    "아침_알림_시스템": 10,
    "맥락_카드_4겹": 10,
    "예측_복기_시스템": 9,
    "연속_기록_시스템": 9,
    "일일_퀴즈": 8,
    "출석_보상_강화": 7,
    "역사적_맥락_추가": 6,
    "또래_비교_넛지": 4,
    "공유_기능": 3,
    "UI_디자인_개선": 2
  }
};

// 기능별 설명 및 예상 효과
const FEATURE_DESCRIPTIONS = {
  "연속_기록_시스템": {
    desc: "스트릭 시스템 + 손실 회피 카드",
    effect: "D7 리텐션 +15%, 7일 리텐션 +20%",
    philosophy: "이승건 ⭐⭐⭐⭐⭐ / 버핏 ⭐⭐⭐⭐",
    quote: "'보상으로 교육을 감싸면 매일 온다'"
  },
  "맥락_카드_4겹": {
    desc: "역사/거시/기관/내포트폴리오 4겹 레이어",
    effect: "D7 리텐션 +10%, 패닉셀 -30%",
    philosophy: "달리오 ⭐⭐⭐⭐⭐ / 버핏 ⭐⭐⭐⭐",
    quote: "'맥락을 제공하면 공포가 이해로 바뀐다'"
  },
  "아침_알림_시스템": {
    desc: "매일 7:30 맥락 카드 푸시",
    effect: "일일 활성 +40%, DAU +25%",
    philosophy: "버핏 ⭐⭐⭐⭐⭐ / 이승건 ⭐⭐⭐",
    quote: "'매일 읽는 사람이 결국 이긴다'"
  },
  "예측_게임_확장": {
    desc: "3문제/일 + 복기 + 적중 보상",
    effect: "참여율 +35%, 전환율 +8%",
    philosophy: "이승건 ⭐⭐⭐⭐⭐ / 달리오 ⭐⭐⭐",
    quote: "'게임으로 포장하면 학습인 줄 모른다'"
  },
  "출석_보상_강화": {
    desc: "출석 크레딧 2C → 3C + 7일 보너스",
    effect: "DAU +20%, 리텐션 +12%",
    philosophy: "이승건 ⭐⭐⭐⭐⭐ / 버핏 ⭐⭐⭐",
    quote: "'작은 보상이 큰 습관을 만든다'"
  },
  "배지_시스템_고도화": {
    desc: "실력/활동/특수 뱃지 3종 + 프로필 표시",
    effect: "전환율 +10%, 충성도 +15%",
    philosophy: "이승건 ⭐⭐⭐⭐ / 달리오 ⭐⭐",
    quote: "'사회적 증거가 동기를 만든다'"
  },
  "또래_비교_넛지": {
    desc: "같은 자산 구간 평균 비교 + 등급",
    effect: "전환율 +12%, 참여율 +18%",
    philosophy: "이승건 ⭐⭐⭐⭐ / 달리오 ⭐⭐⭐",
    quote: "'비교는 행동을 유도한다'"
  },
  "역사적_맥락_추가": {
    desc: "과거 유사 패턴 + 6개월 후 결과",
    effect: "안심도 +25%, 패닉셀 -20%",
    philosophy: "달리오 ⭐⭐⭐⭐⭐ / 버핏 ⭐⭐⭐",
    quote: "'역사는 반복되지 않지만 운율을 맞춘다'"
  },
  "거시경제_체인": {
    desc: "CPI → 금리 → 기술주 → 삼성전자 체인",
    effect: "이해도 +30%, 맥락 만족도 +20%",
    philosophy: "달리오 ⭐⭐⭐⭐⭐ / 버핏 ⭐⭐",
    quote: "'모든 것은 연결되어 있다'"
  },
  "기관_행동_분석": {
    desc: "외국인/기관 순매수/매도 패턴 분석",
    effect: "Premium 전환율 +15%, 신뢰도 +25%",
    philosophy: "달리오 ⭐⭐⭐⭐ / 버핏 ⭐⭐",
    quote: "'스마트머니가 무엇을 하는지 알면 불안이 사라진다'"
  },
  "포트폴리오_영향_분석": {
    desc: "오늘 시장 움직임이 내 자산에 미치는 영향",
    effect: "개인화 +30%, Premium 전환율 +12%",
    philosophy: "달리오 ⭐⭐⭐⭐ / 이승건 ⭐⭐⭐",
    quote: "'내 돈 이야기일 때 비로소 귀 기울인다'"
  },
  "예측_복기_시스템": {
    desc: "어제 예측 정답/오답 + 해설 + 학습 포인트",
    effect: "학습 효과 +40%, 리텐션 +18%",
    philosophy: "버핏 ⭐⭐⭐⭐⭐ / 이승건 ⭐⭐⭐⭐",
    quote: "'복기가 없는 예측은 도박이다'"
  },
  "일일_퀴즈": {
    desc: "맥락 카드 기반 1문제 퀴즈 + 크레딧",
    effect: "참여율 +25%, 학습 효과 +20%",
    philosophy: "버핏 ⭐⭐⭐⭐ / 이승건 ⭐⭐⭐⭐",
    quote: "'질문이 읽기를 능동적으로 만든다'"
  },
  "공유_기능": {
    desc: "내 분석 결과 공유 + 초대 보상",
    effect: "바이럴 계수 +0.3, MAU 성장 가속",
    philosophy: "이승건 ⭐⭐⭐ / 버핏 ⭐⭐",
    quote: "'입소문이 최고의 마케팅'"
  },
  "Premium_가격_조정": {
    desc: "₩4,900 → ₩3,900 OR 연간 ₩39,000",
    effect: "전환율 +15%, MRR ±0%",
    philosophy: "이승건 ⭐⭐ / 달리오 ⭐",
    quote: "'가격은 마지막 수단'"
  },
  "UI_디자인_개선": {
    desc: "색상/레이아웃/애니메이션 개선",
    effect: "만족도 +5%, 전환율 +2%",
    philosophy: "이승건 ⭐ / 달리오 ⭐",
    quote: "'디자인은 철학 다음'"
  }
};

// 철학 위배 기능 (경고)
const ANTI_PHILOSOPHY_FEATURES = [
  {
    name: "시장_타이밍_알림",
    reason: "버핏 철학 위배: '안심을 판다, 불안을 팔지 않는다'",
    alternative: "대안: 맥락 카드로 시장 상황 설명"
  },
  {
    name: "단기_수익률_경쟁",
    reason: "달리오 철학 위배: '맥락 없는 숫자는 혼란만 준다'",
    alternative: "대안: 장기 학습 성과 리더보드"
  },
  {
    name: "공포_마케팅_푸시",
    reason: "버핏 철학 위배: 공포 마케팅 금지",
    alternative: "대안: 위기 시 맥락 카드 제공"
  },
  {
    name: "과도한_게이미피케이션",
    reason: "이승건 철학 오용: '교육을 게임으로 감싸는 것이지, 게임이 목적이 아니다'",
    alternative: "대안: 보상은 학습과 연결될 때만"
  }
];

// ══════════════════════════════════════════════════════════════
// 2. 점수 계산 함수
// ══════════════════════════════════════════════════════════════

/**
 * 철학 점수 계산 (가중평균)
 * @param {string} feature - 기능 이름
 * @returns {number} 0-10 점수
 */
function calculatePhilosophyScore(feature) {
  const seunggunScore = PHILOSOPHY_SCORES.seunggun[feature] || 0;
  const dalioScore = PHILOSOPHY_SCORES.dalio[feature] || 0;
  const buffettScore = PHILOSOPHY_SCORES.buffett[feature] || 0;

  return (seunggunScore * 0.35 + dalioScore * 0.40 + buffettScore * 0.25);
}

/**
 * 데이터 기반 영향도 계산
 * @param {string} feature - 기능 이름
 * @param {object} metrics - { d7Retention, conversionRate, currentMAU, targetMAU }
 * @returns {number} 0-10 점수
 */
function calculateDataImpact(feature, metrics) {
  const { d7Retention, conversionRate, currentMAU, targetMAU } = metrics;

  const impacts = {
    "연속_기록_시스템": d7Retention < 40 ? 9 : 5,
    "아침_알림_시스템": d7Retention < 35 ? 10 : 6,
    "맥락_카드_4겹": d7Retention < 40 ? 9 : 7,
    "예측_게임_확장": conversionRate < 6 ? 8 : 5,
    "출석_보상_강화": d7Retention < 35 ? 8 : 4,
    "배지_시스템_고도화": conversionRate < 6 ? 7 : 4,
    "또래_비교_넛지": conversionRate < 6 ? 8 : 5,
    "공유_기능": currentMAU < targetMAU * 0.5 ? 9 : 4,
    "역사적_맥락_추가": d7Retention < 40 ? 7 : 5,
    "거시경제_체인": d7Retention < 40 ? 7 : 5,
    "기관_행동_분석": conversionRate < 6 ? 8 : 5,
    "포트폴리오_영향_분석": conversionRate < 6 ? 8 : 5,
    "예측_복기_시스템": d7Retention < 40 ? 8 : 5,
    "일일_퀴즈": d7Retention < 35 ? 7 : 4,
    "Premium_가격_조정": conversionRate < 4 ? 7 : 3,
    "UI_디자인_개선": 3
  };

  return impacts[feature] || 5;
}

/**
 * 최종 우선순위 계산
 * @param {object} metrics - 현재 지표
 * @returns {Array} 정렬된 기능 목록
 */
function calculatePriorities(metrics) {
  const featureList = Object.keys(PHILOSOPHY_SCORES.seunggun);

  return featureList.map(feature => {
    const philosophyScore = calculatePhilosophyScore(feature);
    const dataScore = calculateDataImpact(feature, metrics);
    const finalScore = philosophyScore * 0.6 + dataScore * 0.4;

    return {
      name: feature,
      finalScore: finalScore.toFixed(2),
      philosophyScore: philosophyScore.toFixed(2),
      dataScore: dataScore.toFixed(2),
      seunggunScore: PHILOSOPHY_SCORES.seunggun[feature] || 0,
      dalioScore: PHILOSOPHY_SCORES.dalio[feature] || 0,
      buffettScore: PHILOSOPHY_SCORES.buffett[feature] || 0,
      ...FEATURE_DESCRIPTIONS[feature]
    };
  }).sort((a, b) => b.finalScore - a.finalScore);
}

// ══════════════════════════════════════════════════════════════
// 3. UI 렌더링 함수
// ══════════════════════════════════════════════════════════════

/**
 * 별점 렌더링
 */
function renderStars(score) {
  const fullStars = Math.floor(score / 2);
  const halfStar = score % 2 >= 1;

  let html = '';
  for (let i = 0; i < fullStars; i++) {
    html += '⭐';
  }
  if (halfStar) {
    html += '⭐';
  }
  return html;
}

/**
 * 철학자 평가 카드 렌더링
 */
function renderPhilosopherCard(philosopher, score, name, comment) {
  const colors = {
    seunggun: '#4CAF50',
    dalio: '#2196F3',
    buffett: '#FF9800'
  };

  const names = {
    seunggun: '이승건',
    dalio: '레이 달리오',
    buffett: '워렌 버핏'
  };

  return `
    <div style="background: var(--surface2); padding: 16px; border-radius: 8px; border-left: 4px solid ${colors[philosopher]};">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: ${colors[philosopher]}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px;">
          ${names[philosopher][0]}
        </div>
        <div style="flex: 1;">
          <div style="color: var(--text); font-weight: 600; font-size: 14px;">${names[philosopher]}</div>
          <div style="color: ${colors[philosopher]}; font-size: 18px; font-weight: 700; margin-top: 4px;">
            ${renderStars(score)} (${score}/10)
          </div>
        </div>
      </div>
      <div style="color: var(--text2); font-size: 13px; line-height: 1.6; font-style: italic;">
        "${comment}"
      </div>
    </div>
  `;
}

/**
 * 기능 추천 카드 렌더링
 */
function renderFeatureCard(feature, rank) {
  const badgeColor = rank === 1 ? 'var(--green)' : rank <= 3 ? 'var(--blue)' : 'var(--yellow)';

  // 철학자별 코멘트 (간단 버전)
  const comments = {
    seunggun: feature.seunggunScore >= 8 ? "습관 형성에 완벽!" : feature.seunggunScore >= 5 ? "습관 연결 가능" : "습관과 거리 있음",
    dalio: feature.dalioScore >= 8 ? "맥락 제공 최고!" : feature.dalioScore >= 5 ? "맥락 보완 가능" : "맥락 관련성 낮음",
    buffett: feature.buffettScore >= 8 ? "매일 읽기 유도!" : feature.buffettScore >= 5 ? "학습 효과 있음" : "학습 효과 낮음"
  };

  return `
    <div style="background: var(--surface2); padding: 20px; border-radius: 12px; margin-bottom: 16px; border-left: 4px solid ${badgeColor};">
      <!-- 헤더 -->
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: ${badgeColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px;">
          ${rank}
        </div>
        <div style="flex: 1;">
          <div style="color: var(--text); font-size: 16px; font-weight: 700; margin-bottom: 4px;">
            ${feature.name.replace(/_/g, ' ')}
          </div>
          <div style="color: var(--text2); font-size: 13px;">
            ${feature.desc}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="color: ${badgeColor}; font-size: 28px; font-weight: 700;">
            ${feature.finalScore}
          </div>
          <div style="color: var(--text3); font-size: 11px;">종합 점수</div>
        </div>
      </div>

      <!-- 점수 분해 -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; padding: 12px; background: var(--bg); border-radius: 8px;">
        <div>
          <div style="color: var(--text3); font-size: 11px; margin-bottom: 4px;">철학 점수 (60%)</div>
          <div style="color: var(--green); font-size: 18px; font-weight: 700;">${feature.philosophyScore}</div>
        </div>
        <div>
          <div style="color: var(--text3); font-size: 11px; margin-bottom: 4px;">데이터 영향도 (40%)</div>
          <div style="color: var(--blue); font-size: 18px; font-weight: 700;">${feature.dataScore}</div>
        </div>
      </div>

      <!-- 철학 근거 -->
      <div style="margin-bottom: 16px; padding: 12px; background: var(--bg); border-radius: 8px;">
        <div style="color: var(--text); font-size: 13px; font-weight: 600; margin-bottom: 8px;">
          📌 철학 근거: ${feature.philosophy}
        </div>
        <div style="color: var(--text2); font-size: 13px; line-height: 1.6; font-style: italic;">
          💡 ${feature.quote}
        </div>
      </div>

      <!-- 예상 효과 -->
      <div style="padding: 12px; background: rgba(76,175,80,0.1); border-radius: 8px; border-left: 3px solid var(--green);">
        <div style="color: var(--text); font-size: 13px; font-weight: 600; margin-bottom: 4px;">
          📊 예상 효과
        </div>
        <div style="color: var(--text2); font-size: 13px;">
          ${feature.effect}
        </div>
      </div>

      <!-- 철학자 평가 (접기/펼치기 가능) -->
      <details style="margin-top: 16px;">
        <summary style="color: var(--text2); font-size: 13px; cursor: pointer; font-weight: 600;">
          🎯 3인 철학자 평가 보기
        </summary>
        <div style="display: grid; gap: 12px; margin-top: 12px;">
          ${renderPhilosopherCard('seunggun', feature.seunggunScore, '이승건', comments.seunggun)}
          ${renderPhilosopherCard('dalio', feature.dalioScore, '레이 달리오', comments.dalio)}
          ${renderPhilosopherCard('buffett', feature.buffettScore, '워렌 버핏', comments.buffett)}
        </div>
      </details>
    </div>
  `;
}

/**
 * 철학 위배 경고 렌더링
 */
function renderAntiPhilosophyWarnings() {
  return `
    <div style="background: rgba(207,102,121,0.15); padding: 20px; border-radius: 12px; border-left: 4px solid var(--red); margin-bottom: 24px;">
      <h3 style="font-size: 16px; margin-bottom: 16px; color: var(--red);">
        ⚠️ 주의: 다음 기능은 baln 철학과 맞지 않습니다
      </h3>
      ${ANTI_PHILOSOPHY_FEATURES.map(feature => `
        <div style="background: var(--bg); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
          <div style="color: var(--red); font-size: 14px; font-weight: 700; margin-bottom: 8px;">
            ❌ ${feature.name.replace(/_/g, ' ')}
          </div>
          <div style="color: var(--text2); font-size: 13px; margin-bottom: 8px; line-height: 1.6;">
            → ${feature.reason}
          </div>
          <div style="color: var(--green); font-size: 13px; line-height: 1.6;">
            ✅ ${feature.alternative}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 전체 추천 섹션 렌더링
 */
function renderRecommendations(metrics) {
  const rankedFeatures = calculatePriorities(metrics);
  const top5 = rankedFeatures.slice(0, 5);

  return `
    <div>
      <h2 style="font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
        🎯 철학 기반 AI 추천 (상위 5개)
      </h2>
      <p style="color: var(--text2); font-size: 14px; margin-bottom: 24px; line-height: 1.6;">
        이승건, 레이 달리오, 워렌 버핏의 철학을 기반으로 현재 지표에 맞는 기능을 추천합니다.<br>
        <strong>철학 60%</strong> (습관 35% + 맥락 40% + 매일읽기 25%) + <strong>데이터 영향도 40%</strong>
      </p>

      ${renderAntiPhilosophyWarnings()}

      ${top5.map((feature, idx) => renderFeatureCard(feature, idx + 1)).join('')}

      <details style="margin-top: 24px;">
        <summary style="color: var(--text2); font-size: 14px; cursor: pointer; font-weight: 600; padding: 12px; background: var(--surface2); border-radius: 8px;">
          📋 전체 기능 목록 보기 (${rankedFeatures.length}개)
        </summary>
        <div style="margin-top: 16px;">
          ${rankedFeatures.slice(5).map((feature, idx) => renderFeatureCard(feature, idx + 6)).join('')}
        </div>
      </details>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════
// 4. Export
// ══════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculatePriorities,
    renderRecommendations,
    PHILOSOPHY_SCORES,
    FEATURE_DESCRIPTIONS,
    ANTI_PHILOSOPHY_FEATURES
  };
}
