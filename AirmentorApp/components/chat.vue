<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '~/stores/UserStore';
import { type AnnouncementType } from '~/types/AnnouncementType';

const userStore = useUserStore();
const ws = ref<WebSocket | null>(null);
let messages = ref<Message[]>([]);
const newMessage = ref('');
const chatOpen = ref(true); // State to toggle chat visibility

// Define props idAnnouncement
const props = defineProps({
  idAnnouncement: {
    type: String,
    required: true
  },
  announcement: {
    type: Object as () => AnnouncementType,
    required: true
  }
});

const getHistoryMessages = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/conversations/${userStore.user._id}/${props.announcement?.createdBy._id}/${props.idAnnouncement}`, {
      method: "GET",
      credentials: "include", // This is important to include cookies
    });
    if (response.ok) {
      messages.value = await response.json();
    }

  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

getHistoryMessages();

interface Message {
  _id: string;
  user: string;
  announcement: string;
  creator: string;
  content: string;
  timestamp?: string; // Change timestamp to string type
}

const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const message: Message = {
      _id: '',
      user: userStore.user._id,
      announcement: props.idAnnouncement,
      creator: props.announcement.createdBy._id,
      content: newMessage.value,
      timestamp: new Date().toISOString() // Convert timestamp to ISO string
    };

    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message));
      newMessage.value = '';
    }
  }
};

onMounted(() => {
  ws.value = new WebSocket('ws://localhost:3001');
  ws.value.onmessage = (event) => {
    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const blobText = reader.result as string;
          const message = JSON.parse(blobText);
          console.log('Received Blob message:', message)
          messages.value.push(message)
          // Scroll to the bottom of the chat
          scrollToBottom();
        } catch (error) {
          console.error('Error parsing Blob content:', error);
        }
      };
      reader.readAsText(event.data);
    } else if (typeof event.data === 'string') {
      try {
        const message = JSON.parse(event.data);
        console.log('Received Blob message:', message)

        messages.value.push(message)
        // Scroll to the bottom of the chat
        scrollToBottom();
      } catch (error) {
        console.error('Error parsing message content:', error);
      }
    } else {
      console.warn('Received unexpected message type:', typeof event.data);
    }
  };

  ws.value.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  ws.value.onclose = () => {
    console.log('Disconnected from WebSocket server');
  };
});

const scrollToBottom = () => {
  const chat = document.querySelector('.messages');
  if (chat) {
    chat.scrollTop = chat.scrollHeight;
  }
};
</script>

<template>
  <div v-if="chatOpen" class="fixed bottom-10 right-10 bg-white shadow-lg rounded-lg p-4 w-80 max-w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Chat</h2>
      <button @click="chatOpen = false" class="text-gray-500 hover:text-gray-700">
        ✖
      </button>
    </div>
    <div class="messages overflow-y-auto h-64 mb-4">
      <div v-for="message in messages " :key="message._id" class="mb-2" v-if="messages.length > 0">
        <div :class="{'bg-blue-100': message.user.name === userStore.user.name, 'bg-green-100': message.user.name !== userStore.user.name}" class="p-2 rounded-lg">
          <strong>{{ message.user.name }}:</strong> {{ message.content }}
        </div>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="flex">
      <input v-model="newMessage" placeholder="Type your message..."
             class="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <button type="submit" class="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">Send</button>
    </form>
  </div>
  <button v-else @click="chatOpen = true" class="fixed bottom-10 right-10 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600">
    💬
  </button>
</template>

<style scoped>
.messages {
  max-height: 256px; /* Ensure a fixed height for scrolling */
  scroll-behavior: smooth;
  overflow-y: auto;
}
</style>
