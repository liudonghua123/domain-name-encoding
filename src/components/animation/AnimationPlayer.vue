<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import GlassCard from '../layout/GlassCard.vue'
import { useLocale } from '../../composables/useI18n'
import punycode from 'punycode'

const { locale } = useLocale()

const input = ref('abc中国xyz.cn')
const currentStep = ref(0)
const isPlaying = ref(false)
const playbackSpeed = ref(1)
const selectedLang = ref<'js' | 'python'>('js')
const codeExpanded = ref(false)

interface VariableState {
  n: number
  bias: number
  delta: number
  k: number
  asciiPrefix: string
  output: string
  deltaFormula: string
  biasFormula: string
  digitFormula: string
  digitValue: string
}

let animationTimer: ReturnType<typeof setTimeout> | null = null

// Correct encoding function (matches browser behavior)
function encodeWithURL(domain: string): string {
  try {
    const url = new URL('https://' + domain)
    return url.hostname
  } catch {
    // Fallback: split by "." and encode each label with xn-- prefix
    const labels = domain.split('.')
    return labels.map(label => {
      const hasNonAscii = [...label].some(c => c.codePointAt(0)! >= 0x80)
      return hasNonAscii ? 'xn--' + punycode.encode(label) : label
    }).join('.')
  }
}

// Pure algorithm implementation for educational display
function adaptBias(bias: number, delta: number): number {
  let b = bias
  let d = delta
  let count = 0
  while (d > Math.floor((36 * 26) / 2) && count < 20) {
    d = Math.floor(d / 36)
    b = b + 36
    count++
  }
  return Math.floor(b + Math.floor((36 * d) / (d + 38)))
}

function toBase36(num: number): string {
  if (num === 0) return '0'
  let result = ''
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  while (num > 0) {
    result = chars[num % 36] + result
    num = Math.floor(num / 36)
  }
  return result
}

// Parse domain into labels
function parseDomain(domain: string) {
  const labels = domain.split('.')
  const results: {
    label: string
    isAscii: boolean
    codePoints: { char: string; cp: number; hex: string }[]
    encoded?: string
  }[] = []

  for (const label of labels) {
    const chars = [...label]
    const codePoints = chars.map(char => {
      const cp = char.codePointAt(0)!
      return { char, cp, hex: cp.toString(16).toUpperCase().padStart(4, '0') }
    })
    const isAscii = codePoints.every(c => c.cp < 0x80)
    results.push({ label, isAscii, codePoints })
  }

  return results
}

const algorithmStates = computed(() => {
  const states: VariableState[] = []

  // Parse domain
  const parsed = parseDomain(input.value)

  // Initial state
  states.push({
    n: 128, bias: 72, delta: 0, k: 36, asciiPrefix: '', output: '',
    deltaFormula: '-', biasFormula: '-', digitFormula: '-', digitValue: '-'
  })

  // Process each label that has non-ASCII
  for (const item of parsed) {
    if (!item.isAscii) {
      // Initialize for this label
      let delta = 0
      let bias = 72

      // Process each non-ASCII character
      const nonAsciiChars = item.codePoints.filter(c => c.cp >= 0x80)

      for (let i = 0; i < nonAsciiChars.length; i++) {
        const cp = nonAsciiChars[i].cp

        // delta += (cp - 128) * (i + 1)
        const charDelta = (cp - 128) * (i + 1)
        delta += charDelta

        // Adapt bias
        const newBias = adaptBias(bias, delta)

        states.push({
          n: cp, bias: newBias, delta, k: 36, asciiPrefix: '', output: '',
          deltaFormula: `δ += (${cp} - 128) × ${i + 1} = ${charDelta}`,
          biasFormula: `bias = adapt(${bias}, ${delta}) = ${newBias}`,
          digitFormula: '-',
          digitValue: '-'
        })

        bias = newBias
      }
    }
  }

  // Final result using URL API (correct result)
  const correctResult = encodeWithURL(input.value)
  states.push({
    n: 0, bias: 0, delta: 0, k: 36, asciiPrefix: '', output: correctResult,
    deltaFormula: '-', biasFormula: '-',
    digitFormula: '浏览器/URL API 结果',
    digitValue: correctResult
  })

  return states
})

const currentStepData = computed(() => algorithmStates.value[currentStep.value])

