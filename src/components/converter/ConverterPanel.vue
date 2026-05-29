<script setup lang="ts">
import { ref, computed } from 'vue'
import GlassCard from '../layout/GlassCard.vue'
import { encodePunycode, decodePunycode } from '../../utils/punycode'
import { useLocale } from '../../composables/useI18n'

const { locale } = useLocale()

const input = ref('abc中国xyz.cn')
const mode = ref<'encode' | 'decode'>('encode')

const encodeResult = ref<{ punycode: string; steps: any[] } | null>(null)
const decodeResult = ref<{ original: string; steps: any[] } | null>(null)
const error = ref('')

function handleConvert() {
  error.value = ''
  if (!input.value.trim()) {
    error.value = locale.value === 'zh' ? '请输入内容' : 'Please enter content'
    return
  }

  if (mode.value === 'encode') {
    encodeResult.value = encodePunycode(input.value)
    decodeResult.value = null
  } else {
    decodeResult.value = decodePunycode(input.value)
    encodeResult.value = null
  }
}

function handleExampleClick(domain: string) {
  input.value = domain
  handleConvert()
}

// Separate ASCII and non-ASCII characters with their code points
const codePointAnalysis = computed(() => {
  const chars = [...input.value]
  const asciiChars: { char: string; hex: string }[] = []
  const nonAsciiChars: { char: string; hex: string; dec: number }[] = []

  chars.forEach(char => {
    const cp = char.codePointAt(0)!
    if (cp < 0x80) {
      asciiChars.push({ char, hex: cp.toString(16).toUpperCase().padStart(2, '0') })
    } else {
      nonAsciiChars.push({ char, hex: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0'), dec: cp })
    }
  })

  return { asciiChars, nonAsciiChars }
})

// Simulated algorithm steps based on the tutorial
const algorithmSteps = computed(() => {
  if (!input.value.trim() || !encodeResult.value) return []

  const steps: any[] = []
  const { asciiChars, nonAsciiChars } = codePointAnalysis.value
  const inputStr = input.value

  // Step 1: Input
  steps.push({
    id: 1,
    title: locale.value === 'zh' ? '步骤 1: 输入域名' : 'Step 1: Input Domain',
    description: `"${inputStr}"`,
    detail: locale.value === 'zh'
      ? `共 ${inputStr.length} 个字符`
      : `${inputStr.length} characters total`,
    variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': '"' + inputStr + '"' }
  })

  if (nonAsciiChars.length > 0) {
    // Step 2: Convert to code points
    const codePointStr = nonAsciiChars.map(c => `"${c.char}" = ${c.hex} (${c.dec})`).join('\n')
    steps.push({
      id: 2,
      title: locale.value === 'zh' ? '步骤 2: 转成 Unicode 码点' : 'Step 2: Convert to Unicode Code Points',
      description: codePointStr,
      detail: locale.value === 'zh'
        ? '非 ASCII 字符转 Unicode 码点'
        : 'Non-ASCII characters to Unicode code points',
      variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': '-' }
    })

    // Step 3: Separate ASCII and non-ASCII
    const asciiPart = asciiChars.map(c => c.char).join('')
    steps.push({
      id: 3,
      title: locale.value === 'zh' ? '步骤 3: 分离 ASCII 和非 ASCII' : 'Step 3: Separate ASCII and Non-ASCII',
      description: `${locale.value === 'zh' ? 'ASCII 前缀' : 'ASCII prefix'}: "${asciiPart}"\n${locale.value === 'zh' ? '非 ASCII' : 'Non-ASCII'}: ${nonAsciiChars.map(c => c.char).join(' ')}`,
      detail: asciiChars.length > 0
        ? (locale.value === 'zh' ? 'ASCII 部分保持不变，后面加 "-"' : 'ASCII part stays, add "-" after')
        : (locale.value === 'zh' ? '无 ASCII 字符' : 'No ASCII characters'),
      variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': `"${asciiPart}"${asciiPart ? '-' : ''}` }
    })

    // Step 4: Initialize variables
    steps.push({
      id: 4,
      title: locale.value === 'zh' ? '步骤 4: 设置初始变量' : 'Step 4: Initialize Variables',
      description: `BASE = 36\nn = 128 (0x80)\nbias = 72\ndelta = 0\nk = 36`,
      detail: locale.value === 'zh'
        ? '初始化 Bootstring 算法参数'
        : 'Initialize Bootstring algorithm parameters',
      variables: { 'bias': 72, 'delta': 0, 'n': 128, 'k': 36, 'output': '-' }
    })

    // Step 5: Process characters (show each non-ASCII)
    let delta = 0
    nonAsciiChars.forEach((c, i) => {
      const prevDelta = delta
      delta += 1 + (c.dec - 128) * (i + 1)
      steps.push({
        id: 5 + i,
        title: locale.value === 'zh' ? `步骤 ${5 + i}: 处理 "${c.char}"` : `Step ${5 + i}: Process "${c.char}"`,
        description: `delta += 1 + (${c.dec} - 128) × ${i + 1}\ndelta = ${prevDelta} → ${delta}`,
        detail: `${locale.value === 'zh' ? '码点' : 'Code point'}: ${c.hex}`,
        variables: { 'bias': 72, 'delta': delta, 'n': c.dec, 'k': 36, 'output': '-' }
      })
    })

    // Step 6: Base-36 conversion
    const base36Result = delta.toString(36)
    steps.push({
      id: steps.length + 1,
      title: locale.value === 'zh' ? `步骤 ${steps.length + 1}: 转成 36 进制` : `Step ${steps.length + 1}: Convert to Base-36`,
      description: `${delta} (10进制) = "${base36Result}" (36进制)`,
      detail: locale.value === 'zh'
        ? '数字 0-9 和字母 a-z 表示 36 进制'
        : 'Digits 0-9 and letters a-z represent base-36',
      variables: { 'bias': '-', 'delta': delta, 'n': '-', 'k': '-', 'output': `"${base36Result}"` }
    })

    // Step 7: Final result
    const prefix = asciiPart ? asciiPart + '-' : ''
    const finalResult = encodeResult.value?.punycode || ''
    steps.push({
      id: steps.length + 1,
      title: locale.value === 'zh' ? `步骤 ${steps.length + 1}: 组合结果` : `Step ${steps.length + 1}: Combine Result`,
      description: `前缀 + "xn--" + 编码\n= "${prefix}" + "xn--" + "${base36Result}"\n= "${finalResult}"`,
      detail: locale.value === 'zh'
        ? '添加 xn-- 前缀表示 Punycode'
        : 'Add xn-- prefix to indicate Punycode',
      variables: { 'bias': '-', 'delta': 0, 'n': '-', 'k': '-', 'output': finalResult }
    })
  } else {
    steps.push({
      id: 2,
      title: locale.value === 'zh' ? '纯 ASCII 字符' : 'Pure ASCII Characters',
      description: locale.value === 'zh' ? '无需编码' : 'No encoding needed',
      detail: locale.value === 'zh' ? '所有字符都是 ASCII' : 'All characters are ASCII',
      variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': inputStr }
    })
  }

  return steps
})

// Decode steps
const decodeSteps = computed(() => {
  if (!decodeResult.value) return []

  const steps: any[] = []
  const inputStr = input.value

  steps.push({
    id: 1,
    title: locale.value === 'zh' ? '步骤 1: 输入 Punycode' : 'Step 1: Input Punycode',
    description: `"${inputStr}"`,
    detail: inputStr.includes('xn--')
      ? (locale.value === 'zh' ? '检测到 xn-- 前缀' : 'xn-- prefix detected')
      : (locale.value === 'zh' ? '无 xn-- 前缀' : 'No xn-- prefix'),
    variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': inputStr }
  })

  if (inputStr.includes('xn--')) {
    const parts = inputStr.split('.')
    steps.push({
      id: 2,
      title: locale.value === 'zh' ? '步骤 2: 分割域名' : 'Step 2: Split Domain',
      description: parts.map(p => `"${p}"`).join(' . '),
      detail: locale.value === 'zh' ? '按 "." 分割每个部分' : 'Split by "." separator',
      variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': '-' }
    })

    // Decode each part
    parts.forEach((part) => {
      if (part.startsWith('xn--')) {
        const encoded = part.slice(4)
        steps.push({
          id: steps.length + 1,
          title: locale.value === 'zh' ? `解码: ${part}` : `Decode: ${part}`,
          description: `移除 "xn--", 解码 "${encoded}"`,
          detail: locale.value === 'zh' ? '使用 punycode.decode() 解码' : 'Use punycode.decode() to decode',
          variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': '-' }
        })
      }
    })

    steps.push({
      id: steps.length + 1,
      title: locale.value === 'zh' ? '步骤 3: 组合结果' : 'Step 3: Combine Result',
      description: decodeResult.value.original,
      detail: locale.value === 'zh' ? '用 "." 连接各部分' : 'Join parts with "."',
      variables: { 'bias': '-', 'delta': '-', 'n': '-', 'k': '-', 'output': decodeResult.value.original }
    })
  }

  return steps
})

const displaySteps = computed(() => mode.value === 'encode' ? algorithmSteps.value : decodeSteps.value)
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <GlassCard>
      <h2 class="text-xl sm:text-2xl font-bold text-primary mb-4">
        🔄 {{ locale === 'zh' ? 'Punycode 转换器' : 'Punycode Converter' }}
      </h2>

      <!-- Mode Toggle -->
      <div class="flex gap-2 mb-4">
        <button
          @click="mode = 'encode'"
          :class="[
            'flex-1 py-2 px-4 rounded-xl transition-all duration-300 text-sm sm:text-base',
            mode === 'encode'
              ? 'bg-gradient-to-r from-warm-300 to-warm-400 text-white shadow-md'
              : 'glass-button-secondary'
          ]"
        >
          {{ locale === 'zh' ? '编码' : 'Encode' }}
        </button>
        <button
          @click="mode = 'decode'"
          :class="[
            'flex-1 py-2 px-4 rounded-xl transition-all duration-300 text-sm sm:text-base',
            mode === 'decode'
              ? 'bg-gradient-to-r from-warm-300 to-warm-400 text-white shadow-md'
              : 'glass-button-secondary'
          ]"
        >
          {{ locale === 'zh' ? '解码' : 'Decode' }}
        </button>
      </div>

      <!-- Input Section -->
      <div class="mb-4">
        <label class="block text-secondary mb-2 font-medium text-sm sm:text-base">
          {{ mode === 'encode'
            ? (locale === 'zh' ? '输入域名' : 'Input Domain')
            : (locale === 'zh' ? '输入 Punycode' : 'Input Punycode') }}
        </label>
        <div class="flex-responsive flex-wrap gap-2">
          <input
            v-model="input"
            type="text"
            :placeholder="mode === 'encode'
              ? (locale === 'zh' ? '例如: abc中国xyz.cn' : 'e.g.: abc中国xyz.cn')
              : (locale === 'zh' ? '例如: xn--fiqs8s.cn' : 'e.g.: xn--fiqs8s.cn')"
            class="glass-input flex-1 min-w-48 px-4 py-3"
            @keyup.enter="handleConvert"
          />
          <button @click="handleConvert" class="glass-button whitespace-nowrap">
            {{ mode === 'encode'
              ? (locale === 'zh' ? '编码 →' : 'Encode →')
              : (locale === 'zh' ? '解码 →' : 'Decode →') }}
          </button>
        </div>
        <p v-if="error" class="text-red-400 mt-2 text-sm">{{ error }}</p>
      </div>

      <!-- Code Point Analysis -->
      <div v-if="input.trim()" class="mb-4 p-4 rounded-xl border" style="background: var(--bg-card); border-color: var(--border-card)">
        <h4 class="text-sm font-medium text-primary mb-2">
          📊 {{ locale === 'zh' ? '字符分析' : 'Character Analysis' }}
        </h4>
        <div class="grid grid-cols-2 gap-4 text-xs sm:text-sm">
          <div v-if="codePointAnalysis.asciiChars.length > 0">
            <span class="text-muted">{{ locale === 'zh' ? 'ASCII 字符' : 'ASCII' }}:</span>
            <span class="font-mono text-primary ml-1">
              {{ codePointAnalysis.asciiChars.map(c => c.char).join(' ') }}
            </span>
            <span class="text-muted text-xs ml-1">
              ({{ codePointAnalysis.asciiChars.map(c => '0x' + c.hex).join(', ') }})
            </span>
          </div>
          <div v-if="codePointAnalysis.nonAsciiChars.length > 0">
            <span class="text-muted">{{ locale === 'zh' ? '非 ASCII' : 'Non-ASCII' }}:</span>
            <span v-for="c in codePointAnalysis.nonAsciiChars" :key="c.char" class="font-mono text-warm-400 ml-1">
              "{{ c.char }}"={{ c.hex }}
            </span>
          </div>
        </div>
      </div>

      <!-- Result -->
      <div v-if="(mode === 'encode' && encodeResult) || (mode === 'decode' && decodeResult)" class="p-4 rounded-xl border mb-4"
           style="background: rgba(72, 199, 142, 0.1); border-color: rgba(72, 199, 142, 0.3)">
        <div class="text-secondary text-sm mb-1">
          {{ mode === 'encode' ? (locale === 'zh' ? '编码结果' : 'Encoded Result') : (locale === 'zh' ? '解码结果' : 'Decoded Result') }}
        </div>
        <div class="text-primary text-lg sm:text-xl font-mono font-bold break-all">
          {{ mode === 'encode' ? encodeResult?.punycode : decodeResult?.original }}
        </div>
      </div>

      <!-- Examples -->
      <div class="mb-4">
        <div class="text-secondary text-sm mb-2">
          {{ locale === 'zh' ? '快速示例' : 'Quick Examples' }}
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="example in ['中国.cn', '中文网.cn', '咖啡.com', 'abc中国xyz.cn']"
            :key="example"
            @click="handleExampleClick(example)"
            class="px-3 py-2 rounded-lg text-sm transition-all border"
            style="background: var(--button-bg); border-color: var(--border-card); color: var(--text-primary)"
          >
            {{ example }}
          </button>
        </div>
      </div>
    </GlassCard>

    <!-- Algorithm Steps -->
    <GlassCard v-if="displaySteps.length > 0">
      <h3 class="text-lg font-bold text-primary mb-4">
        📝 {{ locale === 'zh' ? '算法步骤详解' : 'Algorithm Step by Step' }}
      </h3>

      <div class="space-y-4">
        <div
          v-for="step in displaySteps"
          :key="step.id"
          class="p-4 rounded-xl border"
          style="background: var(--bg-card); border-color: var(--border-card)"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style="background: linear-gradient(135deg, var(--accent-from), var(--accent-to))">
              {{ step.id }}
            </span>
            <h4 class="text-primary font-medium text-sm sm:text-base">{{ step.title }}</h4>
          </div>

          <pre class="text-secondary text-xs sm:text-sm font-mono p-3 rounded-lg mb-3 whitespace-pre-wrap"
               style="background: var(--button-bg)">{{ step.description }}</pre>

          <p class="text-muted text-xs sm:text-sm mb-3">{{ step.detail }}</p>

          <!-- Variable table -->
          <div class="grid grid-cols-5 gap-1 text-xs">
            <div class="p-1.5 rounded-lg text-center" style="background: var(--button-bg)">
              <div class="text-muted">bias</div>
              <div class="font-mono text-purple-400 font-medium">{{ step.variables.bias }}</div>
            </div>
            <div class="p-1.5 rounded-lg text-center" style="background: var(--button-bg)">
              <div class="text-muted">delta</div>
              <div class="font-mono text-blue-400 font-medium">{{ step.variables.delta }}</div>
            </div>
            <div class="p-1.5 rounded-lg text-center" style="background: var(--button-bg)">
              <div class="text-muted">n</div>
              <div class="font-mono text-warm-400 font-medium">{{ step.variables.n }}</div>
            </div>
            <div class="p-1.5 rounded-lg text-center" style="background: var(--button-bg)">
              <div class="text-muted">k</div>
              <div class="font-mono text-green-400 font-medium">{{ step.variables.k }}</div>
            </div>
            <div class="p-1.5 rounded-lg text-center" style="background: var(--button-bg)">
              <div class="text-muted">output</div>
              <div class="font-mono text-orange-400 font-medium truncate text-[10px]">{{ step.variables.output }}</div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>

    <!-- Key variables reference -->
    <GlassCard style="background: linear-gradient(135deg, rgba(255, 171, 145, 0.1), rgba(255, 139, 101, 0.05)); border-color: rgba(255, 171, 145, 0.3);">
      <h4 class="text-base font-bold text-primary mb-3">
        📋 {{ locale === 'zh' ? '关键变量速查' : 'Key Variables Reference' }}
      </h4>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
        <div class="p-2 rounded-lg" style="background: var(--bg-card)">
          <span class="font-mono font-bold text-warm-400">BASE</span>
          <span class="text-muted ml-1">= 36</span>
          <div class="text-secondary text-xs">{{ locale === 'zh' ? '字符表大小' : 'Alphabet size' }}</div>
        </div>
        <div class="p-2 rounded-lg" style="background: var(--bg-card)">
          <span class="font-mono font-bold text-warm-400">n</span>
          <span class="text-muted ml-1">= 128</span>
          <div class="text-secondary text-xs">{{ locale === 'zh' ? '起始码点' : 'Start code point' }}</div>
        </div>
        <div class="p-2 rounded-lg" style="background: var(--bg-card)">
          <span class="font-mono font-bold text-purple-400">bias</span>
          <span class="text-muted ml-1">= 72</span>
          <div class="text-secondary text-xs">{{ locale === 'zh' ? '初始偏置' : 'Initial bias' }}</div>
        </div>
        <div class="p-2 rounded-lg" style="background: var(--bg-card)">
          <span class="font-mono font-bold text-blue-400">delta</span>
          <span class="text-muted ml-1">= 0</span>
          <div class="text-secondary text-xs">{{ locale === 'zh' ? '增量累加' : 'Cumulative offset' }}</div>
        </div>
        <div class="p-2 rounded-lg" style="background: var(--bg-card)">
          <span class="font-mono font-bold text-green-400">k</span>
          <span class="text-muted ml-1">= 36</span>
          <div class="text-secondary text-xs">{{ locale === 'zh' ? '字符表索引' : 'Alphabet index' }}</div>
        </div>
      </div>
    </GlassCard>
  </div>
</template>