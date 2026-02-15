// ══════════════════════════════════════════════════════════════
// ALERT SYSTEM (경고 시스템)
// baln Admin Dashboard - 자동 경고 및 알림 시스템
// ══════════════════════════════════════════════════════════════

const dismissedAlerts = new Set(JSON.parse(localStorage.getItem('dismissedAlerts') || '[]'));

function renderAlertBanners(metrics) {
  const {
    d7Retention, targetRetention,
    currentMAU, targetMAU, mauProgress,
    conversionRate, targetConversion,
    growthRate, daysFromLaunch, achievementProb
  } = metrics;

  const container = document.getElementById('wbs-alerts-container');
  if (!container) return;

  const alerts = [];

  // ========== 위기 경고 (Critical) ==========

  // D7 리텐션 < 30% → 즉시 경고
  if (d7Retention < 30 && !dismissedAlerts.has('retention-critical')) {
    alerts.push({
      id: 'retention-critical',
      type: 'critical',
      icon: '🚨',
      title: 'D7 리텐션 위험 수준',
      message: `현재 D7 리텐션이 <span class="alert-metric">${d7Retention}%</span>로 목표 <span class="alert-metric">${targetRetention}%</span>에 크게 미달합니다. 사용자들이 앱을 떠나고 있습니다!`,
      actions: [
        { label: '알림 시스템 점검', primary: true, onClick: () => { switchTab('content'); dismissAlert('retention-critical'); } },
        { label: '온보딩 개선 계획', primary: false, onClick: () => { alert('온보딩 플로우를 단순화하고 첫 성공 경험을 빠르게 제공하세요.'); } }
      ]
    });
  }

  // MAU 성장률 < 목표 대비 50% → 경고
  if (parseFloat(mauProgress) < 50 && daysFromLaunch > 7 && !dismissedAlerts.has('mau-critical')) {
    alerts.push({
      id: 'mau-critical',
      type: 'critical',
      icon: '📉',
      title: 'MAU 성장 위험',
      message: `현재 MAU가 <span class="alert-metric">${currentMAU}명</span>으로 목표 대비 <span class="alert-metric">${mauProgress}%</span>만 달성했습니다. 6월 목표 달성이 어렵습니다.`,
      actions: [
        { label: '바이럴 전략 검토', primary: true, onClick: () => { alert('공유 기능, 초대 보너스, 입소문 유도 전략을 강화하세요.'); } },
        { label: '마케팅 채널 점검', primary: false, onClick: () => { switchTab('analytics'); dismissAlert('mau-critical'); } }
      ]
    });
  }

  // 유료 전환율 < 3% → 경고
  if (conversionRate < 3 && currentMAU >= 50 && !dismissedAlerts.has('conversion-critical')) {
    alerts.push({
      id: 'conversion-critical',
      type: 'critical',
      icon: '💸',
      title: '유료 전환율 저조',
      message: `현재 전환율이 <span class="alert-metric">${conversionRate}%</span>로 목표 <span class="alert-metric">${targetConversion}%</span>에 미달합니다. 수익화에 문제가 있습니다.`,
      actions: [
        { label: 'Premium 가치 개선', primary: true, onClick: () => { alert('Premium 전용 기능(맥락 카드 전체, AI 진단 3회/일)의 가치를 명확히 보여주세요.'); } },
        { label: '페이월 위치 조정', primary: false, onClick: () => { alert('위기 전환 시점(시장 -3% 급락)에 Premium 잠금을 활성화하세요.'); } }
      ]
    });
  }

  // ========== 경고 (Warning) ==========

  // 2주 연속 하락 추세 감지 (간단 버전: 성장률이 낮음)
  if (growthRate < 3 && daysFromLaunch > 14 && !dismissedAlerts.has('growth-warning')) {
    alerts.push({
      id: 'growth-warning',
      type: 'warning',
      icon: '⚠️',
      title: '성장 정체 감지',
      message: `일평균 성장률이 <span class="alert-metric">${growthRate.toFixed(1)}명/일</span>로 저조합니다. <span class="trend-badge down">↓ 하락 추세</span>`,
      actions: [
        { label: '사용자 피드백 확인', primary: true, onClick: () => { switchTab('lounge'); dismissAlert('growth-warning'); } },
        { label: '기능 로드맵 점검', primary: false, onClick: () => { alert('핵심 기능(맥락 카드, 예측 게임)이 제대로 작동하는지 확인하세요.'); } }
      ]
    });
  }

  // 리텐션 개선 필요 (30~40% 사이)
  if (d7Retention >= 30 && d7Retention < targetRetention && !dismissedAlerts.has('retention-warning')) {
    alerts.push({
      id: 'retention-warning',
      type: 'warning',
      icon: '📊',
      title: '리텐션 개선 필요',
      message: `D7 리텐션이 <span class="alert-metric">${d7Retention}%</span>로 목표에 근접했지만 아직 부족합니다.`,
      actions: [
        { label: '알림 최적화', primary: true, onClick: () => { alert('매일 07:30 맥락 카드 알림이 제대로 전송되는지 확인하세요.'); } },
        { label: '습관 루프 강화', primary: false, onClick: () => { alert('예측→복기→보상 루프가 원활한지 점검하세요.'); } }
      ]
    });
  }

  // ========== 성공 알림 (Success) ==========

  // 목표 달성 시 축하 메시지
  if (d7Retention >= targetRetention && currentMAU >= targetMAU * 0.8 && !dismissedAlerts.has('success-milestone')) {
    alerts.push({
      id: 'success-milestone',
      type: 'success',
      icon: '🎉',
      title: '목표 달성!',
      message: `축하합니다! D7 리텐션 <span class="alert-metric">${d7Retention}%</span> 달성, MAU도 목표에 근접했습니다. <span class="trend-badge up">↑ 상승 추세</span>`,
      actions: [
        { label: '다음 목표 설정', primary: true, onClick: () => { dismissAlert('success-milestone'); } }
      ]
    });
  }

  // 전주 대비 개선 시 격려 메시지
  if (d7Retention >= 35 && d7Retention < targetRetention && growthRate >= 5 && !dismissedAlerts.has('improvement-info')) {
    alerts.push({
      id: 'improvement-info',
      type: 'info',
      icon: '✨',
      title: '개선 중입니다',
      message: `리텐션과 성장률이 개선되고 있습니다! 현재 속도를 유지하세요. <span class="trend-badge up">↑ 상승</span>`,
      actions: [
        { label: '확인', primary: false, onClick: () => { dismissAlert('improvement-info'); } }
      ]
    });
  }

  // ========== 렌더링 ==========

  if (alerts.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = alerts.map(alert => `
    <div class="alert-banner ${alert.type}" id="alert-${alert.id}">
      <div class="alert-icon">${alert.icon}</div>
      <div class="alert-content">
        <div class="alert-title">${alert.title}</div>
        <div class="alert-message">${alert.message}</div>
        ${alert.actions && alert.actions.length > 0 ? `
          <div class="alert-actions">
            ${alert.actions.map((action, idx) => `
              <button class="alert-action-btn ${action.primary ? 'primary' : 'secondary'}" onclick="alertActionHandlers['${alert.id}_${idx}']()">
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <button class="alert-dismiss" onclick="dismissAlert('${alert.id}')">&times;</button>
    </div>
  `).join('');

  // 액션 핸들러 등록
  window.alertActionHandlers = {};
  alerts.forEach(alert => {
    if (alert.actions) {
      alert.actions.forEach((action, idx) => {
        window.alertActionHandlers[`${alert.id}_${idx}`] = action.onClick;
      });
    }
  });
}

function dismissAlert(alertId) {
  dismissedAlerts.add(alertId);
  localStorage.setItem('dismissedAlerts', JSON.stringify([...dismissedAlerts]));
  const alertElement = document.getElementById(`alert-${alertId}`);
  if (alertElement) {
    alertElement.style.animation = 'slideDown 0.3s ease-out reverse';
    setTimeout(() => alertElement.remove(), 300);
  }
}
