<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4"
  >
    <div class="max-w-md w-full text-center space-y-8">
      <div class="space-y-3">
        <h1
          class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        >
          NexusMind
        </h1>
        <p class="text-slate-400 text-sm md:text-base">
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
          class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold px-6 py-3 rounded-xl transition-all text-center"
        >
          Sign In
        </NuxtLink>
      </div>

      <div class="text-xs text-slate-600 pt-8">
        Powered by Flask, OpenRouter, and Nuxt.js
      </div>
    </div>
  </div>
</template>

<script setup>
// No complex reactive logic needed for the simple landing page wrapper,
// NuxtLink handles client-side routing automatically out of the box.
</script>
