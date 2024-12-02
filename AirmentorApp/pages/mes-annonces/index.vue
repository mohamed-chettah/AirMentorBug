<script setup lang="ts">

import type {AnnouncementType} from "~/types/AnnouncementType";
import {ref} from "vue";
import {useUserStore} from "~/stores/UserStore";

const userStore = useUserStore();
const userId = userStore.user._id

const listAnnouncements = ref<AnnouncementType[]>([]);
const getAnnonceByCreator = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/announcements/creator/${userId}`, {
      method: "GET",
      credentials: "include", // This is important to include cookies
    });
    listAnnouncements.value = await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

getAnnonceByCreator();

const deleteAnnouncement = async (id: string) => {
  try {
    await fetch(`http://localhost:3001/api/announcements/${id}`, {
      method: "DELETE",
      credentials: "include", // This is important to include cookies
    }).then((res) => {
      if (res.ok) {
        listAnnouncements.value = listAnnouncements.value.filter((annonce) => annonce._id !== id);
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

</script>
<template>
  <main class="container mx-auto">
    <!--    ecran gestion de mes annonces-->
    <h1 class="text-4xl font-bold text-primary w-full mb-3">Mes annonces</h1>
    <!--      un li clicable pour creer une annonce-->
    <li class=" relative flex flex-row justify-center items-center   py-5 bg-gray-100 hover:bg-gray-50">
      <UIcon name="i-heroicons-plus-circle" class="h-12 w-12 flex-none text-gray-400" aria-hidden="true"/>
      <p class="text-sm font-semibold leading-6 text-gray-900">
        <NuxtLink :to="'/mes-annonces/creer-modif'">
          <span class="absolute inset-x-0 -top-px bottom-0"/>
          Créer une annonce
        </NuxtLink>
      </p>
    </li>
    <div v-for="annonce in listAnnouncements" :key="annonce._id" class="flex flex-row justify-between items-center gap-6">
        <NuxtLink :to="'/mes-annonces/creer-modif/' + annonce._id"
              class="relative w-full flex justify-between gap-x-6 py-5 hover:bg-gray-50">
      <div class="flex min-w-0 gap-x-4">
        <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="annonce.createdBy.profile_picture" alt=""/>
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">{{ annonce.title }}</p>
          <p class="mt-1 text-xs leading-5 text-gray-500">{{ annonce.description }}</p>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-x-4">
        <div class="flex flex-row justify-end items-center gap-3">
          <p>Public</p>
          <!--            rond rouge ou vert-->
          <div v-if="annonce.is_activate" class="h-3 w-3 rounded-full bg-green-500"></div>
          <div v-else class="h-3 w-3 rounded-full bg-red-500"></div>

        </div>
        <UIcon name="i-heroicons-chevron-right" class="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
      </div>
    </NuxtLink>
      <div class="flex gap-4">
        <UButton @click="deleteAnnouncement(annonce._id)" class=" w-fit bg-red-500 text-white rounded-full hover:bg-red-600 z-20">
          <UIcon name="i-heroicons-trash" class="h-5 w-5 flex-none text-white" aria-hidden="true"/>
        </UButton>

        <!--      page avec les messages-->

      <NuxtLink :to="'/mes-annonces/messages/' + annonce._id" >
        <UButton class=" w-fit bg-blue-600 text-white rounded-full hover:bg-blue-500 z-20">
          <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="h-5 w-5 flex-none text-white" aria-hidden="true"/>
        </UButton>
      </NuxtLink>
      </div>
    </div>
  </main>
</template>

