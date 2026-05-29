import { ref, computed } from 'vue'

export type Locale = 'zh' | 'en'

const currentLocale = ref<Locale>('zh')

export function useLocale() {
  const isZh = computed(() => currentLocale.value === 'zh')
  const isEn = computed(() => currentLocale.value === 'en')

  function setLocale(locale: Locale) {
    currentLocale.value = locale
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
  }

  function toggleLocale() {
    setLocale(currentLocale.value === 'zh' ? 'en' : 'zh')
  }

  // Initialize from localStorage
  const stored = localStorage.getItem('locale') as Locale | null
  if (stored && (stored === 'zh' || stored === 'en')) {
    currentLocale.value = stored
  }

  return {
    locale: currentLocale,
    isZh,
    isEn,
    setLocale,
    toggleLocale
  }
}

// Translation dictionary
const translations: Record<string, Record<Locale, string>> = {
  // Header
  'nav.tutorial': { zh: '📚 教程', en: '📚 Tutorial' },
  'nav.converter': { zh: '🔄 转换器', en: '🔄 Converter' },
  'nav.animation': { zh: '🎬 动画演示', en: '🎬 Animation' },
  'nav.quiz': { zh: '✏️ 练习', en: '✏️ Quiz' },

  // Footer
  'footer.rfc': { zh: '基于 RFC 3492 (Punycode) 和 RFC 3492 (Bootstring) 标准', en: 'Based on RFC 3492 (Punycode) and RFC 3492 (Bootstring)' },
  'footer.privacy': { zh: '纯前端演示 · 无数据上传', en: 'Pure frontend demo · No data upload' },

  // Tutorial
  'tutorial.title': { zh: 'Punycode & Bootstring 教程', en: 'Punycode & Bootstring Tutorial' },
  'tutorial.subtitle': { zh: '了解域名国际化的核心技术', en: 'Learn the core technology of internationalized domain names' },
  'tutorial.continue': { zh: '继续学习', en: 'Continue Learning' },
  'tutorial.tryConverter': { zh: '🔄 使用转换器', en: '🔄 Use Converter' },
  'tutorial.viewAnimation': { zh: '🎬 查看动画演示', en: '🎬 View Animation' },

  // Converter
  'converter.title': { zh: 'Punycode 转换器', en: 'Punycode Converter' },
  'converter.input': { zh: '输入域名', en: 'Input Domain' },
  'converter.encode': { zh: '编码', en: 'Encode' },
  'converter.decode': { zh: '解码', en: 'Decode' },
  'converter.clear': { zh: '清除', en: 'Clear' },
  'converter.result': { zh: '编码结果', en: 'Encoded Result' },
  'converter.original': { zh: '解码结果', en: 'Decoded Result' },
  'converter.examples': { zh: '快速示例', en: 'Quick Examples' },
  'converter.process': { zh: '显示/隐藏计算过程', en: 'Show/Hide Process' },
  'converter.calculations': { zh: '📊 计算过程', en: '📊 Calculations' },
  'converter.placeholder': { zh: '例如: abc中国xyz.cn', en: 'e.g.: abc中国xyz.cn' },

  // Animation
  'animation.title': { zh: 'Bootstring 算法动画演示', en: 'Bootstring Algorithm Animation' },
  'animation.input': { zh: '输入字符串', en: 'Input String' },
  'animation.start': { zh: '开始动画', en: 'Start Animation' },
  'animation.empty': { zh: '输入字符串开始动画演示', en: 'Enter a string to start animation' },
  'animation.timeline': { zh: '步骤时间线', en: 'Step Timeline' },
  'animation.steps': { zh: '步骤', en: 'Step' },

  // Quiz
  'quiz.title': { zh: 'Punycode 练习', en: 'Punycode Quiz' },
  'quiz.subtitle': { zh: '测试你对 Punycode 和 Bootstring 算法的理解', en: 'Test your understanding of Punycode and Bootstring' },
  'quiz.difficulty': { zh: '选择难度', en: 'Select Difficulty' },
  'quiz.all': { zh: '全部', en: 'All' },
  'quiz.easy': { zh: '简单', en: 'Easy' },
  'quiz.medium': { zh: '中等', en: 'Medium' },
  'quiz.hard': { zh: '困难', en: 'Hard' },
  'quiz.start': { zh: '开始练习', en: 'Start Quiz' },
  'quiz.progress': { zh: '进度', en: 'Progress' },
  'quiz.score': { zh: '得分', en: 'Score' },
  'quiz.complete': { zh: '练习完成！', en: 'Quiz Complete!' },
  'quiz.tryAgain': { zh: '再试一次', en: 'Try Again' },
  'quiz.back': { zh: '返回选择', en: 'Back' },
  'quiz.correct': { zh: '正确!', en: 'Correct!' },
  'quiz.wrong': { zh: '错误', en: 'Wrong' },
  'quiz.answer': { zh: '正确答案:', en: 'Correct Answer:' },
  'quiz.submit': { zh: '提交答案', en: 'Submit' },
  'quiz.encoding': { zh: '编码题', en: 'Encoding' },
  'quiz.decoding': { zh: '解码题', en: 'Decoding' },
  'quiz.choice': { zh: '选择题', en: 'Choice' },
  'quiz.fill': { zh: '填空题', en: 'Fill-in' },

  // Step types
  'step.init': { zh: '初始化', en: 'Initialize' },
  'step.insert': { zh: '插入字符', en: 'Insert Char' },
  'step.adapt': { zh: '自适应调整', en: 'Adapt' },
  'step.delta': { zh: '增量更新', en: 'Delta' },
  'step.output': { zh: '输出', en: 'Output' },

  // Variables
  'var.bias': { zh: '偏置', en: 'Bias' },
  'var.delta': { zh: '增量', en: 'Delta' },
  'var.n': { zh: '码点', en: 'Code Point' },
  'var.k': { zh: '索引', en: 'Index' },
}

export function t(key: string): string {
  const locale = currentLocale.value
  return translations[key]?.[locale] || key
}

export function useT() {
  return {
    t: (key: string) => t(key)
  }
}