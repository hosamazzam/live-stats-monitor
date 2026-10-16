import { exec } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { Response, SidecarApp } from 'sidecar_sdk';

const execAsync = promisify(exec);
const HERE = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(HERE, '..', '..');
const CONFIG_PATH = join(PLUGIN_ROOT, 'config.json');
const PLUGIN_JSON_PATH = join(PLUGIN_ROOT, 'plugin.json');

const app = new SidecarApp();

const readLocal = (name) => readFileSync(join(HERE, name), 'utf8');

app.page('/', () => readLocal('index.html'));
app.page('/app.js', () => readLocal('app.js'));
app.api('/styles.css', () => new Response(readLocal('styles.css'), { contentType: 'text/css' }), 'GET');

// Helper to calculate total directory size
function getDirSizeBytes(dirPath) {
  let total = 0;
  if (!existsSync(dirPath)) return 0;
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      try {
        if (entry.isDirectory()) {
          total += getDirSizeBytes(fullPath);
        } else if (entry.isFile()) {
          total += statSync(fullPath).size;
        }
      } catch (e) {}
    }
  } catch (e) {}
  return total;
}

// Config Helpers
const DEFAULT_CONFIG = {
  language: 'ar',
  theme: 'dark',
  autoUpdateCheck: true,
  repoUrl: 'https://github.com/HosAzz/live-stats-monitor'
};

function loadConfig() {
  if (existsSync(CONFIG_PATH)) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) };
    } catch (e) {}
  }
  return { ...DEFAULT_CONFIG };
}

function saveConfig(cfg) {
  try {
    writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

function getPluginVersion() {
  if (existsSync(PLUGIN_JSON_PATH)) {
    try {
      const p = JSON.parse(readFileSync(PLUGIN_JSON_PATH, 'utf8'));
      if (p.version) return p.version;
    } catch (e) {}
  }
  return '1.1.0';
}

// Model normalization and metadata helpers
function normalizeModelName(raw) {
  if (!raw) return 'Gemini 3.8 Flash (Medium)';
  const str = raw.trim();
  if (/argon/i.test(str)) {
    const tierMatch = str.match(/\((Low|Medium|High|Max)\)/i);
    return tierMatch ? `Gemini 4 Argon (${tierMatch[1]})` : 'Gemini 4 Argon';
  }
  if (/flash.*lite/i.test(str)) {
    return 'Gemini 3.1 Flash Lite';
  }
  if (/flash/i.test(str)) {
    const tierMatch = str.match(/\((Low|Medium|High)\)/i);
    return tierMatch ? `Gemini 3.8 Flash (${tierMatch[1]})` : 'Gemini 3.8 Flash';
  }
  if (/claude.*opus/i.test(str)) {
    const tierMatch = str.match(/\((Low|Medium|High|Max)\)/i);
    return tierMatch ? `Claude Opus 5.5 (${tierMatch[1]})` : 'Claude Opus 5.5';
  }
  if (/claude.*sonnet/i.test(str)) {
    return 'Claude Sonnet 5.5';
  }
  if (/pro/i.test(str)) {
    const tierMatch = str.match(/\((Low|Medium|High)\)/i);
    return tierMatch ? `Gemini 3.1 Pro (${tierMatch[1]})` : 'Gemini 3.1 Pro';
  }
  return str;
}

function getBaseModelName(name) {
  if (/argon/i.test(name)) return 'Gemini 4 Argon';
  if (/flash.*lite/i.test(name)) return 'Gemini 3.1 Flash Lite';
  if (/flash/i.test(name)) return 'Gemini 3.8 Flash';
  if (/opus/i.test(name)) return 'Claude Opus 5.5';
  if (/sonnet/i.test(name)) return 'Claude Sonnet 5.5';
  if (/pro/i.test(name)) return 'Gemini 3.1 Pro';
  return name || 'Gemini 3.8 Flash';
}

function getModelMeta(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('argon')) {
    return {
      baseName: 'Gemini 4 Argon',
      tag: 'Argon',
      color: '#c084fc',
      bg: 'rgba(192, 132, 252, 0.15)',
      border: 'rgba(192, 132, 252, 0.35)',
      icon: '🔮'
    };
  }
  if (n.includes('flash') && n.includes('lite')) {
    return {
      baseName: 'Gemini 3.1 Flash Lite',
      tag: 'Flash Lite',
      color: '#2dd4bf',
      bg: 'rgba(45, 212, 191, 0.15)',
      border: 'rgba(45, 212, 191, 0.35)',
      icon: '⚡'
    };
  }
  if (n.includes('flash')) {
    return {
      baseName: 'Gemini 3.8 Flash',
      tag: 'Flash',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)',
      border: 'rgba(56, 189, 248, 0.35)',
      icon: '⚡'
    };
  }
  if (n.includes('claude') || n.includes('opus') || n.includes('sonnet')) {
    return {
      baseName: 'Claude',
      tag: 'Claude',
      color: '#fb923c',
      bg: 'rgba(251, 146, 60, 0.15)',
      border: 'rgba(251, 146, 60, 0.35)',
      icon: '✦'
    };
  }
  if (n.includes('pro')) {
    return {
      baseName: 'Gemini Pro',
      tag: 'Pro',
      color: '#818cf8',
      bg: 'rgba(129, 140, 248, 0.15)',
      border: 'rgba(129, 140, 248, 0.35)',
      icon: '💎'
    };
  }
  return {
    baseName: name || 'AI Model',
    tag: 'Model',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.15)',
    border: 'rgba(52, 211, 153, 0.35)',
    icon: '✦'
  };
}

