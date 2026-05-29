# Punycode & Bootstring 教学网站设计

## 项目概述

一个纯前端交互式教学网站，演示 Punycode 编码和 Bootstring 编码/压缩算法，采用淡暖色系渐变玻璃态视觉风格。

**目标用户**: 有一定基础的开发者/学习者，想深入理解编码原理和 RFC 标准细节。

**技术栈**: Vite + Vue3 + TailwindCSS + anime.js / Vue Motion

---

## 四大功能模块

### 1. 教程模块
- 什么是 Punycode / Bootstring
- Unicode 基础回顾（码点、平面）
- 域名国际化 (IDN) 背景
- Bootstring 算法核心概念
  - 字母表（a-z0-9）
  - 插入式编码 (Insertion)
  - 自适应函数 (Adapt)
  - 偏置调整 (Bias)
  - 增量编码 (Delta)
- 完整编码流程图解
- 每个概念配有可交互的代码示例

### 2. 转换器模块
- 单域名输入 → Punycode 输出
- 批量处理多个域名
- 双向转换（域名 ↔ Punycode）
- 实时显示计算过程日志
- 支持常见国际化域名示例下拉选择

### 3. 动画演示模块（算法可视化）
展示 Bootstring 核心算法完整执行过程：

**编码阶段**:
1. 输入 "münchen" → 分解 ASCII 部分 + 非 ASCII 部分
2. 初始化参数 (bias=72, k=0)
3. 对每个非 ASCII 字符：
   - 计算 delta 值
   - 执行 adapt() 函数
   - 生成对应数字字符
   - 更新状态
4. 拼接 "xn--" 前缀和编码结果

**可视化元素**:
- 动态流程图（节点连线动画）
- 每步计算过程高亮显示
- 当前状态变量实时更新
- 播放/暂停/步进控制
- 速度调节

### 4. 练习/测验模块

**A. 编码挑战**
- 显示非 ASCII 域名
- 用户手动输入 Punycode 结果
- 实时验证正误

**B. 选择/填空题**
- 正确/错误的编码步骤选择
- 计算结果的填空题
- bias/delta 值的计算

**C. 逆向解密**
- 给定 Punycode 反推原始域名
- 分解编码部分的含义

**练习系统**:
- 题目难度分级（入门/进阶/挑战）
- 得分统计
- 答案解析和错误说明

---

## 视觉设计规范

### 配色方案（淡暖色系）

```
背景渐变: #fdfbfb → #ebedee → #f5e6d3 (米白 → 暖灰 → 浅杏)

主色调:
- 琥珀橙: #ffab91, #ffcc80, #ff8a65
- 暖棕色: #5d4037 (主文字), #8d6e63 (次要文字)

辅助色:
- 柔和绿: #81c784, #a5d6a7 (成功/正确)
- 柔和红: #ef9a9a, #e57373 (错误/警告)
- 淡紫: #ce93d8 (高亮/强调)
- 浅蓝: #90caf9 (信息/链接)

毛玻璃:
- 卡片背景: rgba(255,255,255,0.7)
- 边框: rgba(255,200,150,0.3)
- 阴影: rgba(180,120,80,0.1)
```

### 布局结构

```
┌─────────────────────────────────────────────────┐
│  Header: Logo + 导航标签页 (教程/转换器/动画/练习) │
├─────────────────────────────────────────────────┤
│                                                 │
│              主内容区域                          │
│     (根据当前标签页切换内容组件)                   │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer: 技术说明 + 相关链接                      │
└─────────────────────────────────────────────────┘
```

### 组件规范

- **玻璃卡片**: backdrop-filter: blur(20px), border-radius: 24px
- **按钮**: 圆角 12px, 渐变背景, hover 缩放 1.02
- **代码块**: 等宽字体, 浅暖色背景, 语法高亮
- **动画**: 使用 anime.js 实现流畅过渡 (easing: 'easeOutElastic')

---

## 技术架构

```
src/
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   └── GlassCard.vue
│   ├── tutorial/
│   │   ├── TutorialIndex.vue
│   │   ├── UnicodeBasics.vue
│   │   ├── PunycodeIntro.vue
│   │   └── BootstringAlgorithm.vue
│   ├── converter/
│   │   ├── ConverterPanel.vue
│   │   └── ProcessLog.vue
│   ├── animation/
│   │   ├── AnimationPlayer.vue
│   │   ├── AlgorithmFlowChart.vue
│   │   └── StateDisplay.vue
│   └── quiz/
│       ├── QuizPanel.vue
│       ├── EncodingChallenge.vue
│       ├── ChoiceQuestion.vue
│       └── DecodingChallenge.vue
├── composables/
│   ├── usePunycode.ts
│   ├── useBootstring.ts
│   └── useAnimation.ts
├── utils/
│   ├── punycode.ts
│   ├── bootstring.ts
│   └── examples.ts
├── App.vue
└── main.ts
```

---

## 核心算法实现

### Bootstring 编码器
```typescript
interface BootstringState {
  bias: number;
  delta: number;
  n: number;
}

function encode(s: string): string { /* ... */ }
function adapt(delta: number, numPoints: number, firstTime: boolean): number { /* ... */ }
function insert(s: string, buf: string, k: number): string { /* ... */ }
```

### 动画控制
- 使用 anime.js timeline 控制步骤时序
- 每个算法步骤对应一个动画片段
- 支持暂停、恢复、单步执行

---

## 示例域名

```javascript
const EXAMPLES = [
  { original: 'münchen.de', punycode: 'xn--mnchen-3ya.de' },
  { original: '日本語.jp', punycode: 'xn--wgv71a119e.jp' },
  { original: 'موسوعة.com', punycode: 'xn--ngbc5azd.com' },
  { original: 'балалар.kz', punycode: 'xn----76cdlb6adkphq.kz' },
  { original: 'école.fr', punycode: 'xn--cole-eka.fr' },
];
```

---

## 成功标准

1. 用户能在 5 分钟内理解 Punycode 的作用
2. 动画演示能让用户清楚看到每一步计算过程
3. 练习系统能有效测试用户对算法的理解
4. 视觉效果温馨舒适，适合长时间学习
5. 页面加载 < 2s，动画流畅 60fps