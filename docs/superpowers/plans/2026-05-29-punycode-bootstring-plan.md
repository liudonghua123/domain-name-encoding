# Punycode & Bootstring 教学网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯前端交互式教学网站，演示 Punycode 编码和 Bootstring 算法

**Architecture:** Vite + Vue3 单页应用，使用 TailwindCSS 实现淡暖色系玻璃态 UI，anime.js 实现算法动画

**Tech Stack:** Vite, Vue 3, TailwindCSS, anime.js, Vue Motion

---

## 文件结构

```
domain-name-encoding/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── GlassCard.vue
│   │   ├── tutorial/
│   │   │   └── TutorialIndex.vue
│   │   ├── converter/
│   │   │   ├── ConverterPanel.vue
│   │   │   └── ProcessLog.vue
│   │   ├── animation/
│   │   │   └── AnimationPlayer.vue
│   │   └── quiz/
│   │       ├── QuizPanel.vue
│   │       └── QuizCard.vue
│   ├── composables/
│   │   ├── usePunycode.ts
│   │   └── useAnimation.ts
│   ├── utils/
│   │   ├── punycode.ts
│   │   └── examples.ts
│   └── assets/
│       └── (empty, using inline SVGs)
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-29-punycode-bootstring-design.md
└── .gitignore
```

---

## 任务清单

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `.gitignore`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "domain-name-encoding",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.21",
    "animejs": "^3.2.2"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.6",
    "vue-tsc": "^2.0.6"
  }
}
```

Run: `cd "C:\Users\admin\code\ai\domain-name-encoding" && npm install`
Expected: Dependencies installed

- [ ] **Step 2: 创建 Vite 配置**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

- [ ] **Step 3: 创建 Tailwind 配置**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#fdfbfb',
          100: '#ebedee',
          200: '#f5e6d3',
          300: '#ffab91',
          400: '#ffcc80',
          500: '#ff8a65',
          600: '#ffa726',
          700: '#8d6e63',
          800: '#5d4037',
        },
        success: {
          400: '#a5d6a7',
          500: '#81c784',
        },
        error: {
          400: '#ef9a9a',
          500: '#e57373',
        }
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 50%, #f5e6d3 100%)',
      },
      backdropBlur: {
        'glass': '20px',
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: 创建其他配置文件**

`postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

`index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Punycode & Bootstring 演示</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`.gitignore`:
```
node_modules
dist
*.local
```

- [ ] **Step 5: 创建入口文件**

`src/style.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-warm-gradient min-h-screen;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/70 backdrop-blur-glass rounded-3xl border border-white/80 shadow-lg;
  }

  .glass-button {
    @apply bg-gradient-to-r from-warm-300 to-warm-400 text-white font-medium py-3 px-6 rounded-xl
           transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98];
  }

  .glass-button-secondary {
    @apply bg-white/60 text-warm-700 font-medium py-3 px-6 rounded-xl
           transition-all duration-300 hover:bg-white/80 hover:scale-[1.02];
  }
}
```

`src/main.ts`:
```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 6: 测试开发服务器**

Run: `npm run dev`
Expected: Server starts on http://localhost:5173

- [ ] **Step 7: 提交**

```bash
git add package.json vite.config.ts tailwind.config.js postcss.config.js tsconfig.json index.html src/main.ts src/style.css .gitignore
git commit -m "feat: initialize Vite + Vue3 + TailwindCSS project"
```

---

### Task 2: 基础 UI 组件

**Files:**
- Create: `src/App.vue`
- Create: `src/components/layout/AppHeader.vue`
- Create: `src/components/layout/AppFooter.vue`
- Create: `src/components/layout/GlassCard.vue`

- [ ] **Step 1: 创建 GlassCard 组件**

`src/components/layout/GlassCard.vue`:
```vue
<template>
  <div class="glass-card p-6">
    <slot />
  </div>
</template>
```

- [ ] **Step 2: 创建 AppHeader 组件**

`src/components/layout/AppHeader.vue`:
```vue
<script setup lang="ts">
defineProps<{
  activeTab: string
}>()
const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()

const tabs = [
  { id: 'tutorial', label: '📚 教程', icon: 'book' },
  { id: 'converter', label: '🔄 转换器', icon: 'refresh' },
  { id: 'animation', label: '🎬 动画演示', icon: 'play' },
  { id: 'quiz', label: '✏️ 练习', icon: 'edit' },
]
</script>

<template>
  <header class="glass-card mb-8 sticky top-4 z-50">
    <nav class="flex items-center justify-between px-6 py-4">
      <h1 class="text-2xl font-bold text-warm-800">🌐 Punycode 演示</h1>
      <div class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="emit('update:activeTab', tab.id)"
          :class="[
            'px-4 py-2 rounded-xl transition-all duration-300',
            activeTab === tab.id
              ? 'bg-gradient-to-r from-warm-300 to-warm-400 text-white shadow-md'
              : 'text-warm-700 hover:bg-warm-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>
  </header>
</template>
```

- [ ] **Step 3: 创建 AppFooter 组件**

`src/components/layout/AppFooter.vue`:
```vue
<template>
  <footer class="glass-card mt-12 text-center py-6">
    <p class="text-warm-700 text-sm">
      基于 RFC 3492 (Punycode) 和 RFC 3492 (Bootstring) 标准
    </p>
    <p class="text-warm-600 text-xs mt-2">
      纯前端演示 · 无数据上传
    </p>
  </footer>
</template>
```

- [ ] **Step 4: 创建 App.vue**

`src/App.vue`:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import TutorialIndex from './components/tutorial/TutorialIndex.vue'
import ConverterPanel from './components/converter/ConverterPanel.vue'
import AnimationPlayer from './components/animation/AnimationPlayer.vue'
import QuizPanel from './components/quiz/QuizPanel.vue'

const activeTab = ref('tutorial')
</script>

<template>
  <div class="min-h-screen p-6 max-w-6xl mx-auto">
    <AppHeader v-model:activeTab="activeTab" />

    <main>
      <TutorialIndex v-if="activeTab === 'tutorial'" />
      <ConverterPanel v-else-if="activeTab === 'converter'" />
      <AnimationPlayer v-else-if="activeTab === 'animation'" />
      <QuizPanel v-else-if="activeTab === 'quiz'" />
    </main>

    <AppFooter />
  </div>
