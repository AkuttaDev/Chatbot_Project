<template>
  <div class="h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between">
    
    <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center space-x-3">
        <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          NexusMind
        </h1>
        <NuxtLink to="/chat" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
          Back to Chat
        </NuxtLink>
      </div>

      <div class="flex items-center space-x-4">
        <span class="text-sm text-slate-300 font-medium">
          History for <span class="text-indigo-400">{{ userName }}</span>
        </span>
        <button 
          @click="handleLogout"
          class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>

    
    <main class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl w-full mx-auto">
      
      <div v-if="isLoading" class="text-center text-slate-500 py-12">
        Loading your chat history...
      </div>

      <div v-else-if="historyList.length === 0" class="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 space-y-2">
        <p class="text-sm font-medium text-slate-400">No past conversations found.</p>
        <p class="text-xs text-slate-600">Start chatting in the main dashboard to build up your history!</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="(item, index) in historyList" 
          :key="index"
          :class="item.sender_type === 'user' ? 'justify-end' : 'justify-start'"
          class="flex w-full"
        >
          <div 
            v-if="item.sender_type === 'user'"
            class="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-md shadow-lg text-sm space-y-1"
          >
            <p>{{ item.message_content }}</p>
            <span class="block text-[10px] text-indigo-200 text-right">{{ item.created_at }}</span>
          </div>

          <div 
            v-else
            class="bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-md shadow-md text-sm leading-relaxed space-y-1"
          >
            <p>{{ item.message_content }}</p>
            <span class="block text-[10px] text-slate-500 text-right">{{ item.created_at }}</span>
          </div>
        </div>
      </div>

    </main>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'

const userId = ref(null)
const userName = ref('')
const historyList = ref([])
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  const storedId = localStorage.getItem('userId')
  const storedName = localStorage.getItem('userName')

  if (!storedId) {
    router.push('/login')
    return
  }

  userId.value = storedId
  userName.value = storedName || 'User'

  try {
    const response = await $fetch(`http://localhost:5000/api/history/${storedId}`)
    historyList.value = response.history
  } catch (error) {
    console.error('Failed to load chat history', error)
  } finally {
    isLoading.value = false
  }
})

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>