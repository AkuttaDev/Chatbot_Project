<template>
  <div
    :class="
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    "
    class="min-h-screen flex flex-col transition-colors duration-200"
  >
    <nav
      class="w-full max-w-5xl mx-auto px-6 pt-4 flex items-center justify-between"
    >
      <NuxtLink
        to="/"
        class="text-indigo-500 hover:text-indigo-400 font-medium text-sm"
      >
        ← Home
      </NuxtLink>

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
    </nav>

    <div class="flex-1 flex flex-col items-center justify-center px-4 py-6">
      <div
        :class="
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        "
        class="max-w-md w-full border rounded-2xl p-8 shadow-2xl space-y-6"
      >
        <div class="text-center space-y-2">
          <h1 class="text-2xl font-bold tracking-tight">Create an Account</h1>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSignup" class="space-y-4">
          <div>
            <label
              :class="isDark ? 'text-slate-400' : 'text-slate-600'"
              class="block text-xs font-medium mb-1"
            >
              Full Name
            </label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="John Doe"
              :class="
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-100'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              "
              class="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label
              :class="isDark ? 'text-slate-400' : 'text-slate-600'"
              class="block text-xs font-medium mb-1"
            >
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="johndoe@example.com"
              :class="
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-100'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              "
              class="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label
              :class="isDark ? 'text-slate-400' : 'text-slate-600'"
              class="block text-xs font-medium mb-1"
            >
              Password
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter a password"
                :class="
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                "
                class="w-full border rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :class="
                  isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                "
                class="absolute inset-y-0 right-0 px-3.5 flex items-center transition-colors"
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
            <p
              v-if="password.length > 0 && password.length < 6"
              class="text-[11px] text-amber-500 mt-1.5 flex items-center gap-1"
            >
              ⚠️ Password must be more than 6 characters.
            </p>
          </div>

          <div>
            <label
              :class="isDark ? 'text-slate-400' : 'text-slate-600'"
              class="block text-xs font-medium mb-1"
            >
              Confirm Password
            </label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                placeholder="Confirm your password"
                :class="
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                "
                class="w-full border rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                :class="
                  isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                "
                class="absolute inset-y-0 right-0 px-3.5 flex items-center transition-colors"
                :aria-label="
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                "
              >
                <svg
                  v-if="showConfirmPassword"
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
            {{ isLoading ? "Creating account..." : "Sign Up" }}
          </button>
        </form>

        <div
          :class="isDark ? 'text-slate-400' : 'text-slate-600'"
          class="text-center text-sm pt-2"
        >
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-indigo-500 hover:text-indigo-400 font-medium ml-1"
          >
            Sign In
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const router = useRouter();
const showPassword = ref(false);
const showConfirmPassword = ref(false);
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

const handleSignup = async () => {
  errorMessage.value = "";

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch("http://localhost:5000/api/signup", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });

    localStorage.setItem("userId", response.id);
    localStorage.setItem("userName", response.name);

    router.push("/chat");
  } catch (error) {
    errorMessage.value =
      error.data?.message || "An error occurred during sign up.";
  } finally {
    isLoading.value = false;
  }
};
</script>