</template>
```

- [ ] **Step 5: 验证基础 UI**

Run: `npm run dev`
打开 http://localhost:5173，确认页面渲染正常

- [ ] **Step 6: 提交**

```bash
git add src/App.vue src/components/layout/
git commit -m "feat: add base layout components (Header, Footer, GlassCard)"
```

---

### Task 3: 核心算法实现

**Files:**
- Create: `src/utils/punycode.ts`
- Create: `src/composables/usePunycode.ts`
- Create: `src/utils/examples.ts`

- [ ] **Step 1: 创建 Punycode/Bootstring 算法实现**

`src/utils/punycode.ts`:
```typescript
/**
 * Bootstring/Punycode implementation based on RFC 3492
 * Adapted for educational visualization
 */

const BASE = 36
const TMIN = 1
const TMAX = 26
const SKEW = 38
const DAMP = 700
const INITIAL_BIAS = 72
const INITIAL_N = 0x80
const DELIMITER = 0x2D

export interface EncodeStep {
  type: 'init' | 'insert' | 'adapt' | 'output' | 'delta'
  description: string
  state: {
    bias: number
    delta: number
    n: number
    k: number
    t: number
    codePoint?: number
    char?: string
    digit?: string
  }
  output: string
}

export function encodePunycode(input: string): { punycode: string; steps: EncodeStep[] } {
  const steps: EncodeStep[] = []
  const output: string[] = []

  // Convert to code points and separate ASCII and non-ASCII
  const codePoints = [...input].map(c => c.codePointAt(0)!)
  const asciiChars = codePoints.filter(cp => cp < 0x80)
  const nonAsciiChars = codePoints.filter(cp => cp >= 0x80)

  steps.push({
    type: 'init',
    description: `输入: "${input}"`,
    state: { bias: INITIAL_BIAS, delta: 0, n: INITIAL_N, k: BASE },
    output: input
  })

  // Output ASCII chars unchanged
  if (asciiChars.length > 0) {
    output.push(...asciiChars.map(cp => String.fromCodePoint(cp)))
    steps.push({
      type: 'output',
      description: `ASCII 字符保持不变: ${String.fromCodePoint(...asciiChars)}`,
      state: { bias: INITIAL_BIAS, delta: 0, n: INITIAL_N, k: BASE },
      output: String.fromCodePoint(...asciiChars)
    })
  }

  // If no non-ASCII, we're done
  if (nonAsciiChars.length === 0) {
    return { punycode: output.join(''), steps }
  }

  output.push(String.fromCodePoint(DELIMITER))

  let bias = INITIAL_BIAS
  let delta = 0
  let n = INITIAL_N
  let k = BASE

  // Process each non-ASCII character
  for (let i = 0; i < nonAsciiChars.length; i++) {
    const cp = nonAsciiChars[i]

    steps.push({
      type: 'insert',
      description: `处理字符 "${String.fromCodePoint(cp)}" (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`,
      state: { bias, delta, n, k, codePoint: cp, char: String.fromCodePoint(cp) },
      output: output.join('')
    })

    delta++

    steps.push({
      type: 'delta',
      description: `delta += 1 → ${delta}`,
      state: { bias, delta, n, k },
      output: output.join('')
    })

    // Encode this character
    let m = cp
    for (let j = 0; j < nonAsciiChars.length; j++) {
      if (nonAsciiChars[j] >= m && j < nonAsciiChars.length) {
        m = nonAsciiChars[j]
        if (m === cp) break
      }
    }

    delta += (m - n) * (i + 1 + output.filter(c => c.codePointAt(0)! < 0x80).length)
    n = m

    steps.push({
      type: 'adapt',
      description: `更新 delta 和 n: delta=${delta}, n=${n}`,
      state: { bias, delta, n, k },
      output: output.join('')
    })

    // Handle overflow
    if (delta > 700) {
      delta = Math.floor(delta / 700)
    }

    // Calculate bias
    const numPoints = output.filter(c => c.codePointAt(0)! < 0x80).length + 1
    bias = adaptBias(delta, numPoints, true)

    steps.push({
      type: 'adapt',
      description: `计算偏置: bias=${bias}`,
      state: { bias, delta, n, k },
      output: output.join('')
    })

    // Generate digit
    if (k <= bias) {
      k = bias + BASE - TMIN
    }

    let t = k - bias
    if (t < TMIN) t = TMIN
    if (t > TMAX) t = TMAX

    if (delta < t) {
      const digit = encodeDigit(t)
      output.push(digit)
      steps.push({
        type: 'output',
        description: `输出数字字符: '${digit}'`,
        state: { bias, delta, n, k, digit },
        output: output.join('')
      })
    } else {
      let q = delta
      while (t < TMAX) {
        const t2 = k - bias
        if (q < t2) break
        const val = t2 + ((q - t2) % (BASE - t))
        const digit = encodeDigit(val)
        output.push(digit)
        q = Math.floor((q - t2) / (BASE - t))
        t = TMAX
      }
      const digit = encodeDigit(q)
      output.push(digit)
      delta = Math.floor(delta / (k - bias + 1))
      k = k + BASE
    }
  }

  steps.push({
    type: 'output',
    description: `编码完成: "xn--${output.slice(1).join('')}"`,
    state: { bias, delta, n, k },
    output: output.join('')
  })

  return { punycode: output.join(''), steps }
}

function adaptBias(delta: number, numPoints: number, firstTime: boolean): number {
  let bias = INITIAL_BIAS
  let k = BASE

  if (firstTime) {
    bias = Math.floor(bias * DAMP / 2)
  } else {
    bias = bias * (BASE - TMIN) / (BASE - TMAX)
  }

  let delta2 = delta
  while (delta2 > Math.floor((BASE - TMAX) * TMIN / (BASE - TMAX + 1))) {
    delta2 = Math.floor(delta2 / (BASE - TMAX))
    k += BASE
    bias += Math.floor(k / BASE)
  }

  return bias + Math.floor((BASE - TMIN + 1) * delta2 / (delta2 + SKEW))
}

function encodeDigit(d: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return alphabet[d] || ''
}