function extractModelSelection(step) {
  if (step.source === 'MODEL' || step.type === 'GENERIC') return null;
  if (!step.content || !step.content.includes('Model Selection')) return null;
  const match = step.content.match(/Model Selection` from .+? to (.+?)\.\s*(?:No need|$)/i);
  return match ? normalizeModelName(match[1]) : null;
}

// Helper to parse tokens and track model per step from any transcript file
function parseTranscript(filePath, initialModel = 'Gemini 3.8 Flash (Medium)') {
  if (!existsSync(filePath)) {
    return {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      lastInputTokens: 0,
      lastOutputTokens: 0,
      stepCount: 0,
      hasExactTokens: false,
      firstTime: null,
      lastTime: null,
      steps: [],
      activeModel: initialModel,
      rawContent: '',
      fileSizeBytes: 0
    };
  }

  try {
    const fileContent = readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim().length > 0);

    let currentModel = initialModel;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let lastInputTokens = 0;
    let lastOutputTokens = 0;
    let hasExactTokens = false;
    let charBasedEstimatedTotal = 0;
    let firstTime = null;
    let lastTime = null;
    const steps = [];

    for (let i = 0; i < lines.length; i++) {
      try {
        const step = JSON.parse(lines[i]);

        // Detect legitimate user settings change for model selection
        const newModel = extractModelSelection(step);
        if (newModel) {
          currentModel = newModel;
        }

        step._model = currentModel;
        steps.push(step);

        if (step.created_at) {
          const t = new Date(step.created_at).getTime();
          if (!firstTime || t < firstTime) firstTime = t;
          if (!lastTime || t > lastTime) lastTime = t;
        }

        if (step.source === 'MODEL' || step.type === 'PLANNER_RESPONSE') {
          const inTok = (step.input_tokens || 0) + (step.cache_read_tokens || 0);
          const outTok = step.output_tokens || 0;
          if (inTok > 0 || outTok > 0) {
            hasExactTokens = true;
            lastInputTokens = inTok;
            lastOutputTokens = outTok;
            totalInputTokens += (step.input_tokens || 0);
            totalOutputTokens += outTok;
          }
        }

        const textLen = (step.content || '').length + (step.thinking || '').length + JSON.stringify(step.tool_calls || '').length;
        charBasedEstimatedTotal += Math.max(30, Math.round(textLen / 3.5));
      } catch (err) {}
    }

    let totalTokens = totalInputTokens + totalOutputTokens;
    if (!hasExactTokens || totalTokens === 0) {
      totalTokens = Math.max(100, charBasedEstimatedTotal);
      totalInputTokens = Math.round(totalTokens * 0.85);
      totalOutputTokens = Math.round(totalTokens * 0.15);
    }

    return {
      totalInputTokens,
      totalOutputTokens,
      totalTokens,
      lastInputTokens,
      lastOutputTokens,
      stepCount: lines.length,
      hasExactTokens,
      firstTime,
      lastTime,
      steps,
      activeModel: currentModel,
      rawContent: fileContent,
      fileSizeBytes: fileContent.length
    };
  } catch (e) {
    return {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      lastInputTokens: 0,
      lastOutputTokens: 0,
      stepCount: 0,
      hasExactTokens: false,
      firstTime: null,
      lastTime: null,
      steps: [],
      activeModel: initialModel,
      rawContent: '',
      fileSizeBytes: 0
    };
  }
}

// Recursive helper to extract conversation IDs from step text or content
function extractSpawnedIds(text, excludedSet) {
  const found = [];
  if (!text || (!text.includes('conversationId') && !text.includes('invoke_subagent'))) {
    return found;
  }
  const matches = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
  if (matches) {
    for (const id of matches) {
      if (!excludedSet.has(id)) {
        found.push(id);
      }
    }
  }
  return found;
}

// API: Get Live Stats for a given conversationId
app.api('/api/stats', (params) => {
  const conversationId = params.conversationId;
  const config = loadConfig();

  if (!conversationId) {
    return {
      error: 'No active conversation ID provided.',
      active: false,
      config
    };
  }

  const appDataDir = join(homedir(), '.gemini', 'antigravity');
  const convDir = join(appDataDir, 'brain', conversationId);
  const logsDir = join(convDir, '.system_generated', 'logs');
  const transcriptPath = join(logsDir, 'transcript.jsonl');

  if (!existsSync(transcriptPath)) {
    return {
      active: true,
      conversationId,
      config,
      stepCount: 0,
      totalSessionTokens: 0,
      currentContext: 0,
      maxContextTokens: 1000000,
      contextPercentage: '0.00',
      modelName: 'Gemini 3.8 Flash (Medium)',
      isMultiModel: false,
      modelsBreakdown: [],
      networkMb: '0.00',
      durationMinutes: 0,
      isAgentActive: false,
      currentTask: {
        tokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        steps: 0,
        durationSeconds: 0,
        isActive: false,
        isMultiModel: false,
        modelsBreakdown: []
      },
      subagents: {
        count: 0,
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        steps: 0
      }
    };
  }

  try {
    const mainTranscript = parseTranscript(transcriptPath);

    // Track task-level subagents, whole-session subagents, and model mapping
    const allKnownIds = new Set([conversationId]);
    const taskSubagentIds = new Set();
    const sessionSubagentIds = new Set();
    const subagentModelMap = {};
    let pendingSubagentModels = [];

    let lastUserIndex = -1;

    for (let i = 0; i < mainTranscript.steps.length; i++) {
      const step = mainTranscript.steps[i];
      if (step.source === 'USER_EXPLICIT' || step.type === 'USER_INPUT') {
        lastUserIndex = i;
      }

      // Check invoke_subagent tool calls to detect requested subagent model
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'invoke_subagent' && tc.args) {
            const rawStr = (typeof tc.args.Subagents === 'string' ? tc.args.Subagents : JSON.stringify(tc.args)) || '';
            const modelMatches = [...rawStr.matchAll(/Model[\\\"\s]*:[\\\"\s]*([a-zA-Z0-9_-]+)/gi)];
            if (modelMatches.length > 0) {
              pendingSubagentModels = modelMatches.map(m => {
                const mod = m[1].toLowerCase();
                if (mod === 'flash') return 'Gemini 3.8 Flash';
                if (mod === 'pro') return 'Gemini 4 Argon';
                if (mod === 'flash_lite') return 'Gemini 3.1 Flash Lite';
                return step._model || mainTranscript.activeModel;
              });
            } else {
              pendingSubagentModels = [step._model || mainTranscript.activeModel];
            }
          }
        }
      }

      const stepStr = (step.content || '') + JSON.stringify(step.tool_calls || '');
      const childIds = extractSpawnedIds(stepStr, allKnownIds);
      for (let cIdx = 0; cIdx < childIds.length; cIdx++) {
        const cid = childIds[cIdx];
        allKnownIds.add(cid);
        sessionSubagentIds.add(cid);
        const assignedModel = pendingSubagentModels[cIdx] || pendingSubagentModels[0] || step._model || mainTranscript.activeModel;
        subagentModelMap[cid] = assignedModel;
        if (lastUserIndex !== -1 && i >= lastUserIndex) {
          taskSubagentIds.add(cid);
        }
      }
      if (childIds.length > 0) {
        pendingSubagentModels = [];
      }
    }

    // Fully Recursive Multi-Level Tree Traversal (Subagent -> Sub-subagent -> ...)
    const queue = Array.from(sessionSubagentIds);
    let head = 0;

    let subagentTotalTokens = 0;
    let subagentInputTokens = 0;
    let subagentOutputTokens = 0;
    let subagentTotalSteps = 0;
    let subagentActiveCount = 0;

    let taskSubagentTotalTokens = 0;
    let taskSubagentInputTokens = 0;
    let taskSubagentOutputTokens = 0;
    let taskSubagentSteps = 0;

    const subagentParsedData = {};
    const now = Date.now();

    while (head < queue.length) {
      const currentSubId = queue[head++];
      const isTaskSub = taskSubagentIds.has(currentSubId);
      const assignedModel = subagentModelMap[currentSubId] || mainTranscript.activeModel;

      const subLog = join(appDataDir, 'brain', currentSubId, '.system_generated', 'logs', 'transcript.jsonl');
      const subData = parseTranscript(subLog, assignedModel);
      subagentParsedData[currentSubId] = { data: subData, model: assignedModel, isTaskSub };

      subagentTotalTokens += subData.totalTokens;
      subagentInputTokens += subData.totalInputTokens;
      subagentOutputTokens += subData.totalOutputTokens;
      subagentTotalSteps += subData.stepCount;

      if (subData.lastTime && (now - subData.lastTime < 10000)) {
        subagentActiveCount++;
      }

      if (isTaskSub) {
        taskSubagentTotalTokens += subData.totalTokens;
        taskSubagentInputTokens += subData.totalInputTokens;
        taskSubagentOutputTokens += subData.totalOutputTokens;
        taskSubagentSteps += subData.stepCount;
      }

      // Check if this subagent spawned any child subagents under it
      const deeperChildren = extractSpawnedIds(subData.rawContent, allKnownIds);
      for (const childId of deeperChildren) {
        allKnownIds.add(childId);
        sessionSubagentIds.add(childId);
        subagentModelMap[childId] = assignedModel;
        queue.push(childId);
        if (isTaskSub) {
          taskSubagentIds.add(childId);
        }
      }
    }

    // Determine current task stats on the main agent
    let currentTaskInputTokens = 0;
    let currentTaskOutputTokens = 0;
    let currentTaskSteps = 0;
    let currentTaskStartTime = null;
    let currentTaskEndTime = null;

    if (lastUserIndex !== -1) {
      for (let j = lastUserIndex; j < mainTranscript.steps.length; j++) {
        const s = mainTranscript.steps[j];
        currentTaskSteps++;
        if (!currentTaskStartTime && s.created_at) {
          currentTaskStartTime = new Date(s.created_at).getTime();
        }
        if (s.created_at) {
          currentTaskEndTime = new Date(s.created_at).getTime();
        }
        if (s.source === 'MODEL' || s.type === 'PLANNER_RESPONSE') {
          if (s.input_tokens || s.output_tokens) {
            currentTaskInputTokens += (s.input_tokens || 0);
            currentTaskOutputTokens += (s.output_tokens || 0);
          } else {
            const tLen = (s.content || '').length + (s.thinking || '').length + JSON.stringify(s.tool_calls || '').length;
            currentTaskOutputTokens += Math.max(50, Math.round(tLen / 3.5));
          }
        }
      }
    }

    // Check if main agent or any subagent is currently active
    const lastStep = mainTranscript.steps.length > 0 ? mainTranscript.steps[mainTranscript.steps.length - 1] : null;
    const timeSinceLastStep = (lastStep && lastStep.created_at) ? (now - new Date(lastStep.created_at).getTime()) : 999999;
    const isMainAgentActive = (timeSinceLastStep < 8000);
    const isAgentActive = isMainAgentActive || (subagentActiveCount > 0);

    let currentTaskDurationSeconds = 0;
    if (currentTaskStartTime) {
      if (isAgentActive) {
        currentTaskDurationSeconds = Math.max(1, Math.round((now - currentTaskStartTime) / 1000));
      } else if (currentTaskEndTime) {
        currentTaskDurationSeconds = Math.max(1, Math.round((currentTaskEndTime - currentTaskStartTime) / 1000));
      }
    }

    // Max context window: 1,000,000 tokens for Gemini 4 Argon / Gemini 3.8 Flash
    const maxContextTokens = 1000000;
    let currentContext = mainTranscript.lastInputTokens + mainTranscript.lastOutputTokens;

    if (!mainTranscript.hasExactTokens || currentContext === 0) {
      const fileBytes = mainTranscript.fileSizeBytes || 5000;
      currentContext = Math.min(maxContextTokens, Math.max(1500, Math.round((fileBytes * 0.45) / 3.5)));
    }

    const contextPercentage = ((currentContext / maxContextTokens) * 100).toFixed(2);

    // Total session tokens = Main Agent + All Nested Subagents
    const grandTotalTokens = mainTranscript.totalTokens + subagentTotalTokens;
    const grandTotalInput = mainTranscript.totalInputTokens + subagentInputTokens;
    const grandTotalOutput = mainTranscript.totalOutputTokens + subagentOutputTokens;
    const grandTotalSteps = mainTranscript.stepCount + subagentTotalSteps;

    // Current task tokens = Main Agent task + Task Subagents
    const taskTotalTokens = (currentTaskInputTokens + currentTaskOutputTokens) + taskSubagentTotalTokens;
    const taskInputTokens = currentTaskInputTokens + taskSubagentInputTokens;
    const taskOutputTokens = currentTaskOutputTokens + taskSubagentOutputTokens;
    const taskSteps = currentTaskSteps + taskSubagentSteps;

    // --- ACCUMULATE TOKENS BY MODEL FAMILY ---
    const sessionModelMap = {};
    const taskModelMap = {};

    function addModelUsage(targetMap, rawName, inTok, outTok, stepsCount = 1) {
      const family = getBaseModelName(rawName);
      if (!targetMap[family]) {
        targetMap[family] = { totalTokens: 0, inputTokens: 0, outputTokens: 0, steps: 0, exactName: rawName };
      }
      targetMap[family].totalTokens += (inTok + outTok);
      targetMap[family].inputTokens += inTok;
      targetMap[family].outputTokens += outTok;
      targetMap[family].steps += stepsCount;
    }

    // 1. Accumulate main agent steps
    for (let i = 0; i < mainTranscript.steps.length; i++) {
      const step = mainTranscript.steps[i];
      if (step.source === 'MODEL' || step.type === 'PLANNER_RESPONSE') {
        const inTok = (step.input_tokens || 0);
        const outTok = (step.output_tokens || 0);
        const model = step._model || mainTranscript.activeModel;
        addModelUsage(sessionModelMap, model, inTok, outTok, 1);

        if (lastUserIndex !== -1 && i >= lastUserIndex) {
          addModelUsage(taskModelMap, model, inTok, outTok, 1);
        }
      }
    }

    // 2. Accumulate subagents steps
    for (const [subId, info] of Object.entries(subagentParsedData)) {
      addModelUsage(sessionModelMap, info.model, info.data.totalInputTokens, info.data.totalOutputTokens, info.data.stepCount);
      if (info.isTaskSub) {
        addModelUsage(taskModelMap, info.model, info.data.totalInputTokens, info.data.totalOutputTokens, info.data.stepCount);
      }
    }

    const activeModel = mainTranscript.activeModel;

    // Build session models breakdown array
    const modelsBreakdown = Object.entries(sessionModelMap).map(([family, stats]) => {
      const meta = getModelMeta(family);
      const pct = grandTotalTokens > 0 ? ((stats.totalTokens / grandTotalTokens) * 100).toFixed(1) : '0.0';
      return {
        name: family,
        exactName: stats.exactName,
        baseName: meta.baseName,
        tag: meta.tag,
        totalTokens: stats.totalTokens,
        inputTokens: stats.inputTokens,
        outputTokens: stats.outputTokens,
        steps: stats.steps,
        percentage: pct,
        isActive: (family === getBaseModelName(activeModel)),
        color: meta.color,
        bg: meta.bg,
        border: meta.border,
        icon: meta.icon
      };
    }).sort((a, b) => b.totalTokens - a.totalTokens);

    // Build task models breakdown array
    const taskModelsBreakdown = Object.entries(taskModelMap).map(([family, stats]) => {
      const meta = getModelMeta(family);
      const pct = taskTotalTokens > 0 ? ((stats.totalTokens / taskTotalTokens) * 100).toFixed(1) : '0.0';
      return {
        name: family,
        exactName: stats.exactName,
        baseName: meta.baseName,
        tag: meta.tag,
        totalTokens: stats.totalTokens,
        inputTokens: stats.inputTokens,
        outputTokens: stats.outputTokens,
        steps: stats.steps,
        percentage: pct,
        color: meta.color,
        bg: meta.bg,
        border: meta.border,
        icon: meta.icon
      };
    }).sort((a, b) => b.totalTokens - a.totalTokens);

    // Realistic Network Transfer estimation:
    const diskBytes = getDirSizeBytes(convDir);
    const cumulativeTokensSentReceived = grandTotalTokens;
    const wireTransferBytes = cumulativeTokensSentReceived * 4;
    const totalBytes = diskBytes + wireTransferBytes;
    const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);

    const firstTime = mainTranscript.firstTime;
    const lastTime = mainTranscript.lastTime;
    const durationMinutes = firstTime && lastTime ? Math.max(1, Math.round((lastTime - firstTime) / 60000)) : 1;

    return {
      active: true,
      conversationId,
      config,
      stepCount: grandTotalSteps,
      mainStepCount: mainTranscript.stepCount,
      currentContext,
      maxContextTokens,
      contextPercentage,
      lastInputTokens: mainTranscript.lastInputTokens,
      lastOutputTokens: mainTranscript.lastOutputTokens,
      totalInputTokens: grandTotalInput,
      totalOutputTokens: grandTotalOutput,
      totalSessionTokens: grandTotalTokens,
      mainSessionTokens: mainTranscript.totalTokens,
      modelName: activeModel,
      isMultiModel: modelsBreakdown.length > 1,
      modelsBreakdown,
      networkMb: totalMb,
      durationMinutes,
      isAgentActive,
      currentTask: {
        tokens: taskTotalTokens,
        inputTokens: taskInputTokens,
        outputTokens: taskOutputTokens,
        mainTokens: currentTaskInputTokens + currentTaskOutputTokens,
        subagentTokens: taskSubagentTotalTokens,
        steps: taskSteps,
        durationSeconds: currentTaskDurationSeconds,
        isActive: isAgentActive,
        isMultiModel: taskModelsBreakdown.length > 1,
        modelsBreakdown: taskModelsBreakdown
      },
      subagents: {
        count: sessionSubagentIds.size,
        activeCount: subagentActiveCount,
        totalTokens: subagentTotalTokens,
        inputTokens: subagentInputTokens,
        outputTokens: subagentOutputTokens,
        steps: subagentTotalSteps
      }
    };
  } catch (error) {
    return {
      error: error.message,
      active: false,
      config
    };
  }
}, 'GET');

// API: Get Current Configuration
app.api('/api/config', () => {
  const cfg = loadConfig();
  return {
    ...cfg,
    version: getPluginVersion()
  };
}, 'GET');

// API: Save Configuration (e.g. language)
app.api('/api/config/save', (params) => {
  const cfg = loadConfig();
  if (params.language) {
    cfg.language = params.language === 'en' ? 'en' : 'ar';
  }
  if (params.theme) {
    cfg.theme = params.theme;
  }
  saveConfig(cfg);
  return {
    success: true,
    config: cfg
  };
}, 'GET');

// API: Check for Updates
app.api('/api/update/check', async () => {
  const currentVersion = getPluginVersion();
  const isGit = existsSync(join(PLUGIN_ROOT, '.git'));
  let gitRemote = null;
  let hasUpdate = false;
  let latestVersion = currentVersion;
  let updateMessage = '';

  if (isGit) {
    try {
      const { stdout: remoteUrl } = await execAsync('git remote get-url origin', { cwd: PLUGIN_ROOT });
      gitRemote = remoteUrl.trim();
    } catch (e) {}

    if (gitRemote) {
      try {
        await execAsync('git fetch origin --dry-run', { cwd: PLUGIN_ROOT, timeout: 5000 });
        const { stdout: behind } = await execAsync('git rev-list HEAD..origin/main --count', { cwd: PLUGIN_ROOT });
        const count = parseInt(behind.trim(), 10) || 0;
        if (count > 0) {
          hasUpdate = true;
          updateMessage = `New commits available on origin/main (${count} commits behind).`;
        }
      } catch (e) {}
    }
  }

  // Also query GitHub release API as a fallback or if not git
  try {
    const ghRes = await fetch('https://raw.githubusercontent.com/HosAzz/live-stats-monitor/main/plugin.json', { signal: AbortSignal.timeout(3000) });
    if (ghRes.ok) {
      const remotePlugin = await ghRes.json();
      if (remotePlugin.version && remotePlugin.version !== currentVersion) {
        latestVersion = remotePlugin.version;
        hasUpdate = true;
        updateMessage = `New version ${remotePlugin.version} available!`;
      }
    }
  } catch (e) {}

  return {
    currentVersion,
    latestVersion,
    hasUpdate,
    isGit,
    gitRemote,
    updateMessage
  };
}, 'GET');

// API: Apply Update
app.api('/api/update/apply', async () => {
  const isGit = existsSync(join(PLUGIN_ROOT, '.git'));
  
  if (isGit) {
    try {
      const { stdout: pullOut } = await execAsync('git pull --rebase origin main', { cwd: PLUGIN_ROOT, timeout: 20000 });
      return {
        success: true,
        message: 'Successfully updated via git pull:\n' + pullOut.trim()
      };
    } catch (e) {
      try {
        const { stdout: plainPull } = await execAsync('git pull', { cwd: PLUGIN_ROOT, timeout: 20000 });
        return {
          success: true,
          message: 'Successfully updated via git pull:\n' + plainPull.trim()
        };
      } catch (err2) {
        return {
          success: false,
          error: 'Git update failed: ' + err2.message
        };
      }
    }
  }

  // Non-git fallback: download core files from GitHub main branch
  try {
    const filesToUpdate = [
      'sidecars/panel/main.mjs',
      'sidecars/panel/app.js',
      'sidecars/panel/index.html',
      'sidecars/panel/styles.css',
      'plugin.json'
    ];
    for (const f of filesToUpdate) {
      const res = await fetch(`https://raw.githubusercontent.com/HosAzz/live-stats-monitor/main/${f}`, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const content = await res.text();
        writeFileSync(join(PLUGIN_ROOT, f), content, 'utf8');
      }
    }
    return {
      success: true,
      message: 'Successfully updated core files from GitHub!'
    };
  } catch (e) {
    return {
      success: false,
      error: 'Download update failed: ' + e.message
    };
  }
}, 'GET');

app.run();
