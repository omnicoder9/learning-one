<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Lesson } from '../types';
import InteractiveCheck from '../components/InteractiveCheck.vue';

const route = useRoute();
const router = useRouter();
const lesson = ref<Lesson | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const completing = ref(false);

const fetchLesson = async (id: string) => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(`http://localhost:8000/api/lessons/${id}`);
    if (!res.ok) throw new Error('Lesson not found');
    lesson.value = await res.json();
  } catch (e) {
    error.value = 'Could not load lesson.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLesson(route.params.id as string);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchLesson(newId as string);
  }
);

const completeLesson = async () => {
  if (!lesson.value) return;
  completing.value = true;
  try {
    const res = await fetch(`http://localhost:8000/api/lessons/${lesson.value.id}/complete`, {
      method: 'POST'
    });
    if (res.ok) {
       // Navigate to next lesson or dashboard
       if (lesson.value.next_lesson_id) {
         router.push(`/lesson/${lesson.value.next_lesson_id}`);
       } else {
         router.push('/dashboard');
       }
    }
  } catch (e) {
    console.error('Failed to complete lesson', e);
  } finally {
    completing.value = false;
  }
};
</script>

<template>
  <div class="container lesson-view">
    <div v-if="loading" class="loading">Loading lesson...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="lesson" class="lesson-content">
      <header class="lesson-header">
        <span class="course-tag">Course: {{ lesson.course_id }}</span>
        <h1>{{ lesson.title }}</h1>
        <p class="lead">{{ lesson.description }}</p>
      </header>

      <div class="content-blocks">
        <div 
          v-for="(block, index) in lesson.content" 
          :key="index" 
          class="block"
        >
          <!-- Text Block -->
          <p v-if="block.type === 'text'" class="text-block">
            {{ block.content }}
          </p>

          <!-- Code Block -->
          <div v-else-if="block.type === 'code'" class="code-block">
            <div class="code-header" v-if="block.language">{{ block.language }}</div>
            <pre><code>{{ block.content }}</code></pre>
          </div>

          <!-- Image Block -->
          <figure v-else-if="block.type === 'image'" class="image-block">
            <img :src="block.content" :alt="block.alt_text || ''">
            <figcaption v-if="block.alt_text">{{ block.alt_text }}</figcaption>
          </figure>

          <!-- Quiz Block -->
          <InteractiveCheck 
            v-else-if="block.type === 'quiz' && block.quiz" 
            :quiz="block.quiz" 
          />
        </div>
      </div>

      <footer class="lesson-footer">
        <button 
          @click="completeLesson" 
          class="btn btn-primary btn-lg"
          :disabled="completing"
        >
          {{ completing ? 'Saving...' : (lesson.next_lesson_id ? 'Complete & Next Lesson' : 'Complete Course') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.lesson-view {
  max-width: 700px; /* Optimal reading width */
  padding-bottom: 4rem;
}

.lesson-header {
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
}

.course-tag {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  font-weight: 600;
}

.lead {
  font-size: 1.25rem;
  color: var(--color-text-muted);
}

.content-blocks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.text-block {
  font-size: 1.125rem;
  margin: 0;
}

.code-block {
  background: #1e293b;
  color: #f8fafc;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: var(--spacing-sm) 0;
}

.code-header {
  background: #0f172a;
  padding: 0.25rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #94a3b8;
}

.code-block pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
}

.image-block {
  margin: var(--spacing-lg) 0;
}

.image-block img {
  max-width: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.image-block figcaption {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.lesson-footer {
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  padding-top: 2rem;
}

.btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn:hover {
  background: var(--color-primary-hover);
}

.btn:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