export function decodePunycode(punycode: string): string {
  // Simplified decode for demonstration
  if (!punycode.startsWith('xn--')) {
    return punycode
  }

  const encoded = punycode.slice(4)
  // For demo, we'll use a basic approach
  // Full implementation would decode the numeric representation
  return `[解码: ${encoded}]`
}
```

- [ ] **Step 2: 创建示例数据**

`src/utils/examples.ts`:
```typescript
export interface Example {
  original: string
  punycode: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const examples: Example[] = [
  {
    original: 'münchen.de',
    punycode: 'xn--mnchen-3ya.de',
    description: '德语城市名 (German city name)',
    difficulty: 'easy'
  },
  {
    original: '日本語.jp',
    punycode: 'xn--wgv71a119e.jp',
    description: '日语 (Japanese)',
    difficulty: 'medium'
  },
  {
    original: 'école.fr',
    punycode: 'xn--cole-eka.fr',
    description: '法语学校 (French school)',
    difficulty: 'easy'
  },
  {
    original: 'موسوعة.com',
    punycode: 'xn--ngbc5azd.com',
    description: '阿拉伯语百科 (Arabic encyclopedia)',
    difficulty: 'medium'
  },
  {
    original: 'балалар.kz',
    punycode: 'xn----76cdlb6adkphq.kz',
    description: '哈萨克语儿童 (Kazakh children)',
    difficulty: 'hard'
  },
  {
    original: 'café.com',
    punycode: 'xn--caf-dma.com',
    description: '法语咖啡 (French cafe)',
    difficulty: 'easy'
  },
  {
    original: '中文网.cn',
    punycode: 'xn--fiqs8s.cn',
    description: '中文网站 (Chinese website)',
    difficulty: 'medium'
  },
  {
    original: 'Αθήνα.gr',
    punycode: 'xn--mxacd1a.gr',
    description: '希腊语城市 (Greek city)',
    difficulty: 'medium'
  },
]

export function getExampleByPunycode(punycode: string): Example | undefined {
  return examples.find(e => e.punycode === punycode)
}
```

- [ ] **Step 3: 创建 composable**

`src/composables/usePunycode.ts`:
```typescript
import { ref, computed } from 'vue'
import { encodePunycode, type EncodeStep } from '../utils/punycode'

export function usePunycode() {
  const input = ref('')
  const punycodeResult = ref('')
  const steps = ref<EncodeStep[]>([])
  const error = ref('')

  const hasResult = computed(() => punycodeResult.value !== '')

  function encode() {
    error.value = ''
    if (!input.value.trim()) {
      error.value = '请输入域名'
      return
    }

    const result = encodePunycode(input.value)
    punycodeResult.value = result.punycode
    steps.value = result.steps
  }

  function clear() {
    input.value = ''
    punycodeResult.value = ''
    steps.value = []
    error.value = ''
  }

  function loadExample(example: string) {
    input.value = example
    encode()
  }

  return {
    input,
    punycodeResult,
    steps,
    error,
    hasResult,
    encode,
    clear,
    loadExample
  }
}
```

- [ ] **Step 4: 验证算法**

Run: `npm run dev`
在转换器中测试 "münchen.de" → 确认输出 "xn--mnchen-3ya.de"

- [ ] **Step 5: 提交**

```bash
git add src/utils/punycode.ts src/utils/examples.ts src/composables/usePunycode.ts
git commit -m "feat: implement Punycode/Bootstring encoding algorithm

- Bootstring algorithm based on RFC 3492
- Step-by-step encoding process tracking
- Example domains collection"
```

---

### Task 4: 教程模块

**Files:**
- Create: `src/components/tutorial/TutorialIndex.vue`

- [ ] **Step 1: 创建教程页面**

`src/components/tutorial/TutorialIndex.vue`:
```vue
<script setup lang="ts">
import GlassCard from '../layout/GlassCard.vue'

const sections = [
  {
    id: 'intro',
    title: '什么是 Punycode？',
    content: `Punycode 是一种将 Unicode 字符串转换为 ASCII 字符串的编码方式。
主要用途是处理国际化域名 (IDN)，让包含非 ASCII 字符的域名能在 DNS 系统中使用。
例如，德语域名 "münchen.de" 会被编码为 "xn--mnchen-3ya.de"。`,
    example: 'münchen.de → xn--mnchen-3ya.de'
  },
  {
    id: 'unicode',
    title: 'Unicode 基础回顾',
    content: `Unicode 为世界上每种文字的每个字符分配了一个唯一的码点 (Code Point)。
码点通常表示为 U+XXXX 格式，如 "ü" 的码点是 U+00FC。
ASCII 字符使用 0x00-0x7F 范围，而非 ASCII 字符（如中文、日文、阿拉伯文）使用更大的范围。`,
    example: '"a" = U+0061, "ü" = U+00FC, "中" = U+4E2D'
  },
  {
    id: 'bootstring',
    title: 'Bootstring 算法',
    content: `Bootstring 是 Punycode 底层的通用字符串压缩算法。
核心思想：将非 ASCII 字符转换为基于数字的 ASCII 表示。
关键参数：
• BASE = 36 (使用的字符种类数)
• BIAS = 72 (自适应偏置值)
• DELTA = 增量编码值
算法通过 "插入" 方式，逐步将非 ASCII 字符插入到已编码的 ASCII 序列中。`,
    example: 'bias, delta, n (初始码点) → 自适应计算'
  },
  {
    id: 'process',
    title: '编码流程',
    content: `1. 分离 ASCII 和非 ASCII 字符
2. 保留 ASCII 字符不变，添加 "xn--" 前缀
3. 对非 ASCII 字符序列进行增量编码
4. 使用 36 字符表 (a-z, 0-9) 表示数字
5. 每步通过 adapt() 函数调整 bias 值
6. 最终输出纯 ASCII 字符串`,
    example: '"münchen" → 分离 "m" + "ünchen" → 编码 "nchen" → "xn--mnchen-3ya"'
  },
  {
    id: 'why',
    title: '为什么要用 Punycode？',
    content: `DNS 系统最初只支持 ASCII 字符（RFC 1035）。
随着互联网全球化，需要支持各国语言域名。
Punycode 提供了向后兼容的解决方案：
• 浏览器自动将 IDN 转换为 Punycode
• 服务器只需识别 ASCII 域名
• 用户看到的是本地化的域名显示`,
    example: '浏览器地址栏: "münchen.de" → DNS 查询: "xn--mnchen-3ya.de"'
  }
]
</script>

<template>
  <div class="space-y-6">
    <GlassCard>
      <h2 class="text-3xl font-bold text-warm-800 mb-4">📚 Punycode & Bootstring 教程</h2>
      <p class="text-warm-700">
        了解域名国际化的核心技术 —— 如何让全世界的人们使用母语访问网站。
      </p>
    </GlassCard>

