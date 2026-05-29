<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import TutorialIndex from './components/tutorial/TutorialIndex.vue'
import ConverterPanel from './components/converter/ConverterPanel.vue'
import AnimationPlayer from './components/animation/AnimationPlayer.vue'
import QuizPanel from './components/quiz/QuizPanel.vue'
import { useTheme } from './composables/useTheme'
import { useLocale } from './composables/useI18n'

const activeTab = ref('tutorial')
const { theme, setTheme } = useTheme()
const { locale, setLocale } = useLocale()

onMounted(() => {
  // Apply initial theme
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto">
    <AppHeader
      v-model:activeTab="activeTab"
      :theme="theme"
      :locale="locale"
      @toggle-theme="setTheme(theme === 'light' ? 'dark' : 'light')"
      @toggle-locale="setLocale(locale === 'zh' ? 'en' : 'zh')"
    />

    <main class="my-4 sm:my-6">
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <TutorialIndex v-if="activeTab === 'tutorial'" key="tutorial" />
        <ConverterPanel v-else-if="activeTab === 'converter'" key="converter" />
        <AnimationPlayer v-else-if="activeTab === 'animation'" key="animation" />
        <QuizPanel v-else-if="activeTab === 'quiz'" key="quiz" />
      </Transition>
    </main>

    <AppFooter />
  </div>
</template>