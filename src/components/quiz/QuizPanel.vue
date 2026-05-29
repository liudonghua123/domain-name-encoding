<script setup lang="ts">
import { ref, computed } from 'vue'
import GlassCard from '../layout/GlassCard.vue'
import QuizCard from './QuizCard.vue'
import { questions, type Question, type QuestionType } from './questions'
import { useLocale } from '../../composables/useI18n'

const { locale } = useLocale()

const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')
const selectedType = ref<'all' | QuestionType>('all')
const currentQuestionIndex = ref(0)
const score = ref(0)
const answeredCount = ref(0)
const quizStarted = ref(false)
const quizFinished = ref(false)
const shuffledQuestions = ref<Question[]>([])

const filteredQuestions = computed(() => {
  let result = shuffledQuestions.value
  if (selectedDifficulty.value !== 'all') {
    result = result.filter(q => q.difficulty === selectedDifficulty.value)
  }
  if (selectedType.value !== 'all') {
    result = result.filter(q => q.type === selectedType.value)
  }
  return result
})

const currentQuestion = computed(() => filteredQuestions.value[currentQuestionIndex.value])

const scorePercentage = computed(() => {
  if (answeredCount.value === 0) return 0
  return Math.round((score.value / answeredCount.value) * 100)
})

const questionCount = computed(() => {
  let total = questions.length
  if (selectedDifficulty.value !== 'all') {
    total = questions.filter(q => q.difficulty === selectedDifficulty.value).length
  }
  if (selectedType.value !== 'all') {
    total = questions.filter(q => q.type === selectedType.value).length
  }
  return total
})

function startQuiz() {
  // Filter first, then shuffle
  let pool = questions
  if (selectedDifficulty.value !== 'all') {
    pool = pool.filter(q => q.difficulty === selectedDifficulty.value)
  }
  if (selectedType.value !== 'all') {
    pool = pool.filter(q => q.type === selectedType.value)
  }
  shuffledQuestions.value = [...pool].sort(() => Math.random() - 0.5)
  currentQuestionIndex.value = 0
  score.value = 0
  answeredCount.value = 0
  quizStarted.value = true
  quizFinished.value = false
}

function handleAnswer(isCorrect: boolean) {
  answeredCount.value++
  if (isCorrect) {
    score.value++
  }

  // Auto advance after a delay
  setTimeout(() => {
    if (currentQuestionIndex.value < filteredQuestions.value.length - 1) {
      currentQuestionIndex.value++
    } else {
      quizFinished.value = true
    }
  }, 1500)
}

function getScoreMessage(): string {
  if (locale.value === 'zh') {
    if (scorePercentage.value >= 90) return '🌟 太棒了！完全掌握！'
    if (scorePercentage.value >= 70) return '👍 很不错！继续加油！'
    if (scorePercentage.value >= 50) return '💪 还可以，再接再厉！'
    return '📚 需要加强学习哦！'
  } else {
    if (scorePercentage.value >= 90) return '🌟 Excellent! Perfect mastery!'
    if (scorePercentage.value >= 70) return '👍 Great job! Keep it up!'
    if (scorePercentage.value >= 50) return '💪 Not bad! Keep practicing!'
    return '📚 Need more practice!'
  }
}

const difficultyLabels = computed(() => ({
  all: locale.value === 'zh' ? '全部' : 'All',
  easy: locale.value === 'zh' ? '简单' : 'Easy',
  medium: locale.value === 'zh' ? '中等' : 'Medium',
  hard: locale.value === 'zh' ? '困难' : 'Hard',
}))

const typeLabels = computed(() => ({
  all: locale.value === 'zh' ? '全部' : 'All',
  single: locale.value === 'zh' ? '单选题' : 'Single',
  multi: locale.value === 'zh' ? '多选题' : 'Multi',
  truefalse: locale.value === 'zh' ? '判断题' : 'T/F',
}))

