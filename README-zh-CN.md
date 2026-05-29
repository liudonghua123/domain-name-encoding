# Punycode / Bootstring 在线学习平台

一个交互式的教育网站，用于学习和理解 Punycode 编码和 Bootstring 算法的原理。

## 功能模块

### 📚 教程（Tutorial）
- 9 节完整课程，从零开始讲解
- Unicode 基础概念
- Base-36 进制详解
- 手动编码演示，每一步都有详细说明
- 关键变量速查表（n, bias, delta, k）
- 中英双语内容

### 🔄 转换器（Converter）
- 域名 Punycode 编码/解码
- 实时字符分析（ASCII/非 ASCII）
- Unicode 码点显示
- 7 步算法步骤详解
- 变量状态跟踪表

### 🎬 算法动画（Animation）
- 可视化算法执行过程
- 变量状态实时更新
- 计算公式动画演示
- 纯净代码示例（无第三方依赖）
- JavaScript / Python 双版本
- 播放控制（播放/暂停/步进/速度调节）

### ✏️ 练习（Quiz）
- 多种题型：判断题、单项选择、多项选择
- 难度分级：简单、中等、困难
- 即时反馈和详细解释
- 支持中英双语

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **样式**: TailwindCSS
- **动画**: 内置 CSS 动画
- **Punycode**: punycode npm 包

## 使用方法

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 示例域名

| 原始域名 | Punycode 编码 |
|---------|--------------|
| 中国.cn | xn--fiqs8s.cn |
| abc中国xyz.cn | xn--abcxyz-dw7is51d.cn |
| 中文网.cn | xn--fiq228c5hs.cn |
| 咖啡.com | xn--2m22a.com |
| münchen.de | xn--mnchen-3ya.de |

## 算法原理

Punycode 是一种用于将 Unicode 字符串编码为 ASCII 字符串的算法，主要用于国际化域名（IDN）。

### 核心变量

| 变量 | 含义 | 初始值 |
|-----|------|-------|
| BASE | 字符表大小 | 36 |
| n | 当前 Unicode 码点 | 128 (0x80) |
| bias | 自适应偏置值 | 72 |
| delta | 累积增量 | 0 |
| k | 字符表索引 | 36 |

### 编码流程

1. **分离 ASCII 和非 ASCII 字符**
2. **计算 delta 累加值**: `delta += (cp - 128) × index`
3. **自适应调整 bias**: `bias = adapt(bias, delta)`
4. **转换为 Base-36**: `toBase36(delta)`
5. **组合结果**: `前缀 + "xn--" + 编码`

## 项目结构

```
src/
├── components/
│   ├── animation/    # 算法动画组件
│   ├── converter/    # 转换器组件
│   ├── layout/       # 布局组件
│   ├── quiz/         # 练习组件
│   └── tutorial/     # 教程组件
├── composables/      # Vue 组合式函数
│   ├── useI18n.ts    # 国际化
│   ├── usePunycode.ts
│   └── useTheme.ts   # 主题切换
├── utils/            # 工具函数
│   ├── examples.ts   # 示例数据
│   └── punycode.ts   # 编码/解码实现
├── App.vue
└── main.ts
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 相关资源

- [RFC 3492 - Punycode](https://tools.ietf.org/html/rfc3492)
- [Unicode 官网](https://home.unicode.org/)
- [WHATWG URL Standard](https://url.spec.whatwg.org/)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！