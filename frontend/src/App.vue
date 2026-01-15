<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="container header-content">
        <RouterLink to="/" class="logo" aria-label="Go to Dashboard">
          Learning App
        </RouterLink>
        <nav aria-label="Main Navigation">
          <ul class="nav-list">
            <li><RouterLink to="/dashboard" active-class="active">Dashboard</RouterLink></li>
          </ul>
        </nav>
      </div>
    </header>

    <main id="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-text);
  text-decoration: none;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--spacing-md);
}

.nav-list a {
  color: var(--color-text-muted);
  font-weight: 500;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  text-decoration: none;
}

.nav-list a.active, .nav-list a:hover {
  color: var(--color-primary);
  background-color: #eff6ff;
}
</style>