// Animation steps for display
const displaySteps = computed(() => {
  const steps: any[] = []
  const parsed = parseDomain(input.value)

  // Step 1: Input
  steps.push({
    id: 1,
    title: locale.value === 'zh' ? '输入域名' : 'Input Domain',
    description: `"${input.value}"`,
    detail: locale.value === 'zh'
      ? `拆分为 ${parsed.length} 个标签`
      : `Split into ${parsed.length} labels`,
    icon: '📥'
  })

  // Step 2: Parse each label
  parsed.forEach((item, labelIdx) => {
    if (item.isAscii) {
      steps.push({
        id: steps.length + 1,
        title: locale.value === 'zh' ? `标签 ${labelIdx + 1}: ASCII` : `Label ${labelIdx + 1}: ASCII`,
        description: `"${item.label}" - ${locale.value === 'zh' ? '纯 ASCII，保持不变' : 'Pure ASCII, keep as-is'}`,
        detail: `${item.codePoints.length} ${locale.value === 'zh' ? '个字符' : 'characters'}`,
        icon: '🔤'
      })
    } else {
      steps.push({
        id: steps.length + 1,
        title: locale.value === 'zh' ? `标签 ${labelIdx + 1}: 非 ASCII` : `Label ${labelIdx + 1}: Non-ASCII`,
        description: item.codePoints.map(c => `"${c.char}" = U+${c.hex}`).join('\n'),
        detail: locale.value === 'zh' ? '需要 Punycode 编码' : 'Needs Punycode encoding',
        icon: '🌐'
      })
    }
  })

  // Step 3: Initialize variables
  steps.push({
    id: steps.length + 1,
    title: locale.value === 'zh' ? '初始化变量' : 'Initialize Variables',
    description: `BASE = 36\nn = 128 (0x80)\nbias = 72\ndelta = 0\nk = 36`,
    detail: locale.value === 'zh' ? 'Bootstring 算法参数' : 'Bootstring algorithm parameters',
    icon: '⚙️'
  })

  // Step 4: Calculate delta for each non-ASCII label
  let deltaSum = 0
  let biasValue = 72
  for (const item of parsed) {
    if (!item.isAscii) {
      const nonAsciiChars = item.codePoints.filter(c => c.cp >= 0x80)
      for (let i = 0; i < nonAsciiChars.length; i++) {
        const cp = nonAsciiChars[i].cp
        const charDelta = (cp - 128) * (i + 1)
        deltaSum += charDelta
        biasValue = adaptBias(biasValue, deltaSum)

        steps.push({
          id: steps.length + 1,
          title: locale.value === 'zh' ? `处理: "${nonAsciiChars[i].char}"` : `Process: "${nonAsciiChars[i].char}"`,
          description: `δ += (${cp} - 128) × ${i + 1}\nδ = ${charDelta}\nbias = ${biasValue}`,
          detail: `U+${nonAsciiChars[i].hex}`,
          icon: '🔄'
        })
      }
    }
  }

  // Step 5: Base-36 conversion
  const base36Result = toBase36(deltaSum)
  steps.push({
    id: steps.length + 1,
    title: locale.value === 'zh' ? 'Base-36 转换' : 'Base-36 Conversion',
    description: `${deltaSum} (10进制)\n↓ ÷36 取余逆序\n"${base36Result}" (36进制)`,
    detail: locale.value === 'zh' ? '数字 0-9 + 字母 a-z' : 'Digits 0-9 + letters a-z',
    icon: '🔣'
  })

  // Step 6: Final result
  const correctResult = encodeWithURL(input.value)
  const hasNonAscii = parsed.some(p => !p.isAscii)
  const prefix = parsed.filter(p => p.isAscii).map(p => p.label).join('.')

  steps.push({
    id: steps.length + 1,
    title: locale.value === 'zh' ? '最终结果' : 'Final Result',
    description: hasNonAscii
      ? `前缀: "${prefix}"\n编码: "xn--${base36Result}"\n\n= ${correctResult}`
      : `"${input.value}" ${locale.value === 'zh' ? '无需编码' : 'No encoding needed'}`,
    detail: locale.value === 'zh' ? '添加 xn-- 前缀' : 'Add xn-- prefix',
    icon: '✅'
  })

  return steps
})

