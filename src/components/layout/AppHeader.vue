<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  activeTab: string
  theme: 'light' | 'dark'
  locale: 'zh' | 'en'
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
  (e: 'toggle-theme'): void
  (e: 'toggle-locale'): void
}>()

const tabs = computed(() => [
  { id: 'tutorial', label: props.locale === 'zh' ? '📚 教程' : '📚 Tutorial' },
  { id: 'converter', label: props.locale === 'zh' ? '🔄 转换器' : '🔄 Converter' },
  { id: 'animation', label: props.locale === 'zh' ? '🎬 动画' : '🎬 Animation' },
  { id: 'quiz', label: props.locale === 'zh' ? '✏️ 练习' : '✏️ Quiz' },
])

const isDark = computed(() => props.theme === 'dark')
</script>

<template>
  <header class="glass-card mb-4 sm:mb-8 sticky top-4 z-50">
    <nav class="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">
      <!-- Logo -->
      <h1 class="text-xl sm:text-2xl font-bold text-primary">🌐 Punycode</h1>

      <!-- Tab buttons -->
      <div class="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="emit('update:activeTab', tab.id)"
          :class="[
            'px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap text-sm sm:text-base',
            activeTab === tab.id
              ? 'bg-gradient-to-r from-warm-300 to-warm-400 text-white shadow-md'
              : 'text-secondary hover:bg-white/20'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Theme and Language toggles -->
      <div class="flex gap-2">
        <!-- Language toggle -->
        <button
          @click="emit('toggle-locale')"
          class="px-3 py-2 rounded-xl glass-button-secondary text-sm font-medium"
        >
          {{ locale === 'zh' ? 'EN' : '中' }}
        </button>

        <!-- Theme toggle -->
        <button
          @click="emit('toggle-theme')"
          class="px-3 py-2 rounded-xl glass-button-secondary text-lg"
          :title="isDark ? (locale === 'zh' ? '切换到浅色模式' : 'Switch to light mode') : (locale === 'zh' ? '切换到深色模式' : 'Switch to dark mode')"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </nav>
  </header>
</template>