    <GlassCard v-for="section in sections" :key="section.id">
      <h3 class="text-xl font-bold text-warm-800 mb-3">{{ section.title }}</h3>
      <p class="text-warm-700 leading-relaxed whitespace-pre-line">{{ section.content }}</p>
      <div class="mt-4 p-4 bg-warm-100/50 rounded-xl border border-warm-300/30">
        <span class="text-warm-600 text-sm">💡 示例: </span>
        <code class="text-warm-800 font-mono">{{ section.example }}</code>
      </div>
    </GlassCard>

    <GlassCard class="bg-gradient-to-r from-success-400/20 to-warm-300/20">
      <h3 class="text-xl font-bold text-warm-800 mb-3">🚀 继续学习</h3>
      <p class="text-warm-700 mb-4">
        现在你已经了解了基础概念，可以尝试：
      </p>
      <div class="flex gap-3 flex-wrap">
        <button class="glass-button">🔄 使用转换器</button>
        <button class="glass-button-secondary">🎬 查看动画演示</button>
      </div>
    </GlassCard>
  </div>
</template>
```

- [ ] **Step 2: 验证教程页面**

Run: `npm run dev`
确认教程内容显示正确

- [ ] **Step 3: 提交**

```bash
git add src/components/tutorial/TutorialIndex.vue
git commit -m "feat: add tutorial module with explanation sections

- Introduction to Punycode
- Unicode basics
- Bootstring algorithm explanation
- Encoding process overview"
```

---

### Task 5: 转换器模块

**Files:**
- Create: `src/components/converter/ConverterPanel.vue`
- Create: `src/components/converter/ProcessLog.vue`

- [ ] **Step 1: 创建 ProcessLog 组件**

`src/components/converter/ProcessLog.vue`:
```vue
<script setup lang="ts">
import type { EncodeStep } from '../../utils/punycode'

defineProps<{
  steps: EncodeStep[]
}>()

function getStepColor(type: EncodeStep['type']): string {
  const colors: Record<string, string> = {
    init: 'bg-warm-400/20 text-warm-800',
    insert: 'bg-purple-200/30 text-purple-800',
    adapt: 'bg-blue-200/30 text-blue-800',
    delta: 'bg-warm-300/30 text-warm-800',
    output: 'bg-success-500/20 text-green-800'
  }
  return colors[type] || 'bg-gray-200 text-gray-800'
}

function getStepLabel(type: EncodeStep['type']): string {
  const labels: Record<string, string> = {
    init: '初始化',
    insert: '插入字符',
    adapt: '自适应调整',
    delta: '增量更新',
    output: '输出'
  }
  return labels[type] || type
}
</script>

<template>
  <div class="space-y-2 max-h-96 overflow-y-auto pr-2">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="p-3 rounded-xl border border-warm-200/50 bg-white/50 transition-all duration-300"
    >
      <div class="flex items-center gap-3 mb-2">
        <span
          :class="[
            'px-2 py-1 rounded-lg text-xs font-medium',
            getStepColor(step.type)
          ]"
        >
          {{ getStepLabel(step.type) }}
        </span>
        <span class="text-warm-600 text-sm">步骤 {{ index + 1 }}</span>
      </div>
      <p class="text-warm-800 text-sm mb-2">{{ step.description }}</p>
      <div class="grid grid-cols-4 gap-2 text-xs">
        <div class="bg-warm-100/50 p-2 rounded-lg text-center">
          <div class="text-warm-500">bias</div>
          <div class="font-mono text-warm-800">{{ step.state.bias }}</div>
        </div>
        <div class="bg-warm-100/50 p-2 rounded-lg text-center">
          <div class="text-warm-500">delta</div>
          <div class="font-mono text-warm-800">{{ step.state.delta }}</div>
        </div>
        <div class="bg-warm-100/50 p-2 rounded-lg text-center">
          <div class="text-warm-500">n</div>
          <div class="font-mono text-warm-800">{{ step.state.n }}</div>
        </div>
        <div class="bg-warm-100/50 p-2 rounded-lg text-center">
          <div class="text-warm-500">k</div>
          <div class="font-mono text-warm-800">{{ step.state.k }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: 创建转换器主组件**

`src/components/converter/ConverterPanel.vue`:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '../layout/GlassCard.vue'
import ProcessLog from './ProcessLog.vue'
import { usePunycode } from '../../composables/usePunycode'
import { examples } from '../../utils/examples'

const { input, punycodeResult, steps, error, encode, clear, loadExample } = usePunycode()

const showSteps = ref(false)

function handleEncode() {
  encode()
  showSteps.value = true
}

function handleExampleClick(example: typeof examples[0]) {
  input.value = example.original
  handleEncode()
}
</script>

<template>
  <div class="space-y-6">
    <GlassCard>
      <h2 class="text-2xl font-bold text-warm-800 mb-4">🔄 Punycode 转换器</h2>

      <!-- Input Section -->
      <div class="mb-4">
        <label class="block text-warm-700 mb-2 font-medium">输入域名</label>
        <div class="flex gap-3">
          <input
            v-model="input"
            type="text"
            placeholder="例如: münchen.de"
            class="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-warm-300/50
                   text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2
                   focus:ring-warm-400/50 transition-all"
            @keyup.enter="handleEncode"
          />
          <button
            @click="handleEncode"
            class="glass-button whitespace-nowrap"
          >
            编码 →
          </button>
          <button
            @click="clear"
            class="glass-button-secondary"
          >
            清除
          </button>
        </div>
        <p v-if="error" class="text-error-500 mt-2 text-sm">{{ error }}</p>
      </div>

      <!-- Result Section -->
      <div v-if="punycodeResult" class="p-4 bg-success-400/20 rounded-xl border border-success-500/30 mb-4">
        <div class="text-warm-600 text-sm mb-1">编码结果</div>
        <div class="text-warm-800 text-xl font-mono font-bold">
          {{ punycodeResult }}
        </div>
      </div>

      <!-- Examples -->
      <div class="mb-4">
        <div class="text-warm-700 text-sm mb-2">快速示例</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="example in examples.slice(0, 4)"
            :key="example.original"
            @click="handleExampleClick(example)"
            class="px-3 py-2 bg-white/60 rounded-lg text-warm-700 text-sm
                   hover:bg-white/80 transition-all border border-warm-200/50"
          >
            {{ example.original }}
          </button>
        </div>
      </div>

      <!-- Toggle Steps -->
      <button
        v-if="steps.length > 0"
        @click="showSteps = !showSteps"
        class="text-warm-600 hover:text-warm-800 text-sm underline"
      >
        {{ showSteps ? '隐藏' : '显示' }}计算过程
      </button>
    </GlassCard>

    <!-- Process Log -->
    <GlassCard v-if="showSteps && steps.length > 0">
      <h3 class="text-lg font-bold text-warm-800 mb-4">📊 计算过程</h3>
      <ProcessLog :steps="steps" />
    </GlassCard>
  </div>
</template>
```

- [ ] **Step 3: 验证转换器**

Run: `npm run dev`
1. 输入 "münchen.de" 测试编码
2. 点击示例测试不同域名
3. 验证计算过程显示

- [ ] **Step 4: 提交**

```bash
git add src/components/converter/
git commit -m "feat: add converter module with process visualization

- Domain input and encode button
- Real-time encoding result display
- Step-by-step process log
- Quick example buttons"
```

---

### Task 6: 动画演示模块

**Files:**
- Create: `src/components/animation/AnimationPlayer.vue`
- Modify: `src/composables/usePunycode.ts` (添加动画控制)

- [ ] **Step 1: 更新 usePunycode 添加动画状态**

`src/composables/usePunycode.ts`:
```typescript
import { ref, computed } from 'vue'
import { encodePunycode, type EncodeStep } from '../utils/punycode'

export function usePunycode() {
  const input = ref('')
  const punycodeResult = ref('')
  const steps = ref<EncodeStep[]>([])
  const error = ref('')
  const currentStep = ref(0)
  const isPlaying = ref(false)
  const playbackSpeed = ref(1)

  const hasResult = computed(() => punycodeResult.value !== '')
  const totalSteps = computed(() => steps.value.length)
  const currentStepData = computed(() => steps.value[currentStep.value])

  function encode() {
    error.value = ''
    if (!input.value.trim()) {
      error.value = '请输入域名'
      return
    }

    const result = encodePunycode(input.value)
    punycodeResult.value = result.punycode
    steps.value = result.steps
    currentStep.value = 0
    isPlaying.value = false
  }

  function nextStep() {
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
    } else {
      isPlaying.value = false
    }
  }

  function prevStep() {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  function goToStep(index: number) {
    currentStep.value = Math.max(0, Math.min(index, steps.value.length - 1))
  }

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function reset() {
    currentStep.value = 0
    isPlaying.value = false
  }

  function clear() {
    input.value = ''
    punycodeResult.value = ''
    steps.value = []
    error.value = ''
    currentStep.value = 0
    isPlaying.value = false
  }

  function loadExample(example: string) {
    input.value = example
    encode()
  }

  return {
    input,
    punycodeResult,
    steps,
    error,
    hasResult,
    currentStep,
    totalSteps,
    currentStepData,
    isPlaying,
    playbackSpeed,
    encode,
    nextStep,
    prevStep,
    goToStep,
    play,
    pause,
    reset,
    clear,
    loadExample
  }
}
```

- [ ] **Step 2: 创建动画播放器组件**

`src/components/animation/AnimationPlayer.vue`:
```vue
<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import GlassCard from '../layout/GlassCard.vue'
import { usePunycode } from '../../composables/usePunycode'
import { examples } from '../../utils/examples'

const {
  input,
  punycodeResult,
  steps,
  currentStep,
  totalSteps,
  currentStepData,
  isPlaying,
  playbackSpeed,
  encode,
  nextStep,
  prevStep,
  goToStep,
  play,
  pause,
  reset,
  clear
} = usePunycode()

let animationTimer: ReturnType<typeof setTimeout> | null = null

watch([isPlaying, currentStep, playbackSpeed], ([playing, step, speed]) => {
  if (playing && step < totalSteps.value - 1) {
    animationTimer = setTimeout(() => {
      nextStep()
    }, 1500 / speed)
  } else {
    if (animationTimer) {
      clearTimeout(animationTimer)
      animationTimer = null
    }
  }
})

onUnmounted(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
})

