<script setup lang="ts">
  import type { FormSubmitEvent } from '#ui/types';
  import { onMounted, reactive, ref } from 'vue';
  import { z } from 'zod';
  import { useUserStore } from "~/stores/UserStore.ts";

  const loading = ref(false);
  const message = ref('');
  const successMessage = ref('');



  const schema = z.object({
    name: z.string().min(2, 'Must be at least 2 characters'),
    phoneNumber: z.string().min(10, 'Must be at least 10 characters'),
    place: z.string().min(2, 'Must be at least 2 characters'),
    description: z.string().min(10, 'Must be at least 10 characters').max(350, 'Must be at most 350 characters'),
    languages: z.array(z.string()).min(1, 'At least one language is required'),

  });

  type Schema = z.output<typeof schema>;

  const languagesInput = computed({
    get: () => state.languages.join(', '),
    set: (value: string) => {
      state.languages = value.split(',').map(lang => lang.trim()).filter(lang => lang !== '');
    }
  });

  const state = reactive<Schema>({
    name: '',
    age: 0,
    phoneNumber: '',
    place: '',
    languages: [],
    profile_picture: '',
    credits: 0,
    grade: 0,
  });
  const userStore = useUserStore();
  const { user, isAuthenticated } = storeToRefs(userStore); // Assurez-vous que l'ID est disponible
  async function fetchUserData() {
    try {
      loading.value = true;
      const response = await fetch('http://localhost:3001/api/users/' + userStore.user.googleId, {
        method: "GET",
        credentials: "include", // This is important to include cookies
      });
      const user = await response.json()

      if (user) {
        // Update all properties of state with the fetched data
        state.name = user.name
        state.description = user.description
        state.phoneNumber = user.phoneNumber
        state.languages = user.languages
        state.profile_picture = user.profile_picture
        state.credits = user.credits
        state.grade = user.grade
        state.place = user.place
      }
    } catch (e) {
      console.log('Failed to fetch user data', e);
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    if (user.name !== "") {
      await fetchUserData();
    }
  });

  async function deleteAccount(event: FormSubmitEvent<Schema>) {
    window.location.href = 'http://localhost:3001/auth/logout';
    userStore.deleteUser(userStore.user.googleId)
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      const parsedData = schema.parse({
        name: state.name,
        description: state.description,
        phoneNumber: state.phoneNumber,
        place: state.place,
        languages: state.languages,
      });
      const response = await fetch(`http://localhost:3001/api/users/${userStore.user.googleId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      successMessage.value = 'Profil mise à jour avec succès';

      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
      const result = await response.json();

      // Update the user store with the new data
      userStore.updateUser(result);

    } catch (error) {
      console.error('Failed to update user data:', error);
      // Optionally handle the error (e.g., show an error message to the user)
    }
  }
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-3 container mx-auto">
    <!--      Colonne 1 -->
    <div class="flex flex-col w-full gap-4">
      <!--    Photo de profile -->
      <UCard class="w-full flex flex-col items-center ">
        <h3 class="font-bold w-full text-center pb-3 ">Photo de profil 😊</h3>
        <NuxtImg :src="state.profile_picture" alt="Profile picture" class="rounded-[15%]  w-60 h-60" />
      </UCard>
      <!--    Suppression du compte-->
      <UCard class="w-full flex flex-col items-center ">
        <h3 class="font-bold w-full text-center pb-3 ">Suppression du compte 🗑️</h3>
        <p class="text-center">Vous êtes sur le point de supprimer votre compte. Cette action est irréversible.</p>
        <div class="flex md:flex-row flex-col justify-center items-center w-full pt-3 gap-6 ">
          <UButton @click="deleteAccount" class="w-fit px-4 rounded-full bg-gray-500 hover:bg-red-600 ">Supprimer
          </UButton>
        </div>
      </UCard>
    </div>
    <!--      Colonne 2 -->

    <div class="flex flex-col gap-4">
      <!--        Information Générale 🤷‍  Forrmualaire️-->

      <UCard class="flex flex-col ">
        <h3 class="font-bold w-full text-center pb-3 ">Informations générales 📝</h3>
        <UForm :schema="schema" :state="state" class="space-y-4 " @submit="onSubmit">
          <UFormGroup label="Nom" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Description" name="description">
            <UTextarea v-model="state.description" />
          </UFormGroup>
          <UFormGroup label="Numéro de téléphone" name="Phone Number">
            <UInput v-model="state.phoneNumber" />
          </UFormGroup>
          <UFormGroup label="Lieu" name="place">
            <UInput v-model="state.place" size="xl" />
          </UFormGroup>
          <UFormGroup label="Langues" name="languages">
            <UInput v-model="languagesInput" placeholder="ex : Français, Anglais..." />
            <p class="text-sm text-gray-500 mt-1">
              Séparer les langues avec des ;
            </p>
          </UFormGroup>
          <UButton @click="onSubmit" type="submit" class="w-fit px-4 rounded-full bg-gray-500 hover:bg-blue-500 ">
            Modifier</UButton>
        </UForm>
        <p v-if="successMessage" class="mt-4 text-green-600 font-bold">{{ successMessage }}</p>

      </UCard>
    </div>
    <!--      Colonne 3 Map note en etoile et nombre de credit restant -->

    <div class="flex flex-col w-full gap-4">


      <UCard class="w-full flex flex-col items-center">
        <h3 class="font-bold w-full text-center pb-3 ">Note et Avis 🌟</h3>
        <div class="flex flex-col items-center gap-4 ">
          <div class="flex items-center gap-4">
            <UIcon v-for="index in 5" :key="index" :name="state.grade ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
              :class="state.grade ? 'text-yellow-400' : 'text-gray-300'" />
          </div>

          <!-- <div class="flex gap-x-2 ">
            <UIcon name="i-heroicons-star" class="text-4xl text-yellow-400" />
            <UIcon name="i-heroicons-star" class="text-4xl text-yellow-400" />
            <UIcon name="i-heroicons-star" class="text-4xl text-yellow-400" />
            <UIcon name="i-heroicons-star" class="text-4xl text-yellow-400" />
            <UIcon name="i-heroicons-star" class="text-4xl text-yellow-400" />
          </div> -->
          <p>Vous avez une note de <span class="font-bold">{{ state.grade }}/5</span></p>
        </div>
      </UCard>
      <UCard class="w-full flex flex-col items-center ">
        <h3 class="font-bold w-full text-center pb-3 ">Crédit restant(s) 💰</h3>
        <p class="text-center">Vous avez <span class="font-bold">{{ state.credits }}</span> crédits restants</p>
      </UCard>
    </div>
  </section>
</template>
