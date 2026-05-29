<script setup lang="ts">
import { useLocale } from '../../composables/useI18n'

const { locale } = useLocale()
</script>

<template>
  <footer class="glass-card mt-8 sm:mt-12 text-center py-4 sm:py-6">
    <p class="text-secondary text-sm">
      {{ locale === 'zh' ? '基于 RFC 3492 (Punycode) 标准' : 'Based on RFC 3492 (Punycode)' }}
    </p>
    <p class="text-muted text-xs mt-2">
      {{ locale === 'zh' ? '纯前端演示 · 无数据上传' : 'Pure frontend demo · No data upload' }}
    </p>
  </footer>
</template>