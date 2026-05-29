import { ref, onMounted } from 'vue'

export type Theme = 'light' | 'dark'

const currentTheme = ref<Theme>('light')

export function useTheme() {
  function setTheme(theme: Theme) {
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
    updateDocumentClass(theme)
  }

  function toggleTheme() {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  function updateDocumentClass(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize from localStorage or system preference
  onMounted(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored && (stored === 'light' || stored === 'dark')) {
      setTheme(stored)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  })

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDark: () => currentTheme.value === 'dark'
  }
}