<template>
  <div
    :class="
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    "
    class="min-h-screen flex flex-col justify-between px-4 transition-colors duration-200"
  >
    <!-- Top Bar with Theme Switch -->
    <header class="w-full max-w-5xl mx-auto pt-5 flex justify-end">
      <button
        type="button"
        @click="toggleTheme"
        :class="
          isDark
            ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        "
        class="border px-3 py-1.5 rounded-xl text-xs font-medium shadow-sm transition-colors"
      >
        {{ isDark ? "☀️ Light" : "🌙 Dark" }}
      </button>
    </header>

    <!-- Main Hero Section -->
    <main class="max-w-md w-full mx-auto text-center space-y-8">
      <div class="space-y-3">
        <h1
          class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        >
          NexusMind
        </h1>
        <p
          :class="isDark ? 'text-slate-400' : 'text-slate-600'"
          class="text-sm md:text-base"
        >
          Your advanced AI chat and vision assistant. Seamlessly query models,
          analyze insights, and manage conversations.
        </p>
      </div>

      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
      >
        <NuxtLink
          to="/signup"
          class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-center"
        >
          Get Started
        </NuxtLink>
        <NuxtLink
          to="/login"
          :class="
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
          "
          class="w-full sm:w-auto border font-semibold px-6 py-3 rounded-xl transition-all text-center shadow-sm"
        >
          Sign In
        </NuxtLink>
      </div>
    </main>

    <footer
      :class="isDark ? 'text-slate-600' : 'text-slate-400'"
      class="text-xs text-center pb-6"
    >
      Powered by Flask, OpenRouter, and Nuxt.js
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("themeMode", isDark.value ? "dark" : "light");
};

onMounted(() => {
  if (localStorage.getItem("themeMode") === "light") {
    isDark.value = false;
  }
});
</script>
