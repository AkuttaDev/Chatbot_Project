<template>
  <div
    :class="
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    "
    class="h-screen overflow-hidden flex flex-col justify-between transition-colors duration-200"
  >
    <!-- Header -->
    <header
      :class="
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      "
      class="border-b px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0"
    >
      <div class="flex items-center space-x-3">
        <h1
          class="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        >
          NexusMind
        </h1>
        <NuxtLink
          to="/chat"
          :class="
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          "
          class="text-xs px-3 py-1.5 rounded-lg border transition-colors"
        >
          ← Back to Chat
        </NuxtLink>
      </div>

      <div class="flex items-center space-x-3">
        <button
          type="button"
          @click="toggleTheme"
          :class="
            isDark
              ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          "
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          {{ isDark ? "☀️ Light" : "🌙 Dark" }}
        </button>

        <span
          :class="isDark ? 'text-slate-300' : 'text-slate-700'"
          class="text-sm font-medium"
        >
          History for <span class="text-indigo-400">{{ userName }}</span>
        </span>

        <button
          type="button"
          @click="handleLogout"
          :class="
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          "
          class="text-xs font-semibold px-3 py-2 rounded-lg border transition-colors"
        >
          Logout
        </button>
      </div>
    </header>

    <!-- Main History Feed -->
    <main
      class="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-4xl w-full mx-auto"
    >
      <!-- Stats & Search Bar -->
      <div
        :class="
          isDark
            ? 'bg-slate-900/70 border-slate-800'
            : 'bg-white border-slate-200'
        "
        class="border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 class="text-sm font-semibold">Activity & Conversation Log</h2>
          <p
            :class="isDark ? 'text-slate-400' : 'text-slate-500'"
            class="text-xs"
          >
            {{ filteredHistory.length }} message{{
              filteredHistory.length === 1 ? "" : "s"
            }}
            recorded
          </p>
        </div>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search messages or sessions..."
          :class="
            isDark
              ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
          "
          class="border rounded-xl px-3.5 py-2 text-xs w-full sm:w-64 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div v-if="isLoading" class="text-center text-slate-500 py-12 text-sm">
        Loading your chat history...
      </div>

      <div
        v-else-if="filteredHistory.length === 0"
        class="h-64 flex flex-col items-center justify-center text-center text-slate-500 py-12 space-y-2"
      >
        <p class="text-sm font-medium text-slate-400">
          No matching conversations found.
        </p>
        <p class="text-xs text-slate-600">
          Start chatting in the main dashboard to build up your history!
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(item, index) in filteredHistory"
          :key="item.id || index"
          :class="item.sender_type === 'user' ? 'justify-end' : 'justify-start'"
          class="flex w-full"
        >
          <div
            v-if="item.sender_type === 'user'"
            class="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-lg shadow-md text-sm space-y-1.5"
          >
            <div
              class="flex items-center justify-between gap-4 text-[10px] text-indigo-200/90"
            >
              <span class="font-semibold uppercase tracking-wide">You</span>
              <span class="truncate max-w-[140px]">{{ item.session_id }}</span>
            </div>
            <p class="whitespace-pre-wrap leading-relaxed">
              {{ item.message_content }}
            </p>
            <span class="block text-[10px] text-indigo-200 text-right">
              {{ formatTimestamp(item.created_at) }}
            </span>
          </div>

          <div
            v-else
            :class="
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            "
            class="border rounded-2xl rounded-tl-none px-4 py-3 max-w-xl shadow-sm text-sm leading-relaxed space-y-1.5"
          >
            <div
              class="flex items-center justify-between gap-4 text-[10px] text-indigo-400"
            >
              <span class="font-semibold uppercase tracking-wide"
                >Nexus AI</span
              >
              <span
                :class="isDark ? 'text-slate-500' : 'text-slate-400'"
                class="truncate max-w-[140px]"
              >
                {{ item.session_id }}
              </span>
            </div>
            <div v-html="formatAiMessage(item.message_content)"></div>
            <span
              :class="isDark ? 'text-slate-500' : 'text-slate-400'"
              class="block text-[10px] text-right"
            >
              {{ formatTimestamp(item.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { formatAiMessage } from "~/utils/formatMessage";

const userId = ref(null);
const userName = ref("");
const historyList = ref([]);
const searchQuery = ref("");
const isLoading = ref(true);
const isDark = ref(true);
const router = useRouter();

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("themeMode", isDark.value ? "dark" : "light");
};

const formatTimestamp = (rawDate) => {
  if (!rawDate) return "";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return String(rawDate);
  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const filteredHistory = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return historyList.value;
  return historyList.value.filter(
    (item) =>
      (item.message_content || "").toLowerCase().includes(q) ||
      (item.session_id || "").toLowerCase().includes(q),
  );
});

onMounted(async () => {
  if (localStorage.getItem("themeMode") === "light") {
    isDark.value = false;
  }

  const storedId = localStorage.getItem("userId");
  const storedName = localStorage.getItem("userName");

  if (!storedId) {
    router.push("/login");
    return;
  }

  userId.value = storedId;
  userName.value = storedName || "User";

  try {
    const response = await $fetch(
      `http://localhost:5000/api/history/${storedId}`,
    );
    historyList.value = response.history || [];
  } catch (error) {
    console.error("Failed to load chat history", error);
  } finally {
    isLoading.value = false;
  }
});

const handleLogout = () => {
  localStorage.clear();
  router.push("/login");
};
</script>
