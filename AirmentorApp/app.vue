<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { onMounted } from 'vue';
  import { useUserStore } from '~/stores/UserStore';

  const userStore = useUserStore();
  const { user, isAuthenticated } = storeToRefs(userStore);

  // Check authentication status when the app loads
  onMounted(async () => {
    await userStore.checkAuth();
  });

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>
