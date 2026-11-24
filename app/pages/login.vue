<template>
  <nav class="bg-cyan-950 text-slate-100 flex flex-row pl-7 pt-2">
    <NuxtLink
      to="/"
      class="text-indigo-400 hover:text-indigo-300 font-medium ml-1"
      >Home</NuxtLink
    >
  </nav>
  <div
    class="min-h-screen bg-cyan-950 text-slate-100 flex flex-col items-center justify-center px-4"
  >
    <div
      class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6"
    >
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold tracking-tight text-white">Login</h1>
      </div>

      <div
        v-if="errorMessage"
        class="bg-red-500/10 border border-red-500/20 text-red-700 text-sm p-3 rounded-xl text-center"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1"
            >Email:</label
          >
          <input
            v-model="email"
            type="email"
            required
            placeholder="johndoe@example.com"
            class="w-full bg-slate-800 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Enter your password..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-11 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-sm mt-2"
        >
          {{ isLoading ? "Logging in..." : "LOGIN" }}
        </button>
      </form>
      <div class="text-center text-sm text-slate-400 pt-2">
        Don't have an account?
        <NuxtLink
          to="/signup"
          class="text-indigo-400 hover:text-indigo-300 font-medium ml-1"
          >Sign Up</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const response = await $fetch("http://localhost:5000/api/signin", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    localStorage.setItem("userId", response.id);
    localStorage.setItem("userName", response.name);

    navigateTo("/chat");
  } catch (error) {
    errorMessage.value =
      error.data?.message || "An error occurred during login.";
  } finally {
    isLoading.value = false;
  }
};
</script>