const questionStats = computed(() => ({
  single: questions.filter(q => q.type === 'single').length,
  multi: questions.filter(q => q.type === 'multi').length,
  truefalse: questions.filter(q => q.type === 'truefalse').length,
}))
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <GlassCard>
      <h2 class="text-xl sm:text-2xl font-bold text-primary mb-4">
        ✏️ {{ locale === 'zh' ? 'Punycode 练习' : 'Punycode Quiz' }}
      </h2>

      <!-- Start screen -->
      <div v-if="!quizStarted" class="text-center py-6 sm:py-8">
        <div class="text-4xl sm:text-5xl mb-3 sm:mb-4">🎯</div>
        <p class="text-secondary mb-4 sm:mb-6 text-sm sm:text-base">
          {{ locale === 'zh'
            ? '测试你对 Punycode 和 Bootstring 算法的理解'
            : 'Test your understanding of Punycode and Bootstring' }}
        </p>

        <!-- Question type selection -->
        <div class="mb-4 sm:mb-6">
          <div class="text-muted text-xs sm:text-sm mb-2 sm:mb-3">
            {{ locale === 'zh' ? '题目类型' : 'Question Type' }}
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="type in ['all', 'single', 'multi', 'truefalse'] as const"
              :key="type"
              @click="selectedType = type"
              :class="[
                'px-3 sm:px-4 py-2 rounded-xl transition-all text-sm',
                selectedType === type
                  ? 'bg-gradient-to-r from-warm-300 to-warm-400 text-white'
                  : 'glass-button-secondary'
              ]"
            >
              {{ typeLabels[type] }}
              <span v-if="type !== 'all'" class="text-xs opacity-70 ml-1">
                ({{ questionStats[type] }})
              </span>
            </button>
          </div>
        </div>

        <!-- Difficulty selection -->
        <div class="mb-4 sm:mb-6">
          <div class="text-muted text-xs sm:text-sm mb-2 sm:mb-3">
            {{ locale === 'zh' ? '选择难度' : 'Select Difficulty' }}
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="diff in ['all', 'easy', 'medium', 'hard'] as const"
              :key="diff"
              @click="selectedDifficulty = diff"
              :class="[
                'px-3 sm:px-4 py-2 rounded-xl transition-all text-sm',
                selectedDifficulty === diff
                  ? 'bg-gradient-to-r from-warm-300 to-warm-400 text-white'
                  : 'glass-button-secondary'
              ]"
            >
              {{ difficultyLabels[diff] }}
            </button>
          </div>
        </div>

        <div class="text-muted text-sm mb-4">
          {{ locale === 'zh' ? '共' : 'Total' }} {{ questionCount }}
          {{ locale === 'zh' ? '道题' : 'questions' }}
        </div>

        <button @click="startQuiz" class="glass-button text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
          {{ locale === 'zh' ? '开始练习' : 'Start Quiz' }}
        </button>
      </div>

      <!-- Quiz in progress -->
      <div v-else-if="!quizFinished && currentQuestion">
        <div class="flex justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
          <span class="text-secondary">
            {{ locale === 'zh' ? '进度' : 'Progress' }} {{ currentQuestionIndex + 1 }} / {{ filteredQuestions.length }}
          </span>
          <span class="text-secondary">
            {{ locale === 'zh' ? '得分' : 'Score' }} {{ score }} / {{ answeredCount }}
          </span>
        </div>

        <div class="mb-3 sm:mb-4 h-1.5 sm:h-2 rounded-full overflow-hidden" style="background: var(--button-bg)">
          <div
            class="h-full bg-gradient-to-r from-warm-400 to-warm-500 transition-all duration-300"
            :style="{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }"
          />
        </div>

        <QuizCard
          :key="currentQuestion.id"
          :question="currentQuestion"
          @answered="handleAnswer"
        />
      </div>

      <!-- Quiz finished -->
      <div v-else-if="quizFinished" class="text-center py-6 sm:py-8">
        <div class="text-4xl sm:text-5xl mb-3 sm:mb-4">{{ scorePercentage >= 70 ? '🎉' : '📖' }}</div>
        <h3 class="text-xl sm:text-2xl font-bold text-primary mb-2">
          {{ locale === 'zh' ? '练习完成！' : 'Quiz Complete!' }}
        </h3>
        <p class="text-3xl sm:text-4xl font-bold text-primary mb-2">{{ scorePercentage }}%</p>
        <p class="text-secondary mb-2 text-sm sm:text-base">
          {{ score }} / {{ filteredQuestions.length }} {{ locale === 'zh' ? '正确' : 'correct' }}
        </p>
        <p class="text-muted mb-4 sm:mb-6 text-sm sm:text-base">{{ getScoreMessage() }}</p>

        <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button @click="startQuiz" class="glass-button">
            {{ locale === 'zh' ? '再试一次' : 'Try Again' }}
          </button>
          <button @click="quizStarted = false" class="glass-button-secondary">
            {{ locale === 'zh' ? '返回选择' : 'Back' }}
          </button>
        </div>
      </div>
    </GlassCard>

    <!-- Quiz guide -->
    <GlassCard style="background: linear-gradient(135deg, rgba(99, 179, 237, 0.1), rgba(99, 179, 237, 0.05)); border-color: rgba(99, 179, 237, 0.3);">
      <h4 class="text-sm sm:text-base font-bold text-primary mb-3">
        📖 {{ locale === 'zh' ? '答题说明' : 'Quiz Guide' }}
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
        <div class="p-3 rounded-lg" style="background: var(--bg-card)">
          <div class="font-medium text-warm-400 mb-1">✓ ✗ {{ locale === 'zh' ? '判断题' : 'True/False' }}</div>
          <div class="text-muted">{{ locale === 'zh' ? '选择正确或错误' : 'Choose True or False' }}</div>
        </div>
        <div class="p-3 rounded-lg" style="background: var(--bg-card)">
          <div class="font-medium text-purple-400 mb-1">◯ {{ locale === 'zh' ? '单选题' : 'Single Choice' }}</div>
          <div class="text-muted">{{ locale === 'zh' ? '选择一个正确答案' : 'Select one correct answer' }}</div>
        </div>
        <div class="p-3 rounded-lg" style="background: var(--bg-card)">
          <div class="font-medium text-blue-400 mb-1">☐ {{ locale === 'zh' ? '多选题' : 'Multiple Choice' }}</div>
          <div class="text-muted">{{ locale === 'zh' ? '选择所有正确答案' : 'Select all correct answers' }}</div>
        </div>
      </div>
    </GlassCard>
  </div>
</template>