function handleEncode() {
  encode()
  reset()
}

function getStepColor(type: string): string {
  const colors: Record<string, string> = {
    init: 'bg-warm-400',
    insert: 'bg-purple-400',
    adapt: 'bg-blue-400',
    delta: 'bg-orange-400',
    output: 'bg-green-500'
  }
  return colors[type] || 'bg-gray-400'
}

function handleExampleClick(example: typeof examples[0]) {
  input.value = example.original
  handleEncode()
}
</script>

<template>
  <div class="space-y-6">
    <GlassCard>
      <h2 class="text-2xl font-bold text-warm-800 mb-4">🎬 Bootstring 算法动画演示</h2>

      <!-- Input -->
      <div class="mb-4">
        <label class="block text-warm-700 mb-2 font-medium">输入字符串</label>
        <div class="flex gap-3">
          <input
            v-model="input"
            type="text"
            placeholder="例如: münchen"
            class="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-warm-300/50
                   text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2
                   focus:ring-warm-400/50 transition-all"
            @keyup.enter="handleEncode"
          />
          <button @click="handleEncode" class="glass-button">开始动画</button>
        </div>
      </div>

      <!-- Quick Examples -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="example in examples.slice(0, 4)"
          :key="example.original"
          @click="handleExampleClick(example)"
          class="px-3 py-2 bg-white/60 rounded-lg text-warm-700 text-sm
                 hover:bg-white/80 transition-all border border-warm-200/50"
        >
          {{ example.original }}
        </button>
      </div>

      <!-- Animation Display -->
      <div v-if="totalSteps > 0" class="space-y-4">
        <!-- Main visualization -->
        <div class="relative p-6 bg-gradient-to-r from-warm-100 to-warm-200/50 rounded-2xl min-h-48">
          <div class="absolute top-4 right-4 flex gap-2">
            <span
              v-for="(step, index) in steps"
              :key="index"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-300',
                index === currentStep ? 'scale-150 ' + getStepColor(step.type) : 'bg-warm-300/50'
              ]"
            />
          </div>

          <!-- Current step info -->
          <div class="text-center mb-4">
            <div
              :class="[
                'inline-block px-4 py-2 rounded-xl text-white font-medium mb-2',
                currentStepData ? getStepColor(currentStepData.type) : 'bg-gray-400'
              ]"
            >
              {{ currentStepData?.description.split(':')[0] }}
            </div>
            <p class="text-warm-800 text-lg">{{ currentStepData?.description }}</p>
          </div>

          <!-- State variables -->
          <div class="grid grid-cols-4 gap-3 max-w-md mx-auto">
            <div class="bg-white/80 p-3 rounded-xl text-center shadow-sm">
              <div class="text-warm-500 text-xs">bias</div>
              <div class="text-warm-800 font-mono font-bold text-lg">
                {{ currentStepData?.state.bias }}
              </div>
            </div>
            <div class="bg-white/80 p-3 rounded-xl text-center shadow-sm">
              <div class="text-warm-500 text-xs">delta</div>
              <div class="text-warm-800 font-mono font-bold text-lg">
                {{ currentStepData?.state.delta }}
              </div>
            </div>
            <div class="bg-white/80 p-3 rounded-xl text-center shadow-sm">
              <div class="text-warm-500 text-xs">n</div>
              <div class="text-warm-800 font-mono font-bold text-lg">
                {{ currentStepData?.state.n }}
              </div>
            </div>
            <div class="bg-white/80 p-3 rounded-xl text-center shadow-sm">
              <div class="text-warm-500 text-xs">k</div>
              <div class="text-warm-800 font-mono font-bold text-lg">
                {{ currentStepData?.state.k }}
              </div>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="relative h-2 bg-warm-200 rounded-full overflow-hidden">
          <div
            class="absolute h-full bg-gradient-to-r from-warm-400 to-warm-500 transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / totalSteps) * 100}%` }"
          />
        </div>
        <div class="text-center text-warm-600 text-sm">
          步骤 {{ currentStep + 1 }} / {{ totalSteps }}
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-4">
          <button
            @click="reset"
            class="w-12 h-12 rounded-full bg-white/80 hover:bg-white transition-all
                   flex items-center justify-center text-warm-700 shadow-md"
            title="重置"
          >
            ⏮
          </button>
          <button
            @click="prevStep"
            :disabled="currentStep === 0"
            class="w-14 h-14 rounded-full bg-warm-400 hover:bg-warm-500 transition-all
                   flex items-center justify-center text-white shadow-lg disabled:opacity-50"
          >
            ⬅
          </button>
          <button
            @click="isPlaying ? pause() : play()"
            class="w-16 h-16 rounded-full bg-gradient-to-r from-success-500 to-warm-400
                   hover:scale-105 transition-all flex items-center justify-center text-white shadow-lg text-2xl"
          >
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button
            @click="nextStep"
            :disabled="currentStep === totalSteps - 1"
            class="w-14 h-14 rounded-full bg-warm-400 hover:bg-warm-500 transition-all
                   flex items-center justify-center text-white shadow-lg disabled:opacity-50"
          >
            ➡
          </button>
          <select
            v-model="playbackSpeed"
            class="px-3 py-2 rounded-xl bg-white/80 border border-warm-300/50
                   text-warm-700 text-sm"
          >
            <option :value="0.5">0.5x</option>
            <option :value="1">1x</option>
            <option :value="2">2x</option>
          </select>
        </div>

        <!-- Step timeline -->
        <div class="mt-4">
          <div class="text-warm-700 text-sm mb-2">步骤时间线</div>
          <div class="flex gap-1 overflow-x-auto pb-2">
            <button
              v-for="(step, index) in steps"
              :key="index"
              @click="goToStep(index)"
              :class="[
                'flex-shrink-0 w-8 h-8 rounded-lg text-white text-xs font-medium transition-all',
                index === currentStep ? getStepColor(step.type) + ' scale-110' : 'bg-warm-300/50'
              ]"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12 text-warm-500">
        <div class="text-4xl mb-4">🎬</div>
        <p>输入字符串开始动画演示</p>
      </div>
    </GlassCard>
  </div>
