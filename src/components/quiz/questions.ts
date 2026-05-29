export type QuestionType = 'single' | 'multi' | 'truefalse'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  type: QuestionType
  difficulty: Difficulty
  question: string
  options?: string[]
  correctAnswer: string | string[]  // string for single/truefalse, string[] for multi
  explanation: string
}

export const questions: Question[] = [
  // True/False questions - Easy
  {
    id: 'tf-1',
    type: 'truefalse',
    difficulty: 'easy',
    question: 'Unicode 为世界上所有文字分配了唯一的码点。',
    correctAnswer: 'true',
    explanation: 'Unicode 标准为世界上大多数书写系统中的每个字符分配了唯一的码点 (Code Point)。'
  },
  {
    id: 'tf-2',
    type: 'truefalse',
    difficulty: 'easy',
    question: 'Punycode 编码后的域名以 "xn--" 开头。',
    correctAnswer: 'true',
    explanation: '是的，这是 Punycode 的标准格式，用于标识后续内容是 IDN 编码。'
  },
  {
    id: 'tf-3',
    type: 'truefalse',
    difficulty: 'easy',
    question: '"中国" 的 Unicode 码点是 U+4E2D 和 U+56FD。',
    correctAnswer: 'true',
    explanation: '"中"=U+4E2D, "国"=U+56FD，这是正确的 Unicode 码点。'
  },
  {
    id: 'tf-4',
    type: 'truefalse',
    difficulty: 'medium',
    question: 'Base-36 使用 26 个字母和 10 个数字表示数值。',
    correctAnswer: 'true',
    explanation: 'Base-36 = 0-9 (10个数字) + a-z (26个字母) = 36 个符号。'
  },
  {
    id: 'tf-5',
    type: 'truefalse',
    difficulty: 'medium',
    question: 'Bootstring 算法的初始 bias 值是 128。',
    correctAnswer: 'false',
    explanation: '初始 bias 值是 72，然后通过 adapt() 函数动态调整。'
  },
  // Single choice questions - Easy
  {
    id: 'sc-1',
    type: 'single',
    difficulty: 'easy',
    question: '以下哪个是有效的 Punycode 格式？',
    options: ['中国.cn', 'xn--fiqs8s.cn', 'punycode.cn', 'idn.cn'],
    correctAnswer: 'xn--fiqs8s.cn',
    explanation: 'Punycode 必须以 "xn--" 前缀开头，表示后面的内容是 IDN 编码。'
  },
  {
    id: 'sc-2',
    type: 'single',
    difficulty: 'easy',
    question: 'Unicode 码点 "U+4E2D" 对应的字符是？',
    options: ['国', '中', '文', '字'],
    correctAnswer: '中',
    explanation: 'U+4E2D 是 "中" 字的 Unicode 码点。'
  },
  {
    id: 'sc-3',
    type: 'single',
    difficulty: 'easy',
    question: 'DNS 系统能直接识别哪种字符？',
    options: ['中文', '日文', 'ASCII', 'Unicode'],
    correctAnswer: 'ASCII',
    explanation: 'DNS 系统最初只支持 ASCII 字符，这就是需要 Punycode 的原因。'
  },
  // Single choice questions - Medium
  {
    id: 'sc-4',
    type: 'single',
    difficulty: 'medium',
    question: 'Bootstring 算法中，delta 的初始值是？',
    options: ['0', '36', '72', '128'],
    correctAnswer: '0',
    explanation: 'delta 从 0 开始，每处理一个非 ASCII 字符就会增加。'
  },
  {
    id: 'sc-5',
    type: 'single',
    difficulty: 'medium',
    question: 'Base-36 进制中，数字 35 表示为？',
    options: ['35', '9', 'z', 'Z'],
    correctAnswer: 'z',
    explanation: 'Base-36 使用 0-9 表示 0-9，a-z 表示 10-35。所以 35 = z'
  },
  {
    id: 'sc-6',
    type: 'single',
    difficulty: 'medium',
    question: 'Punycode 使用多少进制进行编码？',
    options: ['2进制', '10进制', '36进制', '64进制'],
    correctAnswer: '36进制',
    explanation: 'Punycode 使用 Base-36 (0-9 + a-z) 作为编码基数。'
  },
  {
    id: 'sc-7',
    type: 'single',
    difficulty: 'medium',
    question: '在 Bootstring 中，n 的初始值 128 (0x80) 表示？',
    options: ['最大字符数', 'ASCII 字符范围上限', 'Unicode 码点总数', '编码结果长度'],
    correctAnswer: 'ASCII 字符范围上限',
    explanation: '0x80 = 128，表示 ASCII 字符的范围（0-127）。超过这个范围的字符需要编码。'
  },
  // Single choice questions - Hard
  {
    id: 'sc-8',
    type: 'single',
    difficulty: 'hard',
    question: 'adapt() 函数的作用是？',
    options: ['计算 delta 值', '调整 bias 偏置值', '转换 Base-36', '分割域名'],
    correctAnswer: '调整 bias 偏置值',
    explanation: 'adapt() 函数根据 delta 值动态调整 bias，使编码更加高效。'
  },
  {
    id: 'sc-9',
    type: 'single',
    difficulty: 'hard',
    question: '为什么 Bootstring 需要自适应偏置 (adaptive bias)？',
    options: ['提高解码速度', '优化编码效率', '支持更多语言', '兼容旧系统'],
    correctAnswer: '优化编码效率',
    explanation: '自适应偏置让算法能够根据输入动态调整，使短字符串编码更紧凑。'
  },
  // Multiple choice questions - Medium
  {
    id: 'mc-1',
    type: 'multi',
    difficulty: 'medium',
    question: '以下哪些是 Bootstring 的关键变量？',
    options: ['bias', 'delta', 'python', 'n'],
    correctAnswer: ['bias', 'delta', 'n'],
    explanation: 'Bootstring 的核心变量包括：n (码点), bias (偏置), delta (增量)。python 是编程语言，不是算法变量。'
  },
  {
    id: 'mc-2',
    type: 'multi',
    difficulty: 'medium',
    question: 'Base-36 字符表包含哪些字符？',
    options: ['0-9', 'a-z', 'A-Z', '@#$'],
    correctAnswer: ['0-9', 'a-z'],
    explanation: 'Base-36 使用 0-9 (10个数字) 和 a-z (26个字母)，不区分大小写，不包含特殊符号。'
  },
  // Multiple choice questions - Hard
  {
    id: 'mc-3',
    type: 'multi',
    difficulty: 'hard',
    question: 'Punycode 编码过程包括哪些步骤？',
    options: ['分离 ASCII 和非 ASCII', '计算 delta', 'Base-36 转换', '压缩重复字符'],
    correctAnswer: ['分离 ASCII 和非 ASCII', '计算 delta', 'Base-36 转换'],
    explanation: 'Punycode 依次进行：分离字符、计算累积增量、转换为 Base-36 表示。没有压缩步骤。'
  },
  {
    id: 'mc-4',
    type: 'multi',
    difficulty: 'hard',
    question: '以下哪些会影响 delta 的值？',
    options: ['非 ASCII 字符数量', '字符的 Unicode 码点', '输入字符串长度', '当前 bias 值'],
    correctAnswer: ['非 ASCII 字符数量', '字符的 Unicode 码点'],
    explanation: 'delta 取决于非 ASCII 字符的数量和它们的 Unicode 码点值。字符串长度影响数量，但不直接影响 delta 计算。bias 是输出，不是输入。'
  },
  // Encoding/Decoding practice
  {
    id: 'enc-1',
    type: 'single',
    difficulty: 'easy',
    question: '"中国" 编码后的 Punycode 是？',
    options: ['xn--fiqs8s', 'xn--ch-qt5a', 'xn--china', '中国'],
    correctAnswer: 'xn--fiqs8s',
    explanation: '中国.cn 的标准 Punycode 是 xn--fiqs8s.cn'
  },
  {
    id: 'dec-1',
    type: 'single',
    difficulty: 'easy',
    question: 'xn--mnchen-3ya.de 解码后是？',
    options: ['münchen.de', 'manchen.de', 'mun chen.de', 'mnchen.de'],
    correctAnswer: 'münchen.de',
    explanation: 'xn-- 表示 Punycode，mnchen-3ya 编码还原为 münchen (德语慕尼黑)。'
  }
]