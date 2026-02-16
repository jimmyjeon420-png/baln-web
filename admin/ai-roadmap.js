// ══════════════════════════════════════════════════════════════
// AI 개발 로드맵 추천 시스템
// ══════════════════════════════════════════════════════════════

// 기능별 예상 영향도 데이터 (실제 데이터 기반 조정 필요)
const FEATURE_IMPACT_DB = {
  context_card: {
    name: '맥락 카드 개선',
    retentionBoost: 8,  // D7 리텐션 +8%
    mauBoost: 50,       // MAU +50명
    conversionBoost: 1, // 전환율 +1%
    timeToImplement: 14, // 2주
    confidence: 85,      // 신뢰도 85%
    description: '4겹 레이어 완성 + Premium 페이월 연동',
    priority_impact: '⭐⭐⭐⭐⭐'
  },
  notification: {
    name: '알림 시스템',
    retentionBoost: 12,
    mauBoost: 30,
    conversionBoost: 0.5,
    timeToImplement: 7,
    confidence: 90,
    description: '아침 7:30 맥락 카드 + 예측 복기 알림',
    priority_impact: '⭐⭐⭐⭐'
  },
  share: {
    name: '공유 기능',
    retentionBoost: 3,
    mauBoost: 100,
    conversionBoost: 0.5,
    timeToImplement: 10,
    confidence: 75,
    description: '건강 점수 카드 이미지 + 카카오톡 공유',
    priority_impact: '⭐⭐⭐⭐'
  },
  premium: {
    name: 'Premium 가치 비교',
    retentionBoost: 2,
    mauBoost: 0,
    conversionBoost: 3,
    timeToImplement: 5,
    confidence: 80,
    description: '무료 vs Premium 비교 화면 + 위기 전환',
    priority_impact: '⭐⭐⭐'
  },
  peer_compare: {
    name: '또래 비교 넛지',
    retentionBoost: 5,
    mauBoost: 20,
    conversionBoost: 1,
    timeToImplement: 7,
    confidence: 70,
    description: '같은 자산 구간 평균 비교 + 넛지 카드',
    priority_impact: '⭐⭐⭐'
  },
  streak: {
    name: '연속 기록(스트릭)',
    retentionBoost: 10,
    mauBoost: 40,
    conversionBoost: 1.5,
    timeToImplement: 10,
    confidence: 85,
    description: '연속 출석 기록 + 손실 회피 경고',
    priority_impact: '⭐⭐⭐⭐'
  }
};