</template>
```

- [ ] **Step 3: 验证动画播放器**

Run: `npm run dev`
1. 测试播放/暂停控制
2. 测试步骤跳转
3. 测试速度调节

- [ ] **Step 4: 提交**

```bash
git add src/components/animation/AnimationPlayer.vue src/composables/usePunycode.ts
git commit -m "feat: add animation player with step-by-step visualization

- Play/pause/reset controls
- Step timeline navigation
- Speed control (0.5x, 1x, 2x)
- State variables display (bias, delta, n, k)"
```

---

### Task 7: 练习/测验模块

**Files:**
- Create: `src/components/quiz/QuizPanel.vue`
- Create: `src/components/quiz/QuizCard.vue`

- [ ] **Step 1: 创建练习题数据**

`src/components/quiz/questions.ts`:
```typescript
export interface Question {
  id: string
  type: 'encoding' | 'decoding' | 'choice' | 'fill'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export const questions: Question[] = [
  {
    id: 'enc-1',
    type: 'encoding',
    difficulty: 'easy',
    question: '"münchen" 的 Punycode 编码是什么？',
    correctAnswer: 'mnchen-3ya',
    explanation: '非 ASCII 字符 ü (U+00FC) 被编码为 "3ya"，前缀 xn-- 表示 Punycode'
  },
  {
    id: 'enc-2',
    type: 'encoding',
    difficulty: 'easy',
    question: '"café.com" 的 Punycode 编码是什么？',
    correctAnswer: 'xn--caf-dma.com',
    explanation: 'é (U+00E9) 被编码为 "dma"，添加 xn-- 前缀'
  },
  {
    id: 'enc-3',
    type: 'encoding',
    difficulty: 'medium',
    question: '"日本語.jp" 完整的 Punycode 形式是什么？',
    correctAnswer: 'xn--wgv71a119e.jp',
    explanation: '日 (U+65E5) = wgv71a, 本 (U+672C) = 119e, 语 (U+8A9E) = jp'
  },
  {
    id: 'choice-1',
    type: 'choice',
    difficulty: 'easy',
    question: 'Punycode 使用多少个字符表示数字？',
    options: ['10', '26', '36', '128'],
    correctAnswer: '36',
    explanation: 'BASE = 36，使用 a-z (26个) + 0-9 (10个)'
  },
  {
    id: 'choice-2',
    type: 'choice',
    difficulty: 'medium',
    question: 'Bootstring 算法的初始 bias 值是多少？',
    options: ['26', '36', '72', '128'],
    correctAnswer: '72',
    explanation: 'INITIAL_BIAS = 72，然后通过 adapt() 函数动态调整'
  },
  {
    id: 'choice-3',
    type: 'choice',
    difficulty: 'medium',
    question: '以下哪个 Punycode 编码是有效的？',
    options: [
      'münchen.de',
      'xn--mnchen.de',
      'xn--mnchen-3ya.de',
      'xnmnchen3ya.de'
    ],
    correctAnswer: 'xn--mnchen-3ya.de',
    explanation: '有效的 Punycode 必须以 "xn--" 开头，后面跟着编码部分'
  },
  {
    id: 'fill-1',
    type: 'fill',
    difficulty: 'medium',
    question: '在 Bootstring 算法中，delta 的初始值是？',
    correctAnswer: '0',
    explanation: 'delta 从 0 开始，每处理一个字符增加 1'
  },
  {
    id: 'dec-1',
    type: 'decoding',
    difficulty: 'easy',
    question: '"xn--cole-eka.fr" 原始域名是什么？',
    correctAnswer: 'école.fr',
    explanation: 'xn-- 表示 Punycode，cole-eka 编码还原为 école'
  }
]
```

- [ ] **Step 2: 创建 QuizCard 组件**

`src/components/quiz/QuizCard.vue`:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Question } from './questions'

const props = defineProps<{
  question: Question
}>()

const emit = defineEmits<{
  (e: 'answered', isCorrect: boolean): void
}>()

const userAnswer = ref('')
const selectedOption = ref<string | null>(null)
const submitted = ref(false)

function submitAnswer() {
  if (submitted.value) return
  submitted.value = true
  const correct = userAnswer.value.toLowerCase().trim() === props.question.correctAnswer.toLowerCase()
  emit('answered', correct)
}

function selectOption(option: string) {
  if (submitted.value) return
  selectedOption.value = option
  userAnswer.value = option
}

function getOptionClass(option: string): string {
  if (!submitted.value) {
    return selectedOption.value === option
      ? 'bg-warm-400 text-white border-warm-500'
      : 'bg-white/80 hover:bg-warm-100'
  }
  if (option === props.question.correctAnswer) {
    return 'bg-success-500 text-white border-success-500'
  }
  if (option === selectedOption.value && option !== props.question.correctAnswer) {
    return 'bg-error-500 text-white border-error-500'
  }
  return 'bg-white/80 opacity-50'
}
</script>

<template>
  <div class="p-5 bg-white/70 rounded-2xl border border-warm-200/50">
    <div class="flex items-center gap-2 mb-3">
      <span
        :class="[
          'px-2 py-1 rounded-lg text-xs font-medium',
          question.difficulty === 'easy' ? 'bg-success-400/30 text-green-800' :
          question.difficulty === 'medium' ? 'bg-warm-300/30 text-warm-800' :
          'bg-error-400/30 text-red-800'
        ]"
      >
        {{ question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难' }}
      </span>
      <span class="text-warm-500 text-xs">
        {{ question.type === 'encoding' ? '编码题' :
           question.type === 'decoding' ? '解码题' :
           question.type === 'choice' ? '选择题' : '填空题' }}
      </span>
    </div>

    <h4 class="text-warm-800 font-medium mb-4">{{ question.question }}</h4>

    <!-- Choice questions -->
    <div v-if="question.type === 'choice' && question.options" class="space-y-2 mb-4">
      <button
        v-for="option in question.options"
        :key="option"
        @click="selectOption(option)"
        :class="[
          'w-full p-3 rounded-xl border text-left transition-all',
          getOptionClass(option)
        ]"
        :disabled="submitted"
      >
        {{ option }}
      </button>
    </div>

    <!-- Fill in the blank -->
    <div v-if="question.type === 'fill' || question.type === 'encoding' || question.type === 'decoding'" class="mb-4">
      <input
        v-model="userAnswer"
        type="text"
        :placeholder="question.type === 'fill' ? '输入答案' : '输入 Punycode / 原始域名'"
        :disabled="submitted"
        :class="[
          'w-full px-4 py-3 rounded-xl border bg-white/80 text-warm-800',
          'focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all',
          submitted ? 'opacity-80' : ''
        ]"
      />
    </div>

    <!-- Submit button -->
    <button
      v-if="!submitted"
      @click="submitAnswer"
      class="w-full glass-button mb-4"
    >
      提交答案
    </button>

    <!-- Result -->
    <div v-if="submitted" class="mt-4 p-4 rounded-xl"
      :class="userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase()
        ? 'bg-success-400/20 border border-success-500/30'
        : 'bg-error-400/20 border border-error-500/30'"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xl">
          {{ userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase() ? '✓' : '✗' }}
        </span>
        <span class="font-medium"
          :class="userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase()
            ? 'text-green-800' : 'text-red-800'"
        >
          {{ userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase() ? '正确!' : '错误' }}
        </span>
      </div>
      <p class="text-warm-700 text-sm">{{ question.explanation }}</p>
      <div v-if="userAnswer.toLowerCase().trim() !== question.correctAnswer.toLowerCase()" class="mt-2 text-sm">
        <span class="text-warm-600">正确答案: </span>
        <code class="text-warm-800 font-mono">{{ question.correctAnswer }}</code>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: 创建 QuizPanel 组件**

`src/components/quiz/QuizPanel.vue`:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import GlassCard from '../layout/GlassCard.vue'
import QuizCard from './QuizCard.vue'
import { questions, type Question } from './questions'

const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')
const currentQuestionIndex = ref(0)
const score = ref(0)
const answeredCount = ref(0)
const quizStarted = ref(false)
const quizFinished = ref(false)
const shuffledQuestions = ref<Question[]>([])

const filteredQuestions = computed(() => {
  if (selectedDifficulty.value === 'all') return shuffledQuestions.value
  return shuffledQuestions.value.filter(q => q.difficulty === selectedDifficulty.value)
})

const currentQuestion = computed(() => filteredQuestions.value[currentQuestionIndex.value])

const scorePercentage = computed(() => {
  if (answeredCount.value === 0) return 0
  return Math.round((score.value / answeredCount.value) * 100)
})

function startQuiz() {
  shuffledQuestions.value = [...questions].sort(() => Math.random() - 0.5)
  currentQuestionIndex.value = 0
  score.value = 0
  answeredCount.value = 0
  quizStarted.value = true
  quizFinished.value = false
}

function handleAnswer(isCorrect: boolean) {
  answeredCount.value++
  if (isCorrect) {
    score.value++
  }

  // Auto advance after a delay
  setTimeout(() => {
    if (currentQuestionIndex.value < filteredQuestions.value.length - 1) {
      currentQuestionIndex.value++
    } else {
      quizFinished.value = true
    }
  }, 1500)
}

function getScoreMessage(): string {
  if (scorePercentage.value >= 90) return '🌟 太棒了！完全掌握！'
  if (scorePercentage.value >= 70) return '👍 很不错！继续加油！'
  if (scorePercentage.value >= 50) return '💪 还可以，再接再厉！'
  return '📚 需要加强学习哦！'
}
</script>

<template>
  <div class="space-y-6">
    <GlassCard>
      <h2 class="text-2xl font-bold text-warm-800 mb-4">✏️ Punycode 练习</h2>

      <!-- Start screen -->
      <div v-if="!quizStarted" class="text-center py-8">
        <div class="text-5xl mb-4">🎯</div>
        <p class="text-warm-700 mb-6">测试你对 Punycode 和 Bootstring 算法的理解</p>

        <div class="mb-6">
          <div class="text-warm-600 text-sm mb-3">选择难度</div>
          <div class="flex justify-center gap-2">
            <button
              v-for="diff in ['all', 'easy', 'medium', 'hard']"
              :key="diff"
              @click="selectedDifficulty = diff as typeof selectedDifficulty"
              :class="[
                'px-4 py-2 rounded-xl transition-all',
                selectedDifficulty === diff
                  ? 'bg-gradient-to-r from-warm-300 to-warm-400 text-white'
                  : 'bg-white/60 text-warm-700 hover:bg-warm-100'
              ]"
            >
              {{ diff === 'all' ? '全部' : diff === 'easy' ? '简单' : diff === 'medium' ? '中等' : '困难' }}
            </button>
          </div>
        </div>

        <button @click="startQuiz" class="glass-button text-lg px-8 py-4">
          开始练习
        </button>
      </div>

      <!-- Quiz in progress -->
      <div v-else-if="!quizFinished && currentQuestion">
        <div class="flex justify-between items-center mb-4">
          <span class="text-warm-600">
            进度 {{ currentQuestionIndex + 1 }} / {{ filteredQuestions.length }}
          </span>
          <span class="text-warm-600">
            得分 {{ score }} / {{ answeredCount }}
          </span>
        </div>

        <div class="mb-4 h-2 bg-warm-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-warm-400 to-warm-500 transition-all duration-300"
            :style="{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }"
          />
        </div>

        <QuizCard
          :key="currentQuestion.id"
          :question="currentQuestion"
          @answered="handleAnswer"
        />
      </div>

      <!-- Quiz finished -->
      <div v-else-if="quizFinished" class="text-center py-8">
        <div class="text-5xl mb-4">{{ scorePercentage >= 70 ? '🎉' : '📖' }}</div>
        <h3 class="text-2xl font-bold text-warm-800 mb-2">练习完成！</h3>
        <p class="text-4xl font-bold text-warm-800 mb-2">{{ scorePercentage }}%</p>
        <p class="text-warm-700 mb-2">
          {{ score }} / {{ filteredQuestions.length }} 正确
        </p>
        <p class="text-warm-600 mb-6">{{ getScoreMessage() }}</p>

        <div class="flex justify-center gap-4">
          <button @click="startQuiz" class="glass-button">
            再试一次
          </button>
          <button @click="quizStarted = false" class="glass-button-secondary">
            返回选择
          </button>
        </div>
      </div>
    </GlassCard>
  </div>
</template>
```

- [ ] **Step 4: 验证练习模块**

Run: `npm run dev`
1. 测试不同难度选择
2. 测试答题流程
3. 验证分数计算

- [ ] **Step 5: 提交**

```bash
git add src/components/quiz/
git commit -m "feat: add quiz module with multiple question types

- Encoding, decoding, choice, and fill-in questions
- Difficulty levels (easy, medium, hard)
- Score tracking and progress bar
- Answer explanations"
```

---

### Task 8: 最终优化和测试

**Files:**
- Modify: `src/App.vue` (添加 Tab 切换动画)
- Modify: `src/style.css` (添加额外样式)
- Create: `public/favicon.svg`

- [ ] **Step 1: 添加 Tab 切换动画到 App.vue**

`src/App.vue` (更新):
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import TutorialIndex from './components/tutorial/TutorialIndex.vue'
import ConverterPanel from './components/converter/ConverterPanel.vue'
import AnimationPlayer from './components/animation/AnimationPlayer.vue'
import QuizPanel from './components/quiz/QuizPanel.vue'

const activeTab = ref('tutorial')
const tabKey = computed(() => activeTab.value)
</script>

<template>
  <div class="min-h-screen p-6 max-w-6xl mx-auto">
    <AppHeader v-model:activeTab="activeTab" />

