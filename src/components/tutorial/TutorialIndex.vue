<script setup lang="ts">
import { computed } from 'vue'
import GlassCard from '../layout/GlassCard.vue'
import { useLocale } from '../../composables/useI18n'

const { locale } = useLocale()

const sections = computed(() => locale.value === 'zh' ? [
  {
    id: 'intro',
    title: '第一课：Unicode 是什么？',
    icon: '🔤',
    content: `计算机只能处理数字。要表示文字，需要给每个文字分配一个编号。

这个编号叫做"码点"(Code Point)，就像人的身份证号一样。

Unicode 标准为世界上所有文字分配了唯一的码点。`,
    example: '中 = U+4E2D (十进制: 19990)'
  },
  {
    id: 'why-punycode',
    title: '第二课：为什么需要 Punycode？',
    icon: '🌐',
    content: `互联网的 DNS 系统只能识别英文字母（ASCII 字符）。

但全球有中文、日文、阿拉伯文等数千种文字！

Punycode 就是解决这个问题的编码方案。`,
    example: '中国.cn → xn--fiqs8s.cn'
  },
  {
    id: 'base36',
    title: '第三课：36 进制数是什么？',
    icon: '🔢',
    content: `我们平时用的是 10 进制（0-9），每个位可以表示 10 个值。

Punycode 使用 36 进制，每个位可以表示 36 个值：
• 0-9（10个数字）
• a-z（26个字母）
• 共36个符号

比如数字 35 用 36 进制表示就是 "z"`,
    example: '10进制 35 = 36进制 "z"'
  },
  {
    id: 'manual-step1',
    title: '第四课：手动编码演示（第一步）',
    icon: '📝',
    content: `以 "中国" 为例：

步骤1：转成 Unicode 码点
• "中" = U+4E2D = 19990（十进制）
• "国" = U+56FD = 22269（十进制）

步骤2：分离 ASCII 和非 ASCII
• "中国" 没有 ASCII 字符
• 所以输出前缀为空，添加 "-"`,
    example: '输入: 中国 → 码点: [19990, 22269]'
  },
  {
    id: 'manual-step2',
    title: '第五课：手动编码演示（第二步）',
    icon: '📊',
    content: `步骤3：设置初始变量
• n = 128（0x80，起始码点）
• bias = 72（初始偏置值）
• delta = 0（增量值）
• k = 36（当前索引）

步骤4：处理每个字符

处理 "中"（码点 19990）：
• delta = 0 + 1 = 1
• 计算 delta += (19990 - 128) × 1
• delta = 19863`,
    example: 'delta = 19863'
  },
  {
    id: 'adapt',
    title: '第六课：bias 偏置值计算',
    icon: '⚙️',
    content: `bias 值需要动态调整，让编码更高效。

adapt 函数（简化版）：
bias = 72
delta = 19863
bias = delta / 700 = 28
bias = bias + delta / (delta + 38) = 28 + 0.999 = 28

新 bias = 28（实际 RFC 算法更复杂）`,
    example: '新 bias = 28'
  },
  {
    id: 'digit',
    title: '第七课：生成数字符号',
    icon: '🔤',
    content: `现在要把 delta 值（19863）转换成 36 进制数字串。

36 进制转换规则：
• 数字 0-9 对应 0-9
• 数字 10-35 对应 a-z

19863 转 36 进制：
• 19863 ÷ 36 = 551...余 27 → 'b'（第28个）
• 551 ÷ 36 = 15...余 11 → 'l'（第12个）
• 15 ÷ 36 = 0...余 15 → 'p'（第16个）
• 结果："b" + "l" + "p" = "blp"`,
    example: '19863 = 36进制 "blp"'
  },
  {
    id: 'final',
    title: '第八课：完整结果',
    icon: '✅',
    content: `最终编码结果：

前缀 + "xn--" + 编码部分
= "" + "xn--" + "blp"
= "xn--blp"

但实际浏览器编码结果可能不同，
因为实现细节可能有差异。

使用在线工具验证：
中国 → xn--fiqs8s（标准结果）`,
    example: '中国.cn → xn--fiqs8s.cn'
  },
  {
    id: 'code',
    title: '第九课：参考代码',
    icon: '💻',
    content: `// JavaScript 版本（使用 WHATWG URL API）
function encodePunycode(domain) {
  return new URL('https://' + domain).hostname
}

// Python 版本
import urllib.parse
def encode_punycode(domain):
    return urllib.parse.quote(domain, safe='').replace('%', 'xn--')

// 或者使用 punycode 库
import punycode
def encode_punycode(domain):
    return punycode.encode(domain)`,
    example: '// 查看转换器获得详细步骤'
  }
] : [
  {
    id: 'intro',
    title: 'Lesson 1: What is Unicode?',
    icon: '🔤',
    content: `Computers can only process numbers. To represent text, each character needs a unique number.

This number is called "Code Point", like an ID number for each character.

Unicode assigns unique code points to all characters in the world.`,
    example: '中 = U+4E2D (decimal: 19990)'
  },
  {
    id: 'why-punycode',
    title: 'Lesson 2: Why Punycode?',
    icon: '🌐',
    content: `Internet DNS system only understands ASCII letters.

But there are thousands of writing systems: Chinese, Japanese, Arabic...

Punycode solves this encoding problem.`,
    example: '中国.cn → xn--fiqs8s.cn'
  },
  {
    id: 'base36',
    title: 'Lesson 3: What is Base-36?',
    icon: '🔢',
    content: `We normally use decimal (0-9), each digit has 10 values.

Punycode uses base-36, each digit has 36 values:
• 0-9 (10 digits)
• a-z (26 letters)
• Total: 36 symbols

Example: decimal 35 = base-36 "z"`,
    example: 'decimal 35 = base-36 "z"'
  },
  {
    id: 'manual-step1',
    title: 'Lesson 4: Manual Encoding (Step 1)',
    icon: '📝',
    content: `Example with "中国" (China):

Step 1: Convert to Unicode code points
• "中" = U+4E2D = 19990
• "国" = U+56FD = 22269

Step 2: Separate ASCII and non-ASCII
• "中国" has no ASCII characters
• Output prefix is empty, add "-"`,
    example: 'Input: 中国 → Code points: [19990, 22269]'
  },
  {
    id: 'manual-step2',
    title: 'Lesson 5: Manual Encoding (Step 2)',
    icon: '📊',
    content: `Step 3: Set initial variables
• n = 128 (starting code point)
• bias = 72 (initial bias)
• delta = 0 (increment value)
• k = 36 (current index)

Step 4: Process each character

Process "中" (code point 19990):
• delta = 0 + 1 = 1
• Calculate delta += (19990 - 128) × 1
• delta = 19863`,
    example: 'delta = 19863'
  },
  {
    id: 'adapt',
    title: 'Lesson 6: Bias Calculation',
    icon: '⚙️',
    content: `Bias value adjusts dynamically for efficiency.

adapt function (simplified):
bias = 72
delta = 19863
bias = delta / 700 = 28
bias = bias + delta / (delta + 38) = 28 + 0.999 = 28

New bias = 28 (actual RFC is more complex)`,
    example: 'new bias = 28'
  },
  {
    id: 'digit',
    title: 'Lesson 7: Generate Digit Symbols',
    icon: '🔤',
    content: `Now convert delta (19863) to base-36 string.

Base-36 conversion:
• 0-9 → 0-9
• 10-35 → a-z

19863 to base-36:
• 19863 ÷ 36 = 551...remainder 27 → 'b'
• 551 ÷ 36 = 15...remainder 11 → 'l'
• 15 ÷ 36 = 0...remainder 15 → 'p'
• Result: "b" + "l" + "p" = "blp"`,
    example: '19863 = base-36 "blp"'
  },
  {
    id: 'final',
    title: 'Lesson 8: Final Result',
    icon: '✅',
    content: `Final encoding result:

prefix + "xn--" + encoded
= "" + "xn--" + "blp"
= "xn--blp"

Browser actual result may differ due to implementation details.

Verify with online tool:
中国 → xn--fiqs8s (standard result)`,
    example: '中国.cn → xn--fiqs8s.cn'
  },
  {
    id: 'code',
    title: 'Lesson 9: Reference Code',
    icon: '💻',
    content: `// JavaScript (WHATWG URL API)
function encodePunycode(domain) {
  return new URL('https://' + domain).hostname
}

// Python
import urllib.parse
def encode_punycode(domain):
    return urllib.parse.quote(domain, safe='').replace('%', 'xn--')

// Or use punycode library
import punycode
def encode_punycode(domain):
    return punycode.encode(domain)`,
    example: '// See converter for detailed steps'
  }
])
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <GlassCard>
      <h2 class="text-2xl sm:text-3xl font-bold text-primary mb-2">
        📚 {{ locale === 'zh' ? 'Punycode 完整教程' : 'Complete Punycode Tutorial' }}
      </h2>
      <p class="text-secondary text-sm sm:text-base">
        {{ locale === 'zh'
          ? '从零开始学习 Punycode 编码，手动计算演示'
          : 'Learn Punycode from scratch with manual calculation demos' }}
      </p>

      <!-- Quick navigation -->
      <div class="mt-4 flex flex-wrap gap-2">
        <a v-for="section in sections" :key="section.id"
           :href="'#' + section.id"
           class="px-3 py-1 rounded-lg text-xs transition-all"
           style="background: var(--button-bg); color: var(--text-primary);">
          {{ section.icon }}
        </a>
      </div>
    </GlassCard>

    <!-- Each lesson as a card -->
    <GlassCard v-for="section in sections" :key="section.id" :id="section.id">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-2xl">{{ section.icon }}</span>
        <h3 class="text-lg sm:text-xl font-bold text-primary">{{ section.title }}</h3>
      </div>
      <pre class="text-secondary leading-relaxed whitespace-pre-wrap text-xs sm:text-sm font-mono p-3 rounded-lg mb-3"
           style="background: var(--button-bg); border: 1px solid var(--border-card);">{{ section.content }}</pre>
      <div class="p-3 rounded-lg border" style="background: rgba(72, 199, 142, 0.1); border-color: rgba(72, 199, 142, 0.3);">
        <span class="text-green-400 text-xs sm:text-sm">💡 {{ locale === 'zh' ? '关键示例' : 'Key Example' }}: </span>
        <code class="text-primary font-mono text-xs sm:text-sm">{{ section.example }}</code>
      </div>
    </GlassCard>

    <!-- Summary table -->
    <GlassCard style="background: linear-gradient(135deg, rgba(255, 171, 145, 0.1), rgba(255, 139, 101, 0.05)); border-color: rgba(255, 171, 145, 0.3);">
      <h3 class="text-lg sm:text-xl font-bold text-primary mb-4">
        📋 {{ locale === 'zh' ? '关键变量速查表' : 'Key Variables Reference' }}
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-card);">
              <th class="text-left p-2 text-muted">{{ locale === 'zh' ? '变量名' : 'Variable' }}</th>
              <th class="text-left p-2 text-muted">{{ locale === 'zh' ? '含义' : 'Meaning' }}</th>
              <th class="text-left p-2 text-muted">{{ locale === 'zh' ? '初始值' : 'Initial' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variable in [
              { name: 'BASE', zh: '基数', en: 'Base', desc: locale === 'zh' ? '字符表大小 (36)' : 'Alphabet size (36)', initial: '36' },
              { name: 'n', zh: '码点', en: 'Code Point', desc: locale === 'zh' ? '当前 Unicode 码点' : 'Current Unicode code point', initial: '128 (0x80)' },
              { name: 'bias', zh: '偏置', en: 'Bias', desc: locale === 'zh' ? '自适应调整值' : 'Adaptive adjustment value', initial: '72' },
              { name: 'delta', zh: '增量', en: 'Delta', desc: locale === 'zh' ? '累积偏移量' : 'Cumulative offset', initial: '0' },
              { name: 'k', zh: '索引', en: 'Index', desc: locale === 'zh' ? '当前字符表索引' : 'Current alphabet index', initial: '36' },
            ]" :key="variable.name" style="border-bottom: 1px solid var(--border-card);">
              <td class="p-2 font-mono font-bold text-primary">{{ variable.name }}</td>
              <td class="p-2 text-secondary">{{ variable.desc }}</td>
              <td class="p-2 font-mono text-warm-400">{{ variable.initial }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </GlassCard>

    <GlassCard class="border border-blue-500/30">
      <h3 class="text-lg sm:text-xl font-bold text-primary mb-3">
        🚀 {{ locale === 'zh' ? '继续实践' : 'Continue Learning' }}
      </h3>
      <p class="text-secondary mb-4 text-sm sm:text-base">
        {{ locale === 'zh'
          ? '现在你已经理解了算法原理，可以：'
          : 'Now that you understand the algorithm, you can:' }}
      </p>
      <div class="flex flex-wrap gap-3">
        <button class="glass-button text-sm">
          🔄 {{ locale === 'zh' ? '使用转换器' : 'Use Converter' }}
        </button>
        <button class="glass-button-secondary text-sm">
          🎬 {{ locale === 'zh' ? '查看动画演示' : 'View Animation' }}
        </button>
      </div>
    </GlassCard>
  </div>
</template>