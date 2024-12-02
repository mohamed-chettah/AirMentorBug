<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAnnouncementStore } from '~/stores/AnnouncementStore';
  import { useUserStore } from '~/stores/UserStore';

  const userStore = useUserStore();
  const route = useRoute();
  const announcementId = route.params.id;

  const announcementStore = useAnnouncementStore();
  const conversations = ref<Conversation[]>([]);
  const selectedConversation = ref<Conversation | null>(null);
  const newMessage = ref('');
  const ws = ref<WebSocket | null>(null);

  interface Conversation {
    _id: string;
    idUser: { _id: string; name: string; profile_picture: string }[];
    idCreator: string[];
    idAnnouncement: string[];
    messages: Message[];
  }

  interface Message {
    _id: string;
    user: { _id: string, name: string };
    content: string;
    timestamp: string;
  }
  interface MessageSend {
    _id: string;
    conversationId: string;
    user: string;
    announcement: string;
    creator: string;
    content: string;
    timestamp?: string; // Change timestamp to string type
  }

  onMounted(async () => {
    await announcementStore.getAnnouncementById(announcementId);
    getConversations();
    initializeWebSocket();
  });

  const getConversations = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/conversations/${announcementId}`, {
        method: "GET",
        credentials: "include"
      });
      conversations.value = await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    selectedConversation.value = conversation;
  };

  const initializeWebSocket = () => {
    ws.value = new WebSocket('ws://localhost:3001');

    ws.value.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);
          if (selectedConversation.value && selectedConversation.value._id === message.conversationId) {
            selectedConversation.value.messages.push(message);
            scrollToBottom();
          }
          if (selectedConversation.value && selectedConversation.value.idUser._id === message.user._id) {
            selectedConversation.value.messages.push(message);
            scrollToBottom();
          }
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
  };

  const sendMessage = async () => {
    if (newMessage.value.trim() !== '' && selectedConversation.value) {

      const message: MessageSend = {
        _id: '',
        conversationId: selectedConversation.value._id,
        user: userStore.user._id,
        announcement: announcementId as string,
        creator: userStore.user._id,
        content: newMessage.value,
        timestamp: new Date().toISOString() // Convert timestamp to ISO string
      };
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify(
          message
        ));

        newMessage.value = '';
      }
    }
  };

  const scrollToBottom = () => {
    const chat = document.querySelector('.messages');
    if (chat) {
      chat.scrollTop = chat.scrollHeight;
    }
  };
</script>

<template>
  <div class="container mx-auto py-4">
    <div v-if="useAnnouncementStore().announcement.announcement">
      <h1 class="text-2xl font-semibold mb-4">Chat de l'annonce: {{
        useAnnouncementStore().announcement.announcement.title }}</h1>
      <NuxtImg :src="useAnnouncementStore().announcement.announcement.picture" />
    </div>

    <div class="flex">
      <div class="w-1/3 p-4 border-r">
        <h2 class="text-xl font-semibold mb-2">Conversations</h2>
        <ul>
          <li v-for="conversation in conversations" :key="conversation._id" @click="selectConversation(conversation)"
            class="cursor-pointer p-2 mb-2 border rounded hover:bg-gray-100 flex items-center gap-2">
            <NuxtImg :src="conversation.idUser[0].profile_picture" class="w-12 h-12 object-cover rounded-full" />
            {{ conversation.idUser[0].name }}
          </li>
        </ul>
      </div>

      <div class="w-2/3 p-4">
        <div v-if="selectedConversation">
          <h2 class="text-xl font-semibold mb-2">Messages</h2>
          <div class="messages overflow-y-auto h-64 mb-4">
            <div v-for="message in selectedConversation.messages" :key="message._id" class="mb-2">
              <div
                :class="{ 'bg-blue-100': message.user._id === userStore.user._id, 'bg-green-100': message.user._id !== userStore.user._id }"
                class="p-2 rounded-lg">
                <strong>{{ message.user.name }}:</strong> {{ message.content }}
              </div>
            </div>
          </div>
          <form @submit.prevent="sendMessage" class="flex">
            <input v-model="newMessage" placeholder="Type your message..."
              class="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" class="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">Send</button>
          </form>
        </div>
        <div v-else>
          <p>Select a conversation to view messages.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .messages {
    max-height: 256px;
    scroll-behavior: smooth;
    overflow-y: auto;
  }
</style>
