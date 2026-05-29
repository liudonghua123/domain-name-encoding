/**
 * Punycode encoding/decoding for domain names
 * Uses punycode package for correct encoding/decoding
 */
import punycode from 'punycode'

export interface EncodeStep {
  type: 'init' | 'insert' | 'adapt' | 'output' | 'delta'
  description: string
  state: {
    bias: number
    delta: number
    n: number
    k: number
    codePoint?: number
    char?: string
    digit?: string
  }
  output: string
}

export interface DecodeStep {
  type: 'init' | 'output' | 'adapt'
  description: string
  state: {
    bias: number
    delta: number
    n: number
    k: number
  }
  output: string
}

/**
 * Encode a domain name to Punycode
 * Example: "abc中国xyz.cn" → "xn--abcxyz-dw7is51d.cn"
 */
export function encodePunycode(input: string): { punycode: string; steps: EncodeStep[] } {
  const steps: EncodeStep[] = []
  const chars = [...input]

  // Separate ASCII and non-ASCII
  const asciiChars: string[] = []
  const nonAsciiChars: { char: string; cp: number }[] = []

  chars.forEach(char => {
    const cp = char.codePointAt(0)!
    if (cp < 0x80) {
      asciiChars.push(char)
    } else {
      nonAsciiChars.push({ char, cp })
    }
  })

  steps.push({
    type: 'init',
    description: `输入: "${input}"`,
    state: { bias: 0, delta: 0, n: 0, k: 0 },
    output: input
  })

  // If no non-ASCII, return as-is
  if (nonAsciiChars.length === 0) {
    steps.push({
      type: 'output',
      description: `纯 ASCII 字符，无需编码`,
      state: { bias: 0, delta: 0, n: 0, k: 0 },
      output: input
    })
    return { punycode: input, steps }
  }

  // Split by "." and encode each label separately
  const labels = input.split('.')
  const encodedLabels: string[] = []

  for (const label of labels) {
    const hasNonAscii = [...label].some(c => c.codePointAt(0)! >= 0x80)
    if (hasNonAscii) {
      // Add xn-- prefix for labels with non-ASCII (same as browsers)
      const encoded = 'xn--' + punycode.encode(label)
      encodedLabels.push(encoded)

      steps.push({
        type: 'output',
        description: `编码 "${label}" → "${encoded}"`,
        state: { bias: 0, delta: nonAsciiChars.length, n: 0, k: 0 },
        output: encoded
      })
    } else {
      encodedLabels.push(label)
    }
  }

  const punycodeStr = encodedLabels.join('.')

  steps.push({
    type: 'output',
    description: `编码完成: "${punycodeStr}"`,
    state: { bias: 0, delta: nonAsciiChars.length, n: 0, k: 0 },
    output: punycodeStr
  })

  return { punycode: punycodeStr, steps }
}

/**
 * Decode a Punycode domain name to Unicode
 * Example: "xn--abcxyz-dw7is51d.cn" → "abc中国xyz.cn"
 */
export function decodePunycode(input: string): { original: string; steps: DecodeStep[]; error?: string } {
  const steps: DecodeStep[] = []

  steps.push({
    type: 'init',
    description: `Punycode 输入: "${input}"`,
    state: { bias: 0, delta: 0, n: 0, k: 0 },
    output: input
  })

  // Check if it's punycode
  if (!input.includes('xn--')) {
    steps.push({
      type: 'output',
      description: `不是 Punycode 格式`,
      state: { bias: 0, delta: 0, n: 0, k: 0 },
      output: input
    })
    return { original: input, steps }
  }

  // Split by "." and decode each label
  const labels = input.split('.')
  const decodedLabels: string[] = []

  for (const label of labels) {
    if (label.startsWith('xn--')) {
      // This label is punycode, remove "xn--" and decode
      const encodedPart = label.slice(4)
      try {
        const decoded = punycode.decode(encodedPart)
        decodedLabels.push(decoded)

        steps.push({
          type: 'output',
          description: `解码 "${label}" → "${decoded}"`,
          state: { bias: 0, delta: 0, n: 0, k: 0 },
          output: decoded
        })
      } catch {
        // Decode failed, keep original
        decodedLabels.push(label)
        steps.push({
          type: 'output',
          description: `解码失败，保持: "${label}"`,
          state: { bias: 0, delta: 0, n: 0, k: 0 },
          output: label
        })
      }
    } else {
      // Not punycode, keep as-is
      decodedLabels.push(label)
    }
  }

  const original = decodedLabels.join('.')

  steps.push({
    type: 'output',
    description: `解码完成: "${original}"`,
    state: { bias: 0, delta: 0, n: 0, k: 0 },
    output: original
  })

  return { original, steps }
}