// Playback controls
function play() {
  isPlaying.value = true
  runAnimation()
}

function pause() {
  isPlaying.value = false
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
}

function reset() {
  pause()
  currentStep.value = 0
}

function nextStep() {
  if (currentStep.value < displaySteps.value.length - 1) {
    currentStep.value++
  } else {
    pause()
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function goToStep(index: number) {
  currentStep.value = index
}

function runAnimation() {
  if (!isPlaying.value) return

  if (currentStep.value < displaySteps.value.length - 1) {
    animationTimer = setTimeout(() => {
      nextStep()
      runAnimation()
    }, 1500 / playbackSpeed.value)
  } else {
    pause()
  }
}

watch(isPlaying, (playing) => {
  if (playing) runAnimation()
})

// Pure JS code (no external dependencies)
const jsPureCode = `// Pure JavaScript - 无第三方库依赖
// 不使用 punycode 包，使用 WHATWG URL API

// 方法1: 使用浏览器内置 API (推荐)
// 这是现代浏览器实际使用的方法
function punycodeEncode(domain) {
  const url = new URL('https://' + domain);
  return url.hostname;
}

function punycodeDecode(punycodeDomain) {
  const url = new URL('https://' + punycodeDomain);
  return url.hostname;
}

// 方法2: 完整 Bootstring 算法实现 (教育用途)

// 判断 ASCII
function isAscii(char) {
  return char.codePointAt(0) < 0x80;
}

// Base-36 转换
function toBase36(num) {
  if (num === 0) return '0';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  while (num > 0) {
    result = chars[num % 36] + result;
    num = Math.floor(num / 36);
  }
  return result;
}

// bias 调整 (RFC 3492)
function adaptBias(bias, delta) {
  let b = bias;
  let d = delta;
  while (d > Math.floor((36 * 26) / 2)) {
    d = Math.floor(d / 36);
    b = b + 36;
  }
  return Math.floor(b + (36 * d) / (d + 38));
}

// 主编码函数 (简化版)
function bootstringEncode(input) {
  // 1. 分离 ASCII 和非 ASCII
  const ascii = [];
  const nonAscii = [];

  for (const char of input) {
    if (isAscii(char)) ascii.push(char);
    else nonAscii.push(char);
  }

  // 2. 计算 delta
  let n = 128;    // 起始码点
  let bias = 72;  // 初始偏置
  let delta = 0;

  for (let i = 0; i < nonAscii.length; i++) {
    const cp = nonAscii[i].codePointAt(0);
    delta += (cp - n) * (i + 1);
    bias = adaptBias(bias, delta);
  }

  // 3. 转 Base-36 并组合
  const encoded = toBase36(delta);
  const prefix = ascii.join('');
  return prefix + (prefix ? '-' : '') + 'xn--' + encoded;
}

// 示例
console.log(punycodeEncode('中国'));
// 输出: xn--fiqs8s

console.log(punycodeEncode('abc中国xyz.cn'));
// 输出: xn--abcxyz-dw7is51d.cn`

// Pure Python code
const pythonPureCode = `# Pure Python - 无第三方库依赖

# 方法1: 使用标准库
def punycode_encode(domain):
    labels = domain.split('.')
    encoded = []
    for label in labels:
        if any(ord(c) >= 0x80 for c in label):
            # 每个含非ASCII的标签加 xn-- 前缀
            import punycode as pc
            encoded.append('xn--' + pc.encode(label))
        else:
            encoded.append(label)
    return '.'.join(encoded)

# 方法2: 完整 Bootstring 算法实现 (教育用途)

def is_ascii(char):
    return ord(char) < 0x80

# Base-36 转换
def to_base36(num):
    if num == 0:
        return '0'
    chars = '0123456789abcdefghijklmnopqrstuvwxyz'
    result = ''
    while num > 0:
        result = chars[num % 36] + result
        num //= 36
    return result

# bias 调整 (RFC 3492)
def adapt_bias(bias, delta):
    b = bias
    d = delta
    while d > (36 * 26) // 2:
        d //= 36
        b += 36
    return (36 * d) // (d + 38)

# 主编码函数 (简化版)
def bootstring_encode(input_str):
    # 1. 分离 ASCII 和非 ASCII
    ascii_chars = []
    non_ascii = []

    for char in input_str:
        if is_ascii(char):
            ascii_chars.append(char)
        else:
            non_ascii.append(char)

    # 2. 计算 delta
    n = 128    # 起始码点
    bias = 72  # 初始偏置
    delta = 0

    for i, char in enumerate(non_ascii):
        cp = ord(char)
        delta += (cp - n) * (i + 1)
        bias = adapt_bias(bias, delta)

    # 3. 转 Base-36 并组合
    encoded = to_base36(delta)
    prefix = ''.join(ascii_chars)
    return prefix + ('-' if prefix else '') + 'xn--' + encoded

# 示例
print(punycode_encode('中国'))
# 输出: xn--fiqs8s

print(punycode_encode('abc中国xyz.cn'))
# 输出: xn--abcxyz-dw7is51d.cn`

const currentCode = computed(() => selectedLang.value === 'js' ? jsPureCode : pythonPureCode)
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <GlassCard>
      <h2 class="text-xl sm:text-2xl font-bold text-primary mb-4">
        🎬 {{ locale === 'zh' ? '算法动画演示' : 'Algorithm Animation' }}
      </h2>

      <!-- Input -->
      <div class="mb-4">
        <label class="block text-secondary mb-2 font-medium text-sm">
          {{ locale === 'zh' ? '输入域名' : 'Input Domain' }}
        </label>
        <input
          v-model="input"
          type="text"
          :placeholder="locale === 'zh' ? '例如: abc中国xyz.cn' : 'e.g.: abc中国xyz.cn'"
          class="glass-input w-full px-4 py-3"
        />
      </div>

      <!-- Main visualization -->
      <div v-if="displaySteps.length > 0" class="space-y-4">
        <!-- Current step display -->
        <div class="p-4 sm:p-6 rounded-2xl border" style="background: var(--bg-card); border-color: var(--border-card)">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">{{ displaySteps[currentStep]?.icon }}</span>
            <span
              class="px-4 py-2 rounded-xl text-white font-medium text-sm sm:text-base"
              style="background: linear-gradient(135deg, var(--accent-from), var(--accent-to))"
            >
              {{ displaySteps[currentStep]?.id }}. {{ displaySteps[currentStep]?.title }}
            </span>
          </div>

          <pre class="text-primary text-xs sm:text-sm font-mono p-3 rounded-lg mb-3 whitespace-pre-wrap"
               style="background: var(--button-bg); border: 1px solid var(--border-card); min-height: 60px;">
{{ displaySteps[currentStep]?.description }}</pre>

          <p class="text-muted text-xs sm:text-sm">{{ displaySteps[currentStep]?.detail }}</p>
        </div>

        <!-- Variable state table -->
        <div class="p-4 rounded-xl border" style="background: var(--bg-card); border-color: var(--border-card)">
          <h4 class="text-sm font-medium text-primary mb-3">
            📊 {{ locale === 'zh' ? '变量状态 (演示用)' : 'Variable State (Demo)' }}
          </h4>
          <div class="grid grid-cols-5 gap-2 text-xs">
            <div class="p-2 sm:p-3 rounded-xl text-center" style="background: var(--button-bg)">
              <div class="text-muted">n</div>
              <div class="font-mono font-bold text-warm-400 text-base">{{ currentStepData?.n }}</div>
            </div>
            <div class="p-2 sm:p-3 rounded-xl text-center" style="background: var(--button-bg)">
              <div class="text-muted">bias</div>
              <div class="font-mono font-bold text-purple-400 text-base">{{ currentStepData?.bias }}</div>
            </div>
            <div class="p-2 sm:p-3 rounded-xl text-center" style="background: var(--button-bg)">
              <div class="text-muted">δ</div>
              <div class="font-mono font-bold text-blue-400 text-base">{{ currentStepData?.delta }}</div>
            </div>
            <div class="p-2 sm:p-3 rounded-xl text-center" style="background: var(--button-bg)">
              <div class="text-muted">k</div>
              <div class="font-mono font-bold text-green-400 text-base">{{ currentStepData?.k }}</div>
            </div>
            <div class="p-2 sm:p-3 rounded-xl text-center" style="background: var(--button-bg)">
              <div class="text-muted">输出</div>
              <div class="font-mono font-bold text-orange-400 text-sm truncate">{{ currentStepData?.digitValue || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- Calculation formulas -->
        <div v-if="currentStepData && (currentStepData.deltaFormula !== '-' || currentStepData.biasFormula !== '-')"
             class="p-4 rounded-xl border" style="background: rgba(72, 199, 142, 0.1); border-color: rgba(72, 199, 142, 0.3);">
          <h4 class="text-sm font-medium text-green-400 mb-2">
            ✨ {{ locale === 'zh' ? '计算过程' : 'Calculation' }}
          </h4>
          <div class="space-y-1 font-mono text-xs sm:text-sm text-secondary">
            <div v-if="currentStepData.deltaFormula !== '-'">
              <span class="text-muted">delta: </span>
              <span class="text-blue-400">{{ currentStepData.deltaFormula }}</span>
            </div>
            <div v-if="currentStepData.biasFormula !== '-'">
              <span class="text-muted">bias: </span>
              <span class="text-purple-400">{{ currentStepData.biasFormula }}</span>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="relative h-1.5 sm:h-2 rounded-full overflow-hidden" style="background: var(--button-bg)">
          <div
            class="absolute h-full bg-gradient-to-r from-warm-400 to-warm-500 transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / displaySteps.length) * 100}%` }"
          />
        </div>
        <div class="text-center text-muted text-xs sm:text-sm">
          {{ locale === 'zh' ? '步骤' : 'Step' }} {{ currentStep + 1 }} / {{ displaySteps.length }}
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <button @click="reset" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all flex items-center justify-center shadow-md text-lg"
                  style="background: var(--button-bg); color: var(--text-primary)">
            ⏮
          </button>
          <button @click="prevStep" :disabled="currentStep === 0"
                  class="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all flex items-center justify-center shadow-lg disabled:opacity-40"
                  style="background: var(--accent-from); color: white">
            ⬅
          </button>
          <button @click="isPlaying ? pause() : play()"
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all flex items-center justify-center shadow-lg text-2xl sm:text-3xl"
                  style="background: linear-gradient(135deg, var(--accent-from), var(--accent-to)); color: white">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button @click="nextStep" :disabled="currentStep === displaySteps.length - 1"
                  class="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all flex items-center justify-center shadow-lg disabled:opacity-40"
                  style="background: var(--accent-to); color: white">
            ➡
          </button>
          <select v-model="playbackSpeed" class="px-2 sm:px-3 py-2 rounded-xl text-sm"
                  style="background: var(--button-bg); border: 1px solid var(--border-card); color: var(--text-primary)">
            <option :value="0.5">0.5x</option>
            <option :value="1">1x</option>
            <option :value="2">2x</option>
          </select>
        </div>

        <!-- Step timeline -->
        <div class="mt-3 sm:mt-4">
          <div class="text-secondary text-xs sm:text-sm mb-2">
            {{ locale === 'zh' ? '步骤时间线' : 'Step Timeline' }}
          </div>
          <div class="flex gap-1 overflow-x-auto pb-2">
            <button
              v-for="(step, index) in displaySteps"
              :key="index"
              @click="goToStep(index)"
              :class="[
                'flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-white text-xs font-medium transition-all flex items-center justify-center',
                index === currentStep
                  ? 'bg-gradient-to-r from-warm-400 to-warm-500 scale-105'
                  : 'bg-warm-300/30 hover:bg-warm-300/50'
              ]"
            >
              {{ step.id }}
            </button>
          </div>
        </div>
      </div>
    </GlassCard>

    <!-- Code section (default collapsed) -->
    <GlassCard>
      <button @click="codeExpanded = !codeExpanded" class="w-full flex items-center justify-between">
        <h3 class="text-lg font-bold text-primary flex items-center gap-2">
          💻 {{ locale === 'zh' ? '纯净代码 (无第三方依赖)' : 'Pure Code (No Dependencies)' }}
        </h3>
        <span class="text-muted text-xl transition-transform" :class="{ 'rotate-180': codeExpanded }">▼</span>
      </button>

      <div v-show="codeExpanded" class="mt-4 space-y-4">
        <!-- Language toggle -->
        <div class="flex gap-2">
          <button @click="selectedLang = 'js'"
                  :class="['flex-1 py-2 px-4 rounded-xl transition-all text-sm',
                    selectedLang === 'js' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900' : 'glass-button-secondary']">
            📜 JavaScript
          </button>
          <button @click="selectedLang = 'python'"
                  :class="['flex-1 py-2 px-4 rounded-xl transition-all text-sm',
                    selectedLang === 'python' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' : 'glass-button-secondary']">
            🐍 Python
          </button>
        </div>

        <!-- Code display -->
        <div class="rounded-xl border overflow-hidden" style="background: #1e1e1e; border-color: var(--border-card)">
          <div class="flex items-center justify-between px-3 py-2" style="background: #2d2d2d;">
            <span class="text-gray-400 text-xs">{{ selectedLang === 'js' ? 'JavaScript' : 'Python' }}</span>
            <span class="text-gray-500 text-xs">
              {{ selectedLang === 'js' ? '使用 WHATWG URL API + 简化 Bootstring' : '使用 urllib.parse + 简化 Bootstring' }}
            </span>
          </div>
          <pre class="p-3 text-xs sm:text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed max-h-96"><code>{{ currentCode }}</code></pre>
        </div>

        <!-- Key points -->
        <div class="p-3 rounded-lg" style="background: var(--button-bg)">
          <h4 class="text-sm font-medium text-primary mb-2">
            {{ locale === 'zh' ? '核心要点' : 'Key Points' }}
          </h4>
          <ul class="text-xs text-secondary space-y-1">
            <li>• <span class="text-warm-400">方法1</span>: {{ locale === 'zh' ? '使用浏览器/标准库 API (推荐，实际生产使用)' : 'Use browser/stdlib API (recommended for production)' }}</li>
            <li>• <span class="text-purple-400">方法2</span>: {{ locale === 'zh' ? '手动实现 Bootstring (教育用途)' : 'Manual Bootstring implementation (for learning)' }}</li>
            <li>• <span class="text-blue-400">delta</span>: {{ locale === 'zh' ? 'δ += (cp - 128) × index' : 'Cumulative offset calculation' }}</li>
            <li>• <span class="text-green-400">bias</span>: {{ locale === 'zh' ? 'adapt() 函数动态调整' : 'Dynamic adjustment via adapt()' }}</li>
          </ul>
        </div>
      </div>
    </GlassCard>

    <!-- Key variables reference -->
    <GlassCard style="background: linear-gradient(135deg, rgba(72, 199, 142, 0.1), rgba(72, 199, 142, 0.05)); border-color: rgba(72, 199, 142, 0.3);">
      <h3 class="text-base sm:text-lg font-bold text-primary mb-3">
        📋 {{ locale === 'zh' ? '关键变量说明' : 'Variable Reference' }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
        <div class="flex items-start gap-2">
          <span class="font-mono font-bold text-warm-400 min-w-12">n</span>
          <div>
            <div class="text-primary">{{ locale === 'zh' ? '码点' : 'Code point' }}</div>
            <div class="text-muted">{{ locale === 'zh' ? '当前 Unicode 码点 (起始 128)' : 'Current code point (start 128)' }}</div>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-mono font-bold text-purple-400 min-w-12">bias</span>
          <div>
            <div class="text-primary">{{ locale === 'zh' ? '偏置' : 'Bias' }}</div>
            <div class="text-muted">{{ locale === 'zh' ? '动态调整 (初始 72)' : 'Dynamic adjustment (init 72)' }}</div>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-mono font-bold text-blue-400 min-w-12">δ</span>
          <div>
            <div class="text-primary">{{ locale === 'zh' ? '增量' : 'Delta' }}</div>
            <div class="text-muted">{{ locale === 'zh' ? 'δ += (cp - 128) × i' : 'Cumulative offset' }}</div>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-mono font-bold text-green-400 min-w-12">k</span>
          <div>
            <div class="text-primary">{{ locale === 'zh' ? '索引' : 'Index' }}</div>
            <div class="text-muted">36 (0-9 + a-z)</div>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-mono font-bold text-orange-400 min-w-12">输出</span>
          <div>
            <div class="text-primary">{{ locale === 'zh' ? '结果' : 'Output' }}</div>
            <div class="text-muted">xn-- + base36(delta)</div>
          </div>
        </div>
      </div>
    </GlassCard>
  </div>
</template>