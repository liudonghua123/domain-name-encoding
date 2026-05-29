export interface Example {
  original: string
  punycode: string
  description: string
  descriptionEn: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const examples: Example[] = [
  {
    original: '中国.cn',
    punycode: 'xn--fiqs8s.cn',
    description: '中文域名',
    descriptionEn: 'Chinese domain name',
    difficulty: 'easy'
  },
  {
    original: 'abc中国xyz.cn',
    punycode: 'xn--abcxyz-dw7is51d.cn',
    description: '中英混合域名',
    descriptionEn: 'Chinese-English mixed domain',
    difficulty: 'medium'
  },
  {
    original: '中文网.cn',
    punycode: 'xn--fiq228c5hs.cn',
    description: '中文网站',
    descriptionEn: 'Chinese website',
    difficulty: 'easy'
  },
  {
    original: '咖啡.com',
    punycode: 'xn--2m22a.com',
    description: '中文咖啡',
    descriptionEn: 'Chinese cafe',
    difficulty: 'easy'
  },
  {
    original: 'münchen.de',
    punycode: 'xn--mnchen-3ya.de',
    description: '德语城市名',
    descriptionEn: 'German city name',
    difficulty: 'easy'
  },
  {
    original: 'école.fr',
    punycode: 'xn--cole-9oa.fr',
    description: '法语学校',
    descriptionEn: 'French school',
    difficulty: 'easy'
  },
  {
    original: 'موسوعة.com',
    punycode: 'xn--ngbc5azd.com',
    description: '阿拉伯语百科',
    descriptionEn: 'Arabic encyclopedia',
    difficulty: 'medium'
  },
  {
    original: 'балалар.kz',
    punycode: 'xn----76cdlb6adkphq.kz',
    description: '哈萨克语儿童',
    descriptionEn: 'Kazakh children',
    difficulty: 'hard'
  },
]

export function getExampleByPunycode(punycode: string): Example | undefined {
  return examples.find(e => e.punycode === punycode)
}

export function getExamplesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Example[] {
  return examples.filter(e => e.difficulty === difficulty)
}