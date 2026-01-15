<script setup lang="ts">
import { ref } from 'vue';
import type { Quiz } from '../types';

const props = defineProps<{
  quiz: Quiz;
}>();

const selectedOption = ref<string | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);
const showHint = ref(false);

function checkAnswer() {
  if (!selectedOption.value) return;
  
  const option = props.quiz.options.find(o => o.id === selectedOption.value);
  if (option) {
    isCorrect.value = option.is_correct;
    showResult.value = true;
  }
}

function reset() {
  selectedOption.value = null;
  showResult.value = false;
  isCorrect.value = false;
  showHint.value = false;
}
</script>

<template>
  <div class="quiz-container" role="group" :aria-labelledby="'quiz-' + quiz.id">
    <h3 :id="'quiz-' + quiz.id" class="quiz-question">{{ quiz.question }}</h3>
    
    <div class="options">
      <div 
        v-for="option in quiz.options" 
        :key="option.id" 
        class="option-item"
      >
        <input 
          type="radio" 
          :id="quiz.id + '-' + option.id" 
          :name="quiz.id" 
          :value="option.id"
          v-model="selectedOption"
          :disabled="showResult && isCorrect"
        >
        <label :for="quiz.id + '-' + option.id">{{ option.text }}</label>
      </div>
    </div>

    <div class="actions">
      <button 
        v-if="!showResult || !isCorrect" 
        @click="checkAnswer" 
        class="btn-check"
        :disabled="!selectedOption"
      >
        Check Answer
      </button>
      
      <button 
        v-if="quiz.hint && !isCorrect" 
        @click="showHint = !showHint" 
        class="btn-hint"
        aria-expanded="showHint"
      >
        {{ showHint ? 'Hide Hint' : 'Show Hint' }}
      </button>
    </div>

    <div v-if="showHint" class="hint-box" role="note">
      <p><strong>Hint:</strong> {{ quiz.hint }}</p>
    </div>

    <div v-if="showResult" :class="['result-box', isCorrect ? 'success' : 'error']" role="alert">
      <p v-if="isCorrect">Correct! Great job. 🎉</p>
      <div v-else>
        <p>Not quite right. Try again!</p>
        <button @click="reset" class="btn-retry">Retry</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  background: #f1f5f9;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin: var(--spacing-lg) 0;
  border-left: 4px solid var(--color-primary);
}

.quiz-question {
  margin-top: 0;
  font-size: 1.1rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.5rem;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.option-item:hover {
  background: #f8fafc;
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.btn-check {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
}

.btn-check:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-hint {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
}

.hint-box {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: var(--radius-md);
  color: #92400e;
}

.result-box {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: 500;
}

.result-box.success {
  background: #dcfce7;
  color: #166534;
}

.result-box.error {
  background: #fee2e2;
  color: #991b1b;
}

.btn-retry {
  margin-top: 0.5rem;
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
}
</style>
