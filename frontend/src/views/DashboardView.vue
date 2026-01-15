<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import type { DashboardData } from '../types';

const data = ref<DashboardData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8000/api/dashboard');
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    data.value = await res.json();
  } catch (e) {
    error.value = 'Could not load dashboard. Please try again later.';
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container dashboard">
    <header class="page-header">
      <h1>Welcome back!</h1>
      <p class="subtitle">Here's your progress overview.</p>
    </header>

    <div v-if="loading" class="loading" role="status">Loading dashboard...</div>
    <div v-else-if="error" class="error" role="alert">{{ error }}</div>
    
    <div v-else class="dashboard-grid">
      <!-- Stats Overview -->
      <section class="stats-card" aria-labelledby="stats-heading">
        <h2 id="stats-heading" class="sr-only">Your Statistics</h2>
        <div class="stat-item">
          <span class="stat-value">{{ data?.stats.streak }}</span>
          <span class="stat-label">Day Streak 🔥</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ data?.stats.points }}</span>
          <span class="stat-label">Points 🏆</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ data?.stats.completed_lessons }}</span>
          <span class="stat-label">Lessons Done ✅</span>
        </div>
      </section>

      <!-- Current Course -->
      <section class="current-course" aria-labelledby="current-heading">
        <h2 id="current-heading">Continue Learning</h2>
        <div class="course-card featured">
          <div class="course-info">
            <h3>{{ data?.current_course.title }}</h3>
            <p>{{ data?.current_course.description }}</p>
            <div class="progress-bar-container" aria-hidden="true">
              <div class="progress-bar" :style="{ width: data?.current_course.progress + '%' }"></div>
            </div>
            <p class="sr-only">Progress: {{ data?.current_course.progress }}%</p>
          </div>
          <div class="course-action">
            <RouterLink 
              :to="'/lesson/' + data?.current_course.current_lesson_id" 
              class="btn btn-primary"
            >
              Resume Lesson
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- All Courses -->
      <section class="all-courses" aria-labelledby="courses-heading">
        <h2 id="courses-heading">Available Courses</h2>
        <div class="course-list">
          <article 
            v-for="course in data?.all_courses" 
            :key="course.id" 
            class="course-card"
          >
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <div class="course-meta">
              <span>{{ course.total_lessons }} Lessons</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: var(--spacing-lg);
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.course-card {
  background: var(--color-surface);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-md);
}

.featured {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.progress-bar-container {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-top: var(--spacing-md);
  overflow: hidden;
  max-width: 300px;
}

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-align: center;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  text-decoration: none;
}
</style>
