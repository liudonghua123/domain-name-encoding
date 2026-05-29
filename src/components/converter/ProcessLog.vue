<script setup lang="ts">
import type { EncodeStep } from '../../utils/punycode'
import { useLocale } from '../../composables/useI18n'

defineProps<{
  steps: EncodeStep[]
}>()

const { locale } = useLocale()

function getStepColor(type: EncodeStep['type']): string {
  const colors: Record<string, { light: string; dark: string }> = {
    init: { light: 'bg-warm-400/20 text-warm-800', dark: 'bg-warm-400/30 text-warm-200' },
    insert: { light: 'bg-purple-200/30 text-purple-800', dark: 'bg-purple-900/40 text-purple-200' },
    adapt: { light: 'bg-blue-200/30 text-blue-800', dark: 'bg-blue-900/40 text-blue-200' },
    delta: { light: 'bg-warm-300/30 text-warm-800', dark: 'bg-orange-900/40 text-orange-200' },
    output: { light: 'bg-green-500/20 text-green-800', dark: 'bg-green-900/40 text-green-200' }
  }
  const isDark = document.documentElement.classList.contains('dark')
  return colors[type]?.[isDark ? 'dark' : 'light'] || 'bg-gray-200 text-gray-800'
}

function getStepLabel(type: EncodeStep['type']): string {
  const labels: Record<string, { zh: string; en: string }> = {
    init: { zh: '初始化', en: 'Init' },
    insert: { zh: '插入字符', en: 'Insert' },
    adapt: { zh: '自适应调整', en: 'Adapt' },
    delta: { zh: '增量更新', en: 'Delta' },
    output: { zh: '输出', en: 'Output' }
  }
  const label = labels[type]
  return label ? (locale.value === 'zh' ? label.zh : label.en) : type
}
</script>

<template>
  <div class="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="p-3 rounded-xl border transition-all duration-300"
      style="background: var(--bg-card); border-color: var(--border-card)"
    >
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
        <span
          :class="[
            'px-2 py-1 rounded-lg text-xs font-medium',
            getStepColor(step.type)
          ]"
        >
          {{ getStepLabel(step.type) }}
        </span>
        <span class="text-muted text-xs sm:text-sm">
          {{ locale === 'zh' ? '步骤' : 'Step' }} {{ index + 1 }}
        </span>
      </div>
      <p class="text-primary text-sm mb-2 break-all">{{ step.description }}</p>
      <div class="grid grid-cols-4 gap-1 sm:gap-2 text-xs">
        <div class="p-1.5 sm:p-2 rounded-lg text-center" style="background: var(--button-bg)">
          <div class="text-muted">bias</div>
          <div class="font-mono text-primary font-medium">{{ step.state.bias }}</div>
        </div>
        <div class="p-1.5 sm:p-2 rounded-lg text-center" style="background: var(--button-bg)">
          <div class="text-muted">delta</div>
          <div class="font-mono text-primary font-medium">{{ step.state.delta }}</div>
        </div>
        <div class="p-1.5 sm:p-2 rounded-lg text-center" style="background: var(--button-bg)">
          <div class="text-muted">n</div>
          <div class="font-mono text-primary font-medium">{{ step.state.n }}</div>
        </div>
        <div class="p-1.5 sm:p-2 rounded-lg text-center" style="background: var(--button-bg)">
          <div class="text-muted">k</div>
          <div class="font-mono text-primary font-medium">{{ step.state.k }}</div>
        </div>
      </div>
    </div>
  </div>
</template>