<template>
  <div
    :class="
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    "
    class="h-screen overflow-hidden flex transition-colors duration-200"
  >
    <!-- LEFT SIDEBAR -->
    <aside
      :class="
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      "
      class="w-64 border-r flex flex-col justify-between p-4 shrink-0"
    >
      <!-- Top Sidebar Section -->
      <div class="space-y-6">
        <div class="flex items-center justify-between px-2">
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm"
            >
              NM
            </div>
            <h1 class="font-bold text-base">NexusMind</h1>
          </div>

          <!-- Dark / Light Mode Toggle -->
          <button
            type="button"
            @click="toggleTheme"
            :class="
              isDark
                ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            "
            class="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            {{ isDark ? "☀️ Light" : "🌙 Dark" }}
          </button>
        </div>

        <!-- New Chat Button -->
        <button
          type="button"
          @click="startNewChat"
          class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-2"
        >
          <span>+ New chat</span>
        </button>

        <!-- Recent Chats Section -->
        <div class="space-y-2">
          <p
            :class="isDark ? 'text-slate-500' : 'text-slate-400'"
            class="text-[11px] font-semibold uppercase tracking-wider px-2"
          >
            Recent Chats
          </p>
          <div class="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)]">
            <div
              v-for="chat in recentChats"
              :key="chat.id"
              @click="selectSession(chat.id)"
              :class="[
                chat.id === currentSessionId
                  ? isDark
                    ? 'bg-slate-800 text-white font-medium'
                    : 'bg-indigo-50 text-indigo-700 font-medium'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800/60'
                    : 'text-slate-700 hover:bg-slate-100',
              ]"
              class="text-xs px-3 py-2 rounded-lg cursor-pointer truncate transition-colors"
            >
              {{ chat.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Sidebar Section -->
      <div
        :class="isDark ? 'border-slate-800' : 'border-slate-200'"
        class="border-t pt-4 space-y-3"
      >
        <NuxtLink
          to="/chat-history"
          :class="
            isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          "
          class="flex items-center space-x-2 text-xs px-2 py-1 transition-colors"
        >
          <span>Chat History and activity</span>
        </NuxtLink>

        <div class="flex items-center justify-between px-2 pt-2">
          <div class="truncate">
            <p class="text-xs font-semibold truncate">
              {{ userName }}
            </p>
            <p
              :class="isDark ? 'text-slate-500' : 'text-slate-400'"
              class="text-[10px]"
            >
              Your account
            </p>
          </div>
          <button
            type="button"
            @click="handleLogout"
            class="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>

    <!-- RIGHT MAIN CHAT AREA -->
    <div
      :class="isDark ? 'bg-slate-950' : 'bg-slate-50'"
      class="flex-1 flex flex-col justify-between h-full transition-colors duration-200"
    >
      <!-- Top Bar -->
      <header
        :class="
          isDark
            ? 'border-slate-900 bg-slate-950/80'
            : 'border-slate-200 bg-white'
        "
        class="border-b px-6 py-4 flex items-center justify-between shrink-0"
      >
        <div>
          <h2 class="text-sm font-semibold">AI Assistant — Nexus</h2>
          <p
            :class="isDark ? 'text-slate-500' : 'text-slate-500'"
            class="text-xs"
          >
            Ask questions, share images or links, upload documents, or use
            voice.
          </p>
        </div>
      </header>

      <!-- Main Chat Feed -->
      <main
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-3xl w-full mx-auto"
      >
        <!-- Empty State -->
        <div
          v-if="messages.length === 0"
          :class="isDark ? 'text-slate-500' : 'text-slate-500'"
          class="h-full flex flex-col items-center justify-center text-center py-12 space-y-2"
        >
          <div
            :class="
              isDark
                ? 'bg-slate-900 border-slate-800 text-indigo-400'
                : 'bg-white border-slate-200 text-indigo-600'
            "
            class="w-12 h-12 rounded-2xl border flex items-center justify-center text-xl font-bold shadow-sm"
          >
            NM
          </div>
          <p
            :class="isDark ? 'text-slate-400' : 'text-slate-700'"
            class="text-sm font-medium"
          >
            How can I assist you today, {{ userName }}?
          </p>
          <p
            :class="isDark ? 'text-slate-600' : 'text-slate-400'"
            class="text-xs"
          >
            Type a message, speak into your mic, or attach an image/file below.
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
            class="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-md shadow-lg text-sm whitespace-pre-wrap"
          >
            {{ msg.content }}
          </div>
          <div
            v-else
            :class="
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            "
            class="border rounded-2xl rounded-tl-none px-4 py-3 max-w-xl shadow-sm text-sm leading-relaxed"
            v-html="formatAiMessage(msg.content)"
          ></div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div
            :class="
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400'
                : 'bg-white border-slate-200 text-slate-500'
            "
            class="border rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center space-x-2"
          >
            <span class="animate-pulse">Nexus is thinking...</span>
          </div>
        </div>
      </main>

      <!-- Bottom Fixed Input Bar -->
      <footer
        :class="isDark ? 'bg-slate-950' : 'bg-slate-50'"
        class="p-4 shrink-0 space-y-2"
      >
        <div class="max-w-3xl w-full mx-auto space-y-2">
          <!-- Attachment Previews (Image / Image Link / Document) -->
          <div
            v-if="selectedImageBase64 || imageUrlInput.trim() || attachedDoc"
            :class="
              isDark
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200'
            "
            class="border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img
                v-if="selectedImageBase64 || imageUrlInput.trim()"
                :src="selectedImageBase64 || imageUrlInput.trim()"
                alt="Preview"
                class="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0"
              />
              <div
                v-if="attachedDoc"
                class="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium truncate"
              >
                📄 {{ attachedDoc.filename }}
              </div>
              <span v-else class="truncate opacity-80">
                {{
                  imageUrlInput.trim()
                    ? imageUrlInput.trim()
                    : "Image ready to describe"
                }}
              </span>
            </div>

            <button
              type="button"
              @click="clearAttachments"
              class="text-red-400 hover:text-red-300 font-medium px-2 py-1"
            >
              Remove
            </button>
          </div>

          <!-- Optional Image URL Input Bar -->
          <div v-if="showImageUrlBox" class="flex items-center gap-2">
            <input
              v-model="imageUrlInput"
              type="url"
              placeholder="Paste image URL (e.g. https://example.com/photo.jpg)..."
              :class="
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              "
              class="flex-1 border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              @click="showImageUrlBox = false"
              class="text-xs px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Done
            </button>
          </div>

          <!-- Main Input Form -->
          <form
            @submit.prevent="sendMessage"
            :class="
              isDark
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200'
            "
            class="border rounded-2xl px-3 py-2 flex items-center gap-2 shadow-sm"
          >
            <!-- Hidden Image Input -->
            <input
              ref="imageInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageFileChange"
            />

            <!-- Hidden Document Input -->
            <input
              ref="docInputRef"
              type="file"
              accept=".txt,.md,.csv,.json,.pdf,.docx"
              class="hidden"
              @change="handleDocFileChange"
            />

            <!-- Image Upload Button -->
            <button
              type="button"
              @click="imageInputRef?.click()"
              :class="
                isDark
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
              "
              class="p-2 rounded-xl transition-colors shrink-0"
              title="Upload image"
            >
              🖼️
            </button>

            <!-- Image Link Toggle -->
            <button
              type="button"
              @click="showImageUrlBox = !showImageUrlBox"
              :class="
                isDark
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
              "
              class="p-2 rounded-xl transition-colors shrink-0"
              title="Paste image URL"
            >
              🔗
            </button>

            <!-- Document Upload Button -->
            <button
              type="button"
              @click="docInputRef?.click()"
              :class="
                isDark
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
              "
              class="p-2 rounded-xl transition-colors shrink-0"
              title="Upload document to explain"
            >
              📎
            </button>

            <!-- Editable Text / Transcribed Speech Input -->
            <input
              v-model="userMessage"
              type="text"
              :placeholder="
                isListening
                  ? 'Listening... speak now, then edit if needed'
                  : 'Message NexusMind...'
              "
              :disabled="isLoading"
              :class="
                isDark
                  ? 'text-slate-100 placeholder:text-slate-500'
                  : 'text-slate-900 placeholder:text-slate-400'
              "
              class="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-50 py-2"
            />

            <!-- Voice / Speech-to-Text Button -->
            <button
              type="button"
              @click="toggleSpeechInput"
              :class="
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : isDark
                    ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
              "
              class="p-2 rounded-xl transition-colors shrink-0"
              :title="
                isListening
                  ? 'Stop listening'
                  : 'Speak to transcribe (editable before sending)'
              "
            >
              🎤
            </button>

            <!-- Send Button -->
            <button
              type="submit"
              :disabled="
                isLoading ||
                (!userMessage.trim() &&
                  !selectedImageBase64 &&
                  !imageUrlInput.trim() &&
                  !attachedDoc)
              "
              class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all text-sm shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { formatAiMessage } from "~/utils/formatMessage";

const userName = ref("");
const userId = ref(null);
const userMessage = ref("");
const messages = ref([]);
const isLoading = ref(false);
const isDark = ref(true);

const currentSessionId = ref("session_" + Date.now());
const recentChats = ref([]);

const router = useRouter();
const chatContainer = ref(null);

// Image & Document states
const imageInputRef = ref(null);
const docInputRef = ref(null);
const selectedImageBase64 = ref("");
const imageUrlInput = ref("");
const showImageUrlBox = ref(false);
const attachedDoc = ref(null);

// Speech recognition state
const isListening = ref(false);
let recognitionInstance = null;

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("themeMode", isDark.value ? "dark" : "light");
};

const loadRecentSessions = async () => {
  if (!userId.value) return;
  try {
    const res = await $fetch(
      `http://localhost:5000/api/sessions/${userId.value}`,
    );
    recentChats.value = (res.sessions || []).map((s) => ({
      id: s.session_id,
      title: s.title || "Conversation",
    }));
  } catch (err) {
    console.error("Failed to load recent sessions:", err);
  }
};

const selectSession = async (sessionId) => {
  currentSessionId.value = sessionId;
  try {
    const res = await $fetch(
      `http://localhost:5000/api/history/${userId.value}/${sessionId}`,
    );
    messages.value = res.messages || [];
    await scrollToBottom();
  } catch (err) {
    console.error("Failed to load session messages:", err);
  }
};

onMounted(async () => {
  const savedTheme = localStorage.getItem("themeMode");
  if (savedTheme === "light") {
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

  await loadRecentSessions();
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
  clearAttachments();

  const exists = recentChats.value.some((c) => c.id === currentSessionId.value);
  if (!exists) {
    recentChats.value.unshift({
      id: currentSessionId.value,
      title: "New Conversation",
    });
  }
};

const clearAttachments = () => {
  selectedImageBase64.value = "";
  imageUrlInput.value = "";
  attachedDoc.value = null;
  if (imageInputRef.value) imageInputRef.value.value = "";
  if (docInputRef.value) docInputRef.value.value = "";
};

const handleImageFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  imageUrlInput.value = "";
  const reader = new FileReader();
  reader.onload = () => {
    selectedImageBase64.value = String(reader.result || "");
  };
  reader.readAsDataURL(file);
};

const handleDocFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await $fetch("http://localhost:5000/api/upload-doc", {
      method: "POST",
      body: formData,
    });

    attachedDoc.value = {
      filename: res.filename,
      content: res.content,
    };
  } catch (err) {
    alert(err.data?.message || "Failed to read file.");
  }
};

// Voice-to-text: fills input box for editing, never auto-sends
const toggleSpeechInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert(
      "Speech recognition is not supported in this browser. Try Chrome or Edge.",
    );
    return;
  }

  if (isListening.value && recognitionInstance) {
    recognitionInstance.stop();
    isListening.value = false;
    return;
  }

  recognitionInstance = new SpeechRecognition();
  recognitionInstance.lang = "en-US";
  recognitionInstance.interimResults = false;
  recognitionInstance.maxAlternatives = 1;

  recognitionInstance.onstart = () => {
    isListening.value = true;
  };

  recognitionInstance.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userMessage.value = userMessage.value
      ? `${userMessage.value} ${transcript}`.trim()
      : transcript;
  };

  recognitionInstance.onerror = () => {
    isListening.value = false;
  };

  recognitionInstance.onend = () => {
    isListening.value = false;
  };

  recognitionInstance.start();
};

const handleLogout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  router.push("/login");
};

const sendMessage = async () => {
  const currentText = userMessage.value.trim();
  const hasImage = Boolean(
    selectedImageBase64.value || imageUrlInput.value.trim(),
  );
  const hasDoc = Boolean(attachedDoc.value);

  if ((!currentText && !hasImage && !hasDoc) || isLoading.value) return;

  // Ensure current session exists in sidebar
  if (!recentChats.value.some((c) => c.id === currentSessionId.value)) {
    recentChats.value.unshift({
      id: currentSessionId.value,
      title:
        currentText ||
        (hasDoc ? `File: ${attachedDoc.value.filename}` : "Image description"),
    });
  }

  let displayUserMessage = currentText;
  if (hasDoc) {
    displayUserMessage = currentText
      ? `[File: ${attachedDoc.value.filename}] ${currentText}`
      : `[File: ${attachedDoc.value.filename}] Please explain this file.`;
  } else if (hasImage && !currentText) {
    displayUserMessage = imageUrlInput.value.trim()
      ? `Describe image: ${imageUrlInput.value.trim()}`
      : "[Uploaded Image] Please describe this image.";
  }

  const payloadBody = {
    user_id: userId.value,
    message: currentText,
    session_id: currentSessionId.value,
    image_base64: selectedImageBase64.value || null,
    image_url: imageUrlInput.value.trim() || null,
    file_name: attachedDoc.value?.filename || null,
    file_content: attachedDoc.value?.content || null,
  };

  userMessage.value = "";
  clearAttachments();

  messages.value.push({ sender: "user", content: displayUserMessage });

  const activeChat = recentChats.value.find(
    (c) => c.id === currentSessionId.value,
  );
  if (
    activeChat &&
    (activeChat.title === "New Conversation" || messages.value.length === 1)
  ) {
    activeChat.title = displayUserMessage;
  }

  await scrollToBottom();
  isLoading.value = true;

  try {
    const response = await $fetch("http://localhost:5000/api/chat", {
      method: "POST",
      body: payloadBody,
    });

    messages.value.push({ sender: "assistant", content: response.reply });
    await loadRecentSessions();
    await scrollToBottom();
  } catch (error) {
    messages.value.push({
      sender: "assistant",
      content: error.data?.message || "Error: Failed to fetch AI response.",
    });
    await scrollToBottom();
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};
</script>