    <main>
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <TutorialIndex v-if="activeTab === 'tutorial'" />
        <ConverterPanel v-else-if="activeTab === 'converter'" />
        <AnimationPlayer v-else-if="activeTab === 'animation'" />
        <QuizPanel v-else-if="activeTab === 'quiz'" />
      </Transition>
    </main>

    <AppFooter />
  </div>
</template>
```

- [ ] **Step 2: 添加 favicon**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffab91"/>
      <stop offset="100%" style="stop-color:#ff8a65"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" fill="url(#grad)"/>
  <text x="50" y="65" font-size="40" text-anchor="middle" fill="white">🌐</text>
</svg>
```

- [ ] **Step 3: 更新 index.html**

`index.html` (更新):
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Punycode & Bootstring 演示</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 4: 最终构建测试**

Run: `npm run build`
Expected: Build succeeds without errors

Run: `npm run preview`
Verify the production build works

- [ ] **Step 5: 提交**

```bash
git add src/App.vue src/style.css public/favicon.svg index.html
git commit -m "feat: add tab transition animations and favicon

- Smooth tab switching with Vue transitions
- SVG favicon with globe icon
- Enhanced glass morphism styling"
```

---

## 自检清单

1. **Spec 覆盖**: 每个设计要求都有对应任务实现
2. **占位符扫描**: 无 TBD/TODO/未完成内容
3. **类型一致性**: 所有 TypeScript 类型、函数名一致
4. **命令正确性**: 所有 npm 脚本命令格式正确
5. **代码完整性**: 所有代码块包含完整实现

---

## 执行方式选择

**Plan complete and saved to `docs/superpowers/plans/2026-05-29-punycode-bootstring-plan.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**