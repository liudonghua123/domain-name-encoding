import { ref, computed } from 'vue'
import { encodePunycode, type EncodeStep } from '../utils/punycode'

export function usePunycode() {
  const input = ref('')
  const punycodeResult = ref('')
  const steps = ref<EncodeStep[]>([])
  const error = ref('')
  const currentStep = ref(0)
  const isPlaying = ref(false)
  const playbackSpeed = ref(1)

  const hasResult = computed(() => punycodeResult.value !== '')
  const totalSteps = computed(() => steps.value.length)
  const currentStepData = computed(() => steps.value[currentStep.value])

  function encode() {
    error.value = ''
    if (!input.value.trim()) {
      error.value = '请输入域名'
      return
    }

    const result = encodePunycode(input.value)
    punycodeResult.value = result.punycode
    steps.value = result.steps
    currentStep.value = 0
    isPlaying.value = false
  }

  function nextStep() {
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
    } else {
      isPlaying.value = false
    }
  }

  function prevStep() {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  function goToStep(index: number) {
    currentStep.value = Math.max(0, Math.min(index, steps.value.length - 1))
  }

  function play() {
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function reset() {
    currentStep.value = 0
    isPlaying.value = false
  }

  function clear() {
    input.value = ''
    punycodeResult.value = ''
    steps.value = []
    error.value = ''
    currentStep.value = 0
    isPlaying.value = false
  }

  function loadExample(example: string) {
    input.value = example
    encode()
  }

  return {
    input,
    punycodeResult,
    steps,
    error,
    hasResult,
    currentStep,
    totalSteps,
    currentStepData,
    isPlaying,
    playbackSpeed,
    encode,
    nextStep,
    prevStep,
    goToStep,
    play,
    pause,
    reset,
    clear,
    loadExample
  }
}