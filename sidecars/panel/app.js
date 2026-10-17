// Live Stats Monitor Frontend with Bilingual (AR/EN) & In-App Updater Support

const I18N = {
  ar: {
    dir: 'rtl',
    switchBtnLabel: 'English',
    noActiveChat: 'لا توجد محادثة نشطة',
    idle: 'جاهز (Idle)',
    running: 'يعمل الآن (Running)',
    subagentRunning: (count) => `وكيل فرعي يعمل (${count})`,
    contextWindow: 'مساحة السياق (Context Window)',
    tokens: 'توكن',
    unitContext: '/ 1,000,000 توكن',
    currentTask: '⚡ المهمة الحالية (Current Task)',
    taskCompleted: 'مكتملة',
    taskRunning: 'جارية الآن...',
    taskTokens: 'توكنز المهمة',
    steps: 'الخطوات',
    duration: 'المدة الزمنية',
    subagentsTaskHint: '🤖 تتضمن توكنز وكلاء فرعيين للمهمة: ',
    taskModelsDist: 'توزيع نماذج هذه المهمة:',
    modelsBreakdown: '✨ استهلاك النماذج (Models Breakdown)',
    modelCount: (c) => `${c} ${c === 1 ? 'نموذج' : 'نماذج'}`,
    activeNow: 'نشط الآن',
    multiModelBadge: (c) => `${c} نماذج نشطة`,
    subagentsTeam: '🤖 فريق الوكلاء الفرعيين (Subagents)',
    subagentsCount: (c) => `${c} وكيل فرعي`,
    subagentsTotalTokens: 'إجمالي توكنز الوكلاء',
    subagentsInOut: 'تفصيل (مدخلات | مخرجات)',
    subagentsSteps: 'إجمالي خطوات الوكلاء',
    tokensDetail: '📊 تفاصيل التوكنز التراكمية (Tokens Detail)',
    inputPromptCache: 'المدخلات (Prompt / Cache)',
    outputGenerated: 'المخرجات (Generated)',
    grandTotalTokens: 'الإجمالي الشامل (المحادثة + الوكلاء)',
    networkMb: 'استهلاك الإنترنت الفعلي',
    totalSessionSteps: 'إجمالي خطوات الجلسة والوكلاء',
    liveRefresh: 'تحديث مباشر كل ثانيتين ⚡',
    stepUnit: 'خطوة',
    upToDate: 'محدّث',
    updateAvailable: 'تحديث متاح! اضغط للتثبيت',
    checkingUpdate: 'جاري فحص التحديثات...',
    updating: 'جاري التحديث...',
    updateSuccess: 'تم التحديث بنجاح!',
    updateFailed: 'فشل التحديث',
    settingsTitle: 'الإعدادات والتحديثات',
    settingsLangLabel: 'لغة الواجهة (Interface Language):',
    updateCenter: 'مركز التحديثات المباشرة',
    installedVersion: (v) => `الإصدار المثبت: v${v}`,
    updateCenterDesc: 'فحص وتثبيت التحديثات الجديدة مباشرة من مستودع GitHub بنقرة زر دون الحاجة لفتح سطر الأوامر.',
    checkUpdateNow: 'فحص وتثبيت التحديثات الآن',
    installUpdateNow: 'تثبيت التحديث الجديد الآن 🚀',
    repoKey: 'مستودع المشروع:',
    autoUpdateStatus: 'الفحص التلقائي:',
    enabledStatus: 'مفعّل (Auto-check Enabled)'
  },
  en: {
    dir: 'ltr',
    switchBtnLabel: 'العربية',
    noActiveChat: 'No Active Chat',
    idle: 'Idle',
    running: 'Running...',
    subagentRunning: (count) => `Subagent running (${count})`,
    contextWindow: 'Context Window Usage',
    tokens: 'tokens',
    unitContext: '/ 1,000,000 tokens',
    currentTask: '⚡ Current Task',
    taskCompleted: 'Completed',
    taskRunning: 'Running...',
    taskTokens: 'Task Tokens',
    steps: 'Steps',
    duration: 'Duration',
    subagentsTaskHint: '🤖 Includes task subagent tokens: ',
    taskModelsDist: 'Task Models Distribution:',
    modelsBreakdown: '✨ Models Token Breakdown',
    modelCount: (c) => `${c} ${c === 1 ? 'Model' : 'Models'}`,
    activeNow: 'Active Now',
    multiModelBadge: (c) => `${c} Active Models`,
    subagentsTeam: '🤖 Subagents Swarm',
    subagentsCount: (c) => `${c} Subagent${c === 1 ? '' : 's'}`,
    subagentsTotalTokens: 'Subagents Total Tokens',
    subagentsInOut: 'Breakdown (In | Out)',
    subagentsSteps: 'Subagents Total Steps',
    tokensDetail: '📊 Cumulative Tokens Detail',
    inputPromptCache: 'Input Tokens (Prompt / Cache)',
    outputGenerated: 'Output Tokens (Generated)',
    grandTotalTokens: 'Grand Total (Session + Subagents)',
    networkMb: 'Estimated Network Traffic',
    totalSessionSteps: 'Total Steps (Main + Subagents)',
    liveRefresh: 'Live auto-refresh every 2s ⚡',
    stepUnit: 'steps',
    upToDate: 'Up to date',
    updateAvailable: 'Update Available! Click to Install',
    checkingUpdate: 'Checking updates...',
    updating: 'Updating...',
    updateSuccess: 'Updated successfully!',
    updateFailed: 'Update failed',
    settingsTitle: 'Settings & Updates',
    settingsLangLabel: 'Interface Language:',
    updateCenter: 'Live Update Center',
    installedVersion: (v) => `Installed Version: v${v}`,
    updateCenterDesc: 'Check and install updates directly from GitHub with 1-click without using command line.',
    checkUpdateNow: 'Check & Install Updates Now',
    installUpdateNow: 'Install New Update Now 🚀',
    repoKey: 'Repository:',
    autoUpdateStatus: 'Auto Check:',
    enabledStatus: 'Enabled'
  }
};

let currentLang = localStorage.getItem('live_stats_lang') || 'ar';
let lastFetchedData = null;
let updateAvailableState = false;

function t(key, arg) {
  const dict = I18N[currentLang] || I18N.ar;
  const val = dict[key];
  if (typeof val === 'function') return val(arg);
  return val || key;
}

function applyLanguage(lang) {
  currentLang = (lang === 'en') ? 'en' : 'ar';
  localStorage.setItem('live_stats_lang', currentLang);
  document.documentElement.lang = currentLang;
  document.documentElement.dir = I18N[currentLang].dir;

  // Update static elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update switcher button label
  const langBtnText = document.getElementById('lang-btn-text');
  if (langBtnText) langBtnText.textContent = I18N[currentLang].switchBtnLabel;

  // Update modal language options
  const optAr = document.getElementById('lang-opt-ar');
  const optEn = document.getElementById('lang-opt-en');
  if (optAr && optEn) {
    if (currentLang === 'ar') {
      optAr.classList.add('active');
      optEn.classList.remove('active');
    } else {
      optEn.classList.add('active');
      optAr.classList.remove('active');
    }
  }

  // Re-render dynamic stats if available
  if (lastFetchedData) {
    renderStats(lastFetchedData);
  }
}

function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('en-US');
}

// Render dynamic data into UI
function renderStats(data) {
  lastFetchedData = data;
  if (!data.active) return;

  // Header: Active Model & Multi-model badge
  document.getElementById('model-name').textContent = data.modelName || 'Gemini 3.8 Flash';
  const multiTag = document.getElementById('model-multi-tag');
  if (data.isMultiModel && data.modelsBreakdown && data.modelsBreakdown.length > 1) {
    multiTag.style.display = 'inline-flex';
    multiTag.textContent = t('multiModelBadge', data.modelsBreakdown.length);
  } else {
    multiTag.style.display = 'none';
  }

  // Activity State Pill
  const statusPill = document.getElementById('status-pill');
  const statusText = document.getElementById('status-text');
  if (data.isAgentActive) {
    statusPill.className = 'status-pill active';
    if (data.subagents && data.subagents.activeCount > 0) {
      statusText.textContent = t('subagentRunning', data.subagents.activeCount);
    } else {
      statusText.textContent = t('running');
    }
  } else {
    statusPill.className = 'status-pill idle';
    statusText.textContent = t('idle');
  }

  // Hero: Context Window Meter
  const currentContext = data.currentContext || 0;
  const percentage = parseFloat(data.contextPercentage || 0);
  document.getElementById('current-context').textContent = formatNumber(currentContext);
  document.getElementById('context-percentage').textContent = `${percentage.toFixed(1)}%`;
  document.getElementById('unit-context').textContent = t('unitContext');

  const bar = document.getElementById('context-bar');
  bar.style.width = `${Math.min(100, Math.max(1, percentage))}%`;

  // SECTION 1: Current Task Card
  const task = data.currentTask || {};
  document.getElementById('task-tokens').textContent = formatNumber(task.tokens || 0);
  document.getElementById('task-in-out').textContent = 
    `(In: ${formatNumber(task.inputTokens || 0)} | Out: ${formatNumber(task.outputTokens || 0)})`;
  document.getElementById('task-steps').textContent = formatNumber(task.steps || 0);
  document.getElementById('task-duration').textContent = `${task.durationSeconds || 0}s`;

  const taskTag = document.getElementById('task-status-tag');
  if (task.isActive) {
    taskTag.className = 'tag-small running';
    taskTag.textContent = t('taskRunning');
  } else {
    taskTag.className = 'tag-small';
    taskTag.textContent = t('taskCompleted');
  }

  // Task Subagent Hint
  const subHint = document.getElementById('task-subagent-hint');
  if (task.subagentTokens && task.subagentTokens > 0) {
    subHint.style.display = 'block';
    document.getElementById('task-subagent-val').textContent = `${formatNumber(task.subagentTokens)} ${t('tokens')}`;
  } else {
    subHint.style.display = 'none';
  }

  // Task Models Breakdown (if mixed models in current task)
  const taskModelsSec = document.getElementById('task-models-section');
  const taskModelsChips = document.getElementById('task-models-chips');
  if (task.isMultiModel && task.modelsBreakdown && task.modelsBreakdown.length > 1) {
    taskModelsSec.style.display = 'block';
    taskModelsChips.innerHTML = task.modelsBreakdown.map(m => `
      <span class="task-model-chip" style="background: ${m.bg}; border: 1px solid ${m.border}; color: ${m.color}">
        <span class="chip-dot" style="background: ${m.color}"></span>
        <strong>${m.name}:</strong> ${formatNumber(m.totalTokens)} (${m.percentage}%)
      </span>
    `).join('');
  } else {
    taskModelsSec.style.display = 'none';
  }

  // SECTION 2: Models Breakdown
  const models = data.modelsBreakdown || [];
  const modelsCountBadge = document.getElementById('models-count-badge');
  const modelsTrack = document.getElementById('models-progress-track');
  const modelsList = document.getElementById('models-list');

  if (models.length > 0) {
    modelsCountBadge.textContent = t('modelCount', models.length);
    
    // Proportional multi-segment bar
    modelsTrack.innerHTML = models.map(m => `
      <div class="model-bar-segment" 
           style="width: ${Math.max(2, parseFloat(m.percentage))}%; background: ${m.color};" 
           title="${m.name}: ${formatNumber(m.totalTokens)} ${t('tokens')} (${m.percentage}%)">
      </div>
    `).join('');

    // Models details list
    modelsList.innerHTML = models.map(m => `
      <div class="model-item ${m.isActive ? 'model-item-active' : ''}">
        <div class="model-item-header">
          <div class="model-item-title">
            <span class="model-dot" style="background: ${m.color}; box-shadow: 0 0 6px ${m.color}"></span>
            <span class="model-title-text">${m.name}</span>
            ${m.isActive ? `<span class="tag-mini-active">${t('activeNow')}</span>` : ''}
          </div>
          <span class="model-pct" style="color: ${m.color}; background: ${m.bg}; border: 1px solid ${m.border}">${m.percentage}%</span>
        </div>
        <div class="model-item-sub">
          <span class="model-tok-val" style="color: ${m.color}">${formatNumber(m.totalTokens)} ${t('tokens')}</span>
          <span class="model-in-out text-muted">(In: ${formatNumber(m.inputTokens)} | Out: ${formatNumber(m.outputTokens)})</span>
          <span class="model-steps text-muted">• ${formatNumber(m.steps)} ${t('stepUnit')}</span>
        </div>
      </div>
    `).join('');
  }

  // SECTION 3: Subagents Section
  const subagentsSection = document.getElementById('subagents-section');
  if (data.subagents && data.subagents.count > 0) {
    subagentsSection.style.display = 'block';
    document.getElementById('subagents-count-badge').textContent = t('subagentsCount', data.subagents.count);
    document.getElementById('subagents-tokens').textContent = `${formatNumber(data.subagents.totalTokens)} ${t('tokens')}`;
    document.getElementById('subagents-in-out').textContent = 
      `In: ${formatNumber(data.subagents.inputTokens)} | Out: ${formatNumber(data.subagents.outputTokens)}`;
    document.getElementById('subagents-steps').textContent = `${formatNumber(data.subagents.steps)} ${t('stepUnit')}`;
  } else {
    subagentsSection.style.display = 'none';
  }

  // SECTION 4: Cumulative Tokens Detail
  document.getElementById('total-input-tokens').textContent = formatNumber(data.totalInputTokens || 0);
  document.getElementById('total-output-tokens').textContent = formatNumber(data.totalOutputTokens || 0);
  document.getElementById('total-tokens').textContent = `${formatNumber(data.totalSessionTokens || 0)} ${t('tokens')}`;

  // SECTION 5: Summary
  document.getElementById('network-mb').textContent = `${data.networkMb || '0.00'} MB`;
  document.getElementById('step-count').textContent = formatNumber(data.stepCount || 0);
}

// Fetch stats continuously
async function updateStats() {
  const convId = window.sidecar ? window.sidecar.conversationId : null;
  if (!convId) {
    document.getElementById('model-name').textContent = t('noActiveChat');
    return;
  }

  try {
    const res = await fetch(`/api/stats?conversationId=${encodeURIComponent(convId)}`);
    if (!res.ok) return;
    const data = await res.json();
    renderStats(data);
  } catch (err) {
    console.error('Error fetching live stats:', err);
  }
}

// In-App Updater Functions
async function checkUpdate(silent = false) {
  const btn = document.getElementById('update-btn');
  const icon = document.getElementById('update-icon');
  const badgeText = document.getElementById('update-badge-text');

  // Modal elements
  const modalStatus = document.getElementById('modal-update-status');
  const modalVersion = document.getElementById('modal-version-tag');
  const modalUpdateBtn = document.getElementById('modal-update-btn');
  const modalUpdateBtnText = document.getElementById('modal-update-btn-text');
  const modalUpdateIcon = document.getElementById('modal-update-icon');

  if (!silent) {
    if (icon) icon.classList.add('spinning');
    if (badgeText) badgeText.textContent = t('checkingUpdate');
    if (modalUpdateIcon) modalUpdateIcon.classList.add('spinning');
    if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('checkingUpdate');
  }

  try {
    const res = await fetch('/api/update/check');
    if (!res.ok) throw new Error('Check failed');
    const info = await res.json();

    if (icon) icon.classList.remove('spinning');
    if (modalUpdateIcon) modalUpdateIcon.classList.remove('spinning');

    const curVer = info.currentVersion || '1.1.0';
    if (modalVersion) modalVersion.textContent = t('installedVersion', curVer);

    if (info.hasUpdate) {
      updateAvailableState = true;
      if (btn) {
        btn.className = 'update-btn update-available';
        badgeText.textContent = t('updateAvailable');
        btn.title = info.updateMessage || 'Click to install new update';
      }
      if (modalStatus) {
        modalStatus.textContent = t('updateAvailable');
        modalStatus.className = 'status-badge has-update';
      }
      if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('installUpdateNow');
    } else {
      updateAvailableState = false;
      if (btn) {
        btn.className = 'update-btn';
        badgeText.textContent = `v${curVer}`;
        btn.title = t('upToDate');
      }
      if (modalStatus) {
        modalStatus.textContent = t('upToDate');
        modalStatus.className = 'status-badge';
      }
      if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('checkUpdateNow');
    }
  } catch (e) {
    if (icon) icon.classList.remove('spinning');
    if (modalUpdateIcon) modalUpdateIcon.classList.remove('spinning');
    if (!silent) {
      if (badgeText) badgeText.textContent = 'v1.1.0';
      if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('checkUpdateNow');
    }
  }
}

async function applyUpdate() {
  const btn = document.getElementById('update-btn');
  const icon = document.getElementById('update-icon');
  const badgeText = document.getElementById('update-badge-text');

  const modalUpdateBtn = document.getElementById('modal-update-btn');
  const modalUpdateBtnText = document.getElementById('modal-update-btn-text');
  const modalUpdateIcon = document.getElementById('modal-update-icon');

  if (icon) icon.classList.add('spinning');
  if (badgeText) badgeText.textContent = t('updating');
  if (modalUpdateIcon) modalUpdateIcon.classList.add('spinning');
  if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('updating');

  try {
    const res = await fetch('/api/update/apply');
    const result = await res.json();

    if (icon) icon.classList.remove('spinning');
    if (modalUpdateIcon) modalUpdateIcon.classList.remove('spinning');

    if (result.success) {
      if (btn) {
        btn.className = 'update-btn update-success';
        badgeText.textContent = t('updateSuccess');
      }
      if (modalUpdateBtn) {
        modalUpdateBtn.className = 'btn-primary-update update-success';
      }
      if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('updateSuccess');

      setTimeout(() => {
        checkUpdate(true);
      }, 3000);
    } else {
      if (btn) {
        btn.className = 'update-btn update-failed';
        badgeText.textContent = t('updateFailed');
      }
      if (modalUpdateBtn) {
        modalUpdateBtn.className = 'btn-primary-update update-failed';
      }
      if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('updateFailed');
      alert('Update message: ' + (result.error || result.message));
    }
  } catch (e) {
    if (icon) icon.classList.remove('spinning');
    if (modalUpdateIcon) modalUpdateIcon.classList.remove('spinning');
    if (btn) {
      btn.className = 'update-btn update-failed';
      badgeText.textContent = t('updateFailed');
    }
    if (modalUpdateBtn) {
      modalUpdateBtn.className = 'btn-primary-update update-failed';
    }
    if (modalUpdateBtnText) modalUpdateBtnText.textContent = t('updateFailed');
  }
}

// Event Listeners Setup
document.addEventListener('DOMContentLoaded', () => {
  // Initial Language setup
  applyLanguage(currentLang);

  // Quick Language switcher in header
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'ar' ? 'en' : 'ar';
      applyLanguage(nextLang);
      fetch(`/api/config/save?language=${nextLang}`).catch(() => {});
    });
  }

  // Settings Modal Controls
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'flex';
      checkUpdate(true);
    });
  }

  if (modalCloseBtn && settingsModal) {
    modalCloseBtn.addEventListener('click', () => {
      settingsModal.style.display = 'none';
    });
  }

  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
      }
    });
  }

  // Modal Language Switcher Options
  const optAr = document.getElementById('lang-opt-ar');
  const optEn = document.getElementById('lang-opt-en');
  if (optAr) {
    optAr.addEventListener('click', () => {
      applyLanguage('ar');
      fetch('/api/config/save?language=ar').catch(() => {});
    });
  }
  if (optEn) {
    optEn.addEventListener('click', () => {
      applyLanguage('en');
      fetch('/api/config/save?language=en').catch(() => {});
    });
  }

  // Modal Update Button Click
  const modalUpdateBtn = document.getElementById('modal-update-btn');
  if (modalUpdateBtn) {
    modalUpdateBtn.addEventListener('click', () => {
      if (updateAvailableState) {
        applyUpdate();
      } else {
        checkUpdate(false);
      }
    });
  }

  // Footer Updater button click
  const updateBtn = document.getElementById('update-btn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      if (updateAvailableState) {
        applyUpdate();
      } else {
        checkUpdate(false);
      }
    });
  }

  // Initial check for updates silently
  setTimeout(() => {
    checkUpdate(true);
  }, 1500);
});

updateStats();
setInterval(updateStats, 2000);