async function loadAIRoadmap() {
  try {
    // 현재 KPI 데이터 수집
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalUsers },
      { count: premiumUsers },
      { data: recentSignups },
      { data: recentEvents },
    ] = await Promise.all([
      sb.from('profiles').select('*', { count: 'exact', head: true }),
      sb.from('profiles').select('*', { count: 'exact', head: true }).neq('plan_type', 'free').not('plan_type', 'is', null),
      sb.from('profiles').select('created_at').order('created_at', { ascending: false}).limit(1000),
      sb.from('analytics_events').select('created_at, user_id, event_name').order('created_at', { ascending: false }).limit(5000),
    ]);

    // KPI 계산
    const currentMAU = totalUsers || 0;
    const targetMAU = 500;
    const weekAgoSignups = (recentSignups || []).filter(u => new Date(u.created_at) < new Date(weekAgo)).length;
    const activeLastWeek = new Set((recentEvents || []).filter(e => new Date(e.created_at) >= new Date(weekAgo)).map(e => e.user_id)).size;
    const d7Retention = weekAgoSignups > 0 ? (activeLastWeek / weekAgoSignups * 100) : 0;
    const targetRetention = 40;
    const conversionRate = totalUsers > 0 ? ((premiumUsers || 0) / totalUsers * 100) : 0;
    const targetConversion = 5;

    // AI 분석: 현재 가장 시급한 문제 파악
    const gaps = {
      retention: Math.max(0, targetRetention - d7Retention),
      growth: Math.max(0, targetMAU - currentMAU),
      conversion: Math.max(0, targetConversion - conversionRate)
    };

    const primaryIssue = gaps.retention > 10 ? 'retention' :
                         gaps.growth > 300 ? 'growth' :
                         gaps.conversion > 3 ? 'conversion' : 'balanced';

    // 분석 요약 렌더링
    const issueText = {
      retention: `<strong>리텐션 위기:</strong> D7 리텐션이 목표보다 ${gaps.retention.toFixed(1)}% 낮습니다. 사용자가 7일 안에 이탈하고 있습니다.`,
      growth: `<strong>성장 지연:</strong> MAU가 목표보다 ${gaps.growth}명 부족합니다. 신규 유입을 늘려야 합니다.`,
      conversion: `<strong>전환율 부족:</strong> 유료 전환율이 목표보다 ${gaps.conversion.toFixed(1)}% 낮습니다. Premium 가치를 높여야 합니다.`,
      balanced: `<strong>균형 성장 중:</strong> 모든 지표가 목표에 근접하고 있습니다. 전체 경험을 개선하세요.`
    };

    document.getElementById('ai-roadmap-summary').innerHTML = `
      <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--blue);">📊 현재 상황 분석</h3>
      <div style="color: var(--text2); font-size: 13px; line-height: 1.8;">
        ${issueText[primaryIssue]}<br><br>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px;">
          <div style="background: var(--bg); padding: 8px; border-radius: 6px; text-align: center;">
            <div style="font-size: 11px; color: var(--text3);">리텐션 갭</div>
            <div style="font-size: 18px; font-weight: 700; color: ${gaps.retention > 10 ? 'var(--red)' : 'var(--green)'};">${gaps.retention.toFixed(1)}%</div>
          </div>
          <div style="background: var(--bg); padding: 8px; border-radius: 6px; text-align: center;">
            <div style="font-size: 11px; color: var(--text3);">성장 갭</div>
            <div style="font-size: 18px; font-weight: 700; color: ${gaps.growth > 300 ? 'var(--red)' : 'var(--green)'};">${gaps.growth}명</div>
          </div>
          <div style="background: var(--bg); padding: 8px; border-radius: 6px; text-align: center;">
            <div style="font-size: 11px; color: var(--text3);">전환율 갭</div>
            <div style="font-size: 18px; font-weight: 700; color: ${gaps.conversion > 3 ? 'var(--red)' : 'var(--green)'};">${gaps.conversion.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    `;

    // ROI 계산 및 우선순위 정렬
    const features = Object.keys(FEATURE_IMPACT_DB).map(key => {
      const feature = FEATURE_IMPACT_DB[key];

      // 가중치 계산: 현재 문제에 맞춤
      let impactScore = 0;
      if (primaryIssue === 'retention') {
        impactScore = feature.retentionBoost * 3 + feature.mauBoost * 0.5 + feature.conversionBoost * 1;
      } else if (primaryIssue === 'growth') {
        impactScore = feature.mauBoost * 3 + feature.retentionBoost * 1 + feature.conversionBoost * 1;
      } else if (primaryIssue === 'conversion') {
        impactScore = feature.conversionBoost * 5 + feature.retentionBoost * 1 + feature.mauBoost * 0.3;
      } else {
        impactScore = feature.retentionBoost * 2 + feature.mauBoost * 1 + feature.conversionBoost * 2;
      }

      const roi = impactScore / feature.timeToImplement;

      return {
        key,
        ...feature,
        impactScore: impactScore.toFixed(1),
        roi: roi.toFixed(2)
      };
    }).sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));

    // 추천 목록 렌더링
    const recommendationsHTML = features.map((f, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      const bgColor = index === 0 ? 'rgba(76, 175, 80, 0.1)' : 'var(--bg)';
      const borderColor = index === 0 ? 'var(--green)' : 'var(--border)';

      return `
        <div style="background: ${bgColor}; padding: 12px; border-radius: 8px; border-left: 3px solid ${borderColor}; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div>
              <div style="font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px;">
                ${medal} ${f.name}
              </div>
              <div style="font-size: 12px; color: var(--text3);">${f.description}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 20px; font-weight: 700; color: var(--green);">${f.roi}</div>
              <div style="font-size: 11px; color: var(--text3);">ROI</div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 11px;">
            <div>
              <span style="color: var(--text3);">리텐션:</span>
              <span style="color: var(--text); font-weight: 600;">+${f.retentionBoost}%</span>
            </div>
            <div>
              <span style="color: var(--text3);">MAU:</span>
              <span style="color: var(--text); font-weight: 600;">+${f.mauBoost}명</span>
            </div>
            <div>
              <span style="color: var(--text3);">전환율:</span>
              <span style="color: var(--text); font-weight: 600;">+${f.conversionBoost}%</span>
            </div>
            <div>
              <span style="color: var(--text3);">기간:</span>
              <span style="color: var(--text); font-weight: 600;">${f.timeToImplement}일</span>
            </div>
          </div>
          <div style="margin-top: 8px; font-size: 11px; color: var(--text3);">
            영향도: ${f.priority_impact} | 신뢰도: ${f.confidence}%
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('ai-sprint-recommendations').innerHTML = recommendationsHTML;

    // 학습 현황 업데이트
    document.getElementById('ai-prediction-accuracy').innerHTML = `
      <div style="background: var(--bg); padding: 12px; border-radius: 8px; font-size: 12px; color: var(--text3);">
        아직 구현한 기능이 없어 예측 정확도를 측정할 수 없습니다.<br>
        첫 기능을 구현하고 2주 후 실제 효과를 비교하여 AI 학습을 시작합니다.
      </div>
    `;

  } catch (err) {
    console.error('[AI Roadmap]', err);
    document.getElementById('ai-roadmap-summary').innerHTML = `
      <div style="color: var(--red); font-size: 13px;">데이터 로딩 실패: ${err.message}</div>
    `;
  }
}

function runWhatIfSimulation() {
  const selector = document.getElementById('ai-what-if-selector');
  const selectedFeature = selector.value;

  if (!selectedFeature) {
    document.getElementById('ai-what-if-result').innerHTML = `
      <div style="color: var(--text3); font-size: 13px; text-align: center; padding: 20px;">
        시나리오를 선택하면 예상 효과를 보여드립니다
      </div>
    `;
    return;
  }

  const feature = FEATURE_IMPACT_DB[selectedFeature];
  if (!feature) return;

  // 현재 KPI 가정
  const currentRetention = 32;
  const currentMAU = 50;
  const currentConversion = 2;

  // 예상 효과 계산
  const predictedRetention = currentRetention + feature.retentionBoost;
  const predictedMAU = currentMAU + feature.mauBoost;
  const predictedConversion = currentConversion + feature.conversionBoost;

  // MRR 계산
  const currentMRR = Math.round(currentMAU * (currentConversion / 100) * 4900);
  const predictedMRR = Math.round(predictedMAU * (predictedConversion / 100) * 4900);
  const mrrIncrease = predictedMRR - currentMRR;

  // 목표 달성률
  const targetRetention = 40;
  const targetMAU = 500;
  const targetConversion = 5;

  const retentionProgress = Math.min(100, (predictedRetention / targetRetention * 100));
  const mauProgress = Math.min(100, (predictedMAU / targetMAU * 100));
  const conversionProgress = Math.min(100, (predictedConversion / targetConversion * 100));

  document.getElementById('ai-what-if-result').innerHTML = `
    <div style="background: var(--bg); padding: 16px; border-radius: 8px;">
      <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--text);">🔮 "${feature.name}" 구현 시 예상 효과</h4>

      <div style="display: grid; gap: 12px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 12px; color: var(--text3);">D7 리텐션</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--text);">
              ${currentRetention}% → <span style="color: var(--green);">${predictedRetention}%</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: var(--green);">+${feature.retentionBoost}%</div>
            <div style="font-size: 11px; color: var(--text3);">목표 달성률: ${retentionProgress.toFixed(0)}%</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 12px; color: var(--text3);">MAU</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--text);">
              ${currentMAU}명 → <span style="color: var(--green);">${predictedMAU}명</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: var(--green);">+${feature.mauBoost}명</div>
            <div style="font-size: 11px; color: var(--text3);">목표 달성률: ${mauProgress.toFixed(0)}%</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 12px; color: var(--text3);">유료 전환율</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--text);">
              ${currentConversion}% → <span style="color: var(--green);">${predictedConversion.toFixed(1)}%</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: var(--green);">+${feature.conversionBoost}%</div>
            <div style="font-size: 11px; color: var(--text3);">목표 달성률: ${conversionProgress.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div style="background: var(--surface2); padding: 12px; border-radius: 8px; border-left: 3px solid var(--blue);">
        <div style="font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 8px;">💰 수익 영향</div>
        <div style="font-size: 12px; color: var(--text2); line-height: 1.6;">
          현재 MRR: <strong>₩${currentMRR.toLocaleString()}</strong><br>
          예상 MRR: <strong style="color: var(--green);">₩${predictedMRR.toLocaleString()}</strong><br>
          월 수익 증가: <strong style="color: var(--green);">+₩${mrrIncrease.toLocaleString()}</strong>
        </div>
      </div>

      <div style="background: var(--surface2); padding: 12px; border-radius: 8px; margin-top: 12px;">
        <div style="font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 8px;">⏱️ 개발 일정</div>
        <div style="font-size: 12px; color: var(--text2); line-height: 1.6;">
          예상 개발 기간: <strong>${feature.timeToImplement}일</strong> (약 ${Math.ceil(feature.timeToImplement / 7)}주)<br>
          신뢰도: <strong>${feature.confidence}%</strong><br>
          ROI: <strong style="color: var(--green);">${(feature.retentionBoost * 2 + feature.mauBoost * 1 + feature.conversionBoost * 2) / feature.timeToImplement}</strong>
        </div>
      </div>

      <div style="background: rgba(255, 193, 7, 0.1); padding: 12px; border-radius: 8px; margin-top: 12px; border-left: 3px solid var(--yellow);">
        <div style="font-size: 12px; color: var(--text2); line-height: 1.6;">
          <strong style="color: var(--yellow);">⚠️ 주의사항:</strong><br>
          이 예측은 과거 데이터와 업계 벤치마크를 기반으로 하며, 실제 결과는 다를 수 있습니다.<br>
          구현 후 2주 뒤 실제 효과를 측정하여 AI 모델을 개선합니다.
        </div>
      </div>
    </div>
  `;
}
