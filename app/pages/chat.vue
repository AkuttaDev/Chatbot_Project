<template>
  <div class="h-screen overflow-hidden bg-slate-950 text-slate-100 flex">
    <!-- LEFT SIDEBAR -->
    <aside
      class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0"
    >
      <!-- Top Sidebar Section -->
      <div class="space-y-6">
        <!-- Brand / Logo -->
        <div class="flex items-center space-x-2 px-2">
          <div
            class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm"
          >
            NM
          </div>
          <h1 class="font-bold text-base text-slate-100">NexusMind</h1>
        </div>

        <!-- New Chat Button -->
        <button
          @click="startNewChat"
          class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-2"
        >
          <span>+ New chat</span>
        </button>

        <!-- Recent Chats Section -->
        <div class="space-y-2">
          <p
            class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2"
          >
            Recent Chats
          </p>
          <div class="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)]">
            <div
              v-for="chat in recentChats"
              :key="chat.id"
              class="text-xs text-slate-300 hover:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer truncate transition-colors"
            >
              {{ chat.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Sidebar Section (User Profile & History Link) -->
      <div class="border-t border-slate-800 pt-4 space-y-3">
        <NuxtLink
          to="/chat-history"
          class="flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors"
        >
          <span>Chat History and activity</span>
        </NuxtLink>

        <div class="flex items-center justify-between px-2 pt-2">
          <div class="truncate">
            <p class="text-xs font-semibold text-slate-200 truncate">
              {{ userName }}
            </p>
            <p class="text-[10px] text-slate-500">Your account</p>
          </div>
          <button
            @click="handleLogout"
            class="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>

    <!-- RIGHT MAIN CHAT AREA -->
    <div class="flex-1 flex flex-col justify-between h-full bg-slate-950">
      <!-- Top Bar -->
      <header
        class="border-b border-slate-900 px-6 py-4 flex items-center justify-between shrink-0"
      >
        <div>
          <h2 class="text-sm font-semibold text-slate-200">AI Assistant</h2>
          <p class="text-xs text-slate-500">Here to help today!.</p>
        </div>
      </header>

      <!-- Main Chat Feed (Scrollable) -->
      <main
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-3xl w-full mx-auto"
      >
        <!-- Empty State -->
        <div
          v-if="messages.length === 0"
          class="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 space-y-2"
        >
          <div
            class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 text-xl font-bold"
          >
            NM
          </div>
          <p class="text-sm font-medium text-slate-400">
            How can I assist you today, {{ userName }}?
          </p>
          <p class="text-xs text-slate-600">
            Type a message below to start chatting.
          </p>
        </div>

        <!-- Messages List -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
          class="flex w-full"
        >
          <div
            v-if="msg.sender === 'user'"
            class="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-md shadow-lg text-sm"
          >
            {{ msg.content }}
          </div>
          <div
            v-else
            class="bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-md shadow-md text-sm leading-relaxed"
          >
            {{ msg.content }}
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div
            class="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center space-x-2"
          >
            <span class="animate-pulse">AI is thinking...</span>
          </div>
        </div>
      </main>

      <!-- Bottom Fixed Input Bar -->
      <footer class="p-4 bg-slate-950 shrink-0">
        <form
          @submit.prevent="sendMessage"
          class="max-w-3xl w-full mx-auto flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2"
        >
          <input
            v-model="userMessage"
            type="text"
            placeholder="Message NexusMind..."
            :disabled="isLoading"
            class="flex-1 bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-500 disabled:opacity-50 py-2"
          />
          <button
            type="submit"
            :disabled="isLoading || !userMessage.trim()"
            class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all text-sm shrink-0"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

const userName = ref("");
const userId = ref(null);
const userMessage = ref("");
const messages = ref([]);
const isLoading = ref(false);
const currentSessionId = ref("default_session_" + Date.now());
const recentChats = ref([
  { id: currentSessionId.value, title: "Current Conversation" },
]);
const router = useRouter();
const chatContainer = ref(null);

onMounted(() => {
  const storedId = localStorage.getItem("userId");
  const storedName = localStorage.getItem("userName");

  if (!storedId) {
    router.push("/login");
  } else {
    userId.value = storedId;
    userName.value = storedName || "User";
  }
});

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const startNewChat = () => {
  currentSessionId.value = "session_" + Date.now();
  messages.value = [];

  recentChats.value.unshift({
    id: currentSessionId.value,
    title: "New Conversation",
  });
};

const handleLogout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");

  router.push('/login')
}

const sendMessage = async () => {
  if (!userMessage.value.trim() || isLoading.value) return

  const currentText = userMessage.value
  userMessage.value = ''

  messages.value.push({ sender: 'user', content: currentText })

  if (messages.value.length === 1) {
    recentChats.value[0].title = currentText
  }

  await scrollToBottom()

  isLoading.value = true

  try {
    const response = await $fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      body: {
        user_id: userId.value,
        message: currentText,
        session_id: currentSessionId.value
      }
    })

    messages.value.push({ sender: 'assistant', content: response.reply })
    await scrollToBottom()

  } catch (error) {
    messages.value.push({ sender: 'assistant', content: 'Error: Failed to fetch AI response.' })
    await scrollToBottom()
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>
