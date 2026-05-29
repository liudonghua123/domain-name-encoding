<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Question } from './questions'
import { useLocale } from '../../composables/useI18n'

const props = defineProps<{
  question: Question
}>()

const { locale } = useLocale()

const emit = defineEmits<{
  (e: 'answered', isCorrect: boolean): void
}>()

const selectedAnswer = ref<string | string[]>(
  props.question.type === 'multi' ? [] : ''
)
const submitted = ref(false)

function isMultiType(): boolean {
  return props.question.type === 'multi'
}

function isTrueFalseType(): boolean {
  return props.question.type === 'truefalse'
}

function toggleOption(option: string) {
  if (submitted.value) return

  if (isMultiType()) {
    const current = selectedAnswer.value as string[]
    const index = current.indexOf(option)
    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(option)
    }
    selectedAnswer.value = [...current]
  } else {
    selectedAnswer.value = option
  }
}

function isSelected(option: string): boolean {
  if (isMultiType()) {
    return (selectedAnswer.value as string[]).includes(option)
  }
  return selectedAnswer.value === option
}

function checkAnswer(): boolean {
  if (isMultiType()) {
    const correct = props.question.correctAnswer as string[]
    const selected = selectedAnswer.value as string[]
    return correct.length === selected.length && correct.every(c => selected.includes(c))
  }
  return selectedAnswer.value === props.question.correctAnswer
}

function submitAnswer() {
  if (submitted.value) return

  const correct = checkAnswer()
  submitted.value = true
  emit('answered', correct)
}

function getOptionClass(option: string): string {
  if (!submitted.value) {
    return isSelected(option)
      ? 'border-warm-500'
      : 'border-card hover:border-warm-400'
  }

  const isCorrectOption = isMultiType()
    ? (props.question.correctAnswer as string[]).includes(option)
    : props.question.correctAnswer === option

  if (isCorrectOption) {
    return 'border-green-500'
  }
  if (isSelected(option) && !isCorrectOption) {
    return 'border-red-500'
  }
  return 'opacity-50'
}

const isCorrect = computed(() => checkAnswer())

const difficultyLabel = computed(() => {
  const labels: Record<string, { zh: string; en: string }> = {
    easy: { zh: '简单', en: 'Easy' },
    medium: { zh: '中等', en: 'Medium' },
    hard: { zh: '困难', en: 'Hard' },
  }
  return labels[props.question.difficulty]?.[locale.value] || props.question.difficulty
})

const typeLabel = computed(() => {
  const labels: Record<string, { zh: string; en: string }> = {
    single: { zh: '单选题', en: 'Single Choice' },
    multi: { zh: '多选题', en: 'Multiple Choice' },
    truefalse: { zh: '判断题', en: 'True/False' },
  }
  return labels[props.question.type]?.[locale.value] || props.question.type
})

const trueFalseOptions = computed(() => [
  { value: 'true', label: locale.value === 'zh' ? '正确' : 'True' },
  { value: 'false', label: locale.value === 'zh' ? '错误' : 'False' }
])
</script>

<template>
  <div class="p-4 sm:p-5 rounded-2xl border" style="background: var(--bg-card); border-color: var(--border-card)">
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span
        :class="[
          'px-2 py-1 rounded-lg text-xs font-medium',
          question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
          question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        ]"
      >
        {{ difficultyLabel }}
      </span>
      <span class="px-2 py-1 rounded-lg text-xs font-medium" style="background: var(--button-bg); color: var(--text-primary)">
        {{ typeLabel }}
      </span>
      <span v-if="question.type === 'multi'" class="text-xs text-muted">
        ({{ locale === 'zh' ? '可多选' : 'Select all' }})
      </span>
    </div>

    <h4 class="text-primary font-medium mb-4 text-sm sm:text-base">{{ question.question }}</h4>

    <!-- True/False questions -->
    <div v-if="isTrueFalseType()" class="flex gap-3 mb-4">
      <button
        v-for="opt in trueFalseOptions"
        :key="opt.value"
        @click="toggleOption(opt.value)"
        :class="[
          'flex-1 p-4 rounded-xl border text-center transition-all text-base',
          getOptionClass(opt.value)
        ]"
        :disabled="submitted"
        :style="{
          background: submitted && opt.value === question.correctAnswer ? 'rgba(72, 199, 142, 0.2)' :
                       submitted && isSelected(opt.value) && opt.value !== question.correctAnswer ? 'rgba(229, 115, 115, 0.2)' :
                       isSelected(opt.value) ? 'var(--accent-from)' : 'var(--button-bg)',
          color: isSelected(opt.value) ? 'white' : 'var(--text-primary)'
        }"
      >
        <span class="text-2xl mb-1 block">{{ opt.value === 'true' ? '✓' : '✗' }}</span>
        {{ opt.label }}
      </button>
    </div>

    <!-- Single/Multi choice questions -->
    <div v-else-if="question.options" class="space-y-2 mb-4">
      <button
        v-for="option in question.options"
        :key="option"
        @click="toggleOption(option)"
        :class="[
          'w-full p-3 rounded-xl border text-left transition-all text-sm sm:text-base',
          getOptionClass(option)
        ]"
        :disabled="submitted"
        :style="{
          background: submitted && (isMultiType() ? (question.correctAnswer as string[]).includes(option) : question.correctAnswer === option) ? 'rgba(72, 199, 142, 0.2)' :
                       submitted && isSelected(option) && (isMultiType() ? !(question.correctAnswer as string[]).includes(option) : option !== question.correctAnswer) ? 'rgba(229, 115, 115, 0.2)' :
                       isSelected(option) ? 'var(--accent-from)' : 'var(--button-bg)',
          color: isSelected(option) ? 'white' : 'var(--text-primary)'
        }"
      >
        <span v-if="isMultiType()" class="inline-block w-5 h-5 border-2 rounded mr-2 align-middle"
              :style="{ borderColor: isSelected(option) ? 'white' : 'var(--text-muted)' }">
          <span v-if="isSelected(option)" class="block w-full h-full" style="background: var(--accent-to);"></span>
        </span>
        {{ option }}
      </button>
    </div>

    <!-- Submit button -->
    <button
      v-if="!submitted"
      @click="submitAnswer"
      class="w-full glass-button mb-2 sm:mb-4"
    >
      {{ locale === 'zh' ? '提交答案' : 'Submit' }}
    </button>

    <!-- Result -->
    <div v-if="submitted" class="mt-4 p-4 rounded-xl border"
      :style="isCorrect
        ? 'background: rgba(72, 199, 142, 0.1); border-color: rgba(72, 199, 142, 0.3)'
        : 'background: rgba(229, 115, 115, 0.1); border-color: rgba(229, 115, 115, 0.3)'"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xl">
          {{ isCorrect ? '✓' : '✗' }}
        </span>
        <span class="font-medium"
          :style="{ color: isCorrect ? 'rgb(72, 199, 142)' : 'rgb(229, 115, 115)' }"
        >
          {{ isCorrect
            ? (locale === 'zh' ? '正确!' : 'Correct!')
            : (locale === 'zh' ? '错误' : 'Wrong') }}
        </span>
      </div>
      <p class="text-secondary text-sm">{{ question.explanation }}</p>
      <div v-if="!isCorrect" class="mt-2 text-sm">
        <span class="text-muted">{{ locale === 'zh' ? '正确答案: ' : 'Correct Answer: ' }} </span>
        <code class="text-primary font-mono">
          {{ Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer }}
        </code>
      </div>
    </div>
  </div>
</template>