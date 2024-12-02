<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import type { AnnouncementType } from '~/types/AnnouncementType';
  import { fetchWithoutBody } from '~/utils/utils';

  const userStore = useUserStore();

  // Get the route object
  const route = useRoute();
  const showChat = ref(false);

  const isLoadingReview = ref(false);

  const isRegistered = ref(false);

  const isLoading = ref(true)

  // Extract the announcement ID from the URL
  const announcementId = ref<string>("");
  const announcement = ref<AnnouncementType>({} as AnnouncementType);

  const isOpen = ref(false);
  const revrev = ref({
    description: '',
    grade: 5,
    reviewer: "",
    reviewed: "",
  });

  async function addReview() {
    isLoadingReview.value = true;

    try {
      const rep = await fetch(`http://localhost:3001/api/users/reviews/${announcement.value.createdBy.googleId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: {
            description: revrev.value.description,
            grade: revrev.value.grade,
            reviewer: userStore.user._id,
            reviewed: announcement.value.createdBy._id,
          }
        }),
      });

      if (rep.ok) {
        console.log('review sent');
        await fetchAnnouncement();
        isOpen.value = false;
      }
    } catch (error) {
      console.log("review not sent", error);
    } finally {
      isLoadingReview.value = false;
    }
  }

  function contact() {
    if (userStore.user._id) {
      showChat.value = !showChat.value;
    } else {
      location.href = 'http://localhost:3001/auth/google';
    }
  }

  async function roll() {
    if (!userStore.user._id) {
      location.href = 'http://localhost:3001/auth/google';
    }

    try {
      const response = await fetch(`http://localhost:3001/api/users/enroll/${announcementId.value}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userStore.user._id }),
      });
      if (response.ok) {
        console.log('User enrolled');
        isRegistered.value = true;
        const toast = useToast()

        toast.add({
          id: 'delete_files',
          title: 'Inscription',
          description: 'Vous êtes inscrit au cours',
          icon: 'i-octicon-desktop-download-24',
          timeout: 3000
        })
        await fetchAnnouncement();
      } else {
        console.error('Error enrolling user');
      }
    } catch (error) {
      console.error('Error enrolling user:', error);
    }
  }


  // Watch for changes in the route params
  watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        announcementId.value = newId as string;
        fetchAnnouncement();
      }
    }
  );

  // Fetch announcement details
  const fetchAnnouncement = async () => {
    if (announcementId.value) {
      try {
        const response = await fetchWithoutBody(`announcements/${announcementId.value}`, 'GET');
        announcement.value = await response.announcement as AnnouncementType;
        isRegistered.value = announcement.value.registeredUsers.some((user) => user._id === userStore.user._id);

      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    }
  };

  // Initial call to set the ID and fetch data if route param is already set
  onMounted(async () => {
    if (route.params.id) {
      announcementId.value = route.params.id as string;
      await fetchAnnouncement();
      isLoading.value = false
    }
  });

  const displayCamera = ref(false);



</script>

<template>

  <iframe id="call-frame"></iframe>
  <div class="flex flex-col justify-between md:flex-row gap-6 container mx-auto" v-if="!isLoading">
    <div class="w-2/3">
      <h1 class="text-4xl font-bold text-primary w-full mb-3">{{ announcement.title }}</h1>
      <h3 class="text-xl text-gray-600 font-bold mb-1">Lieux du cours</h3>

      <div class="mb-6">
        <UBadge color="blue" variant="outline" i class="rounded-2xl text-lg px-2">
          <UIcon name="i-heroicons-map-pin" class="text-2xl " />
          {{ announcement.createdBy.place == "" || announcement.createdBy.place == null ? "A définir" :
            announcement.createdBy.place }}
        </UBadge>
      </div>

      <h3 class="text-xl text-gray-600 font-bold mb-1">Skills</h3>
      <div class="mb-6 flex flex-wrap gap-2">
        <UBadge color="blue" variant="outline" i class="rounded-2xl text-lg px-2" v-for="skill in announcement.skills"
          :key="skill._id">
          <UIcon name="i-heroicons-map-pin" class="text-2xl " />
          {{ skill.title }}
        </UBadge>
      </div>

      <h3 class="text-xl text-gray-600 font-bold mb-1">A propos du mentor</h3>
      <div class="mb-6">
        <p class="text-wrap">
          {{ announcement.createdBy.description === "" ? "Aucune description disponible" :
            announcement.createdBy.description }}
        </p>
      </div>
      <h3 class="text-xl text-gray-600 font-bold mb-1">A propos du cours</h3>
      <div class="mb-16">
        <p>{{ announcement.description }}</p>
      </div>

      <div class="mb-6 flex flex-col gap-6" v-if="announcement.createdBy.reviews.length > 0">
        <div class="flex gap-4 flex-row justify-between">
          <h3 class="text-xl text-gray-600 font-bold mb-1">Avis</h3>
          <div class="flex gap-1 items-center">
            <p class="text-md text-gray-600">Note moyenne</p>

            <UIcon v-for="index in 5" :key="index"
              :name="index <= announcement.createdBy.reviews.reduce((acc, review) => acc + review.grade, 0) / announcement.createdBy.reviews.length ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
              class="text-lg"
              :class="index <= announcement.createdBy.reviews.reduce((acc, review) => acc + review.grade, 0) / announcement.createdBy.reviews.length ? 'text-yellow-400' : 'text-gray-300'" />
          </div>
        </div>

        <UCard v-for="(review, key) in announcement.createdBy.reviews" :key="key" class="p-4">
          <div class="flex gap-4 justify-between pb-4">
            <img :src="review.reviewer.profile_picture" alt="Profile Picture">

            <h3 class="font-bold text-xl text-gray-800">{{ review.reviewer.name }}</h3>


            <div class="flex gap-1">
              <UIcon v-for="index in 5" :key="index"
                :name="index <= review.grade ? 'i-heroicons-star-solid' : 'i-heroicons-star'" class="text-lg"
                :class="index <= review.grade ? 'text-yellow-400' : 'text-gray-300'" />
            </div>

          </div>
          <p class="text-sm text-gray-600">{{ review.description }}</p>
        </UCard>
      </div>
      <div v-else>
        <p class="text-gray-600">Aucun avis disponible</p>
        <!-- boutton pur donner un avis -->
        <UButton @click="isOpen = !isOpen" class="rounded-3xl p-4  text-2xl  w-fit"
          v-if="announcement.createdBy._id !== userStore.user._id && isRegistered">
          <UIcon name="i-heroicons-star-solid" class="text-2xl " />
          Laisser un avis
        </UButton>
      </div>
    </div>

    <div class="w-1/3">
      <UCard>
        <div class="flex flex-col gap-4 p-4">
          <NuxtImg :src="announcement.picture" class="w-full h-48 object-cover rounded-md" />
          <h3 class="font-bold text-xl text-gray-800">{{ announcement.createdBy.name }}</h3>
          <div class="flex gap-4 items-center">
            <div class="flex gap-1">
              <UIcon v-for="index in 5" :key="index"
                :name="index <= announcement.createdBy.reviews.reduce((acc, review) => acc + review.grade, 0) / announcement.createdBy.reviews.length ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
                class="text-lg"
                :class="index <= announcement.createdBy.reviews.reduce((acc, review) => acc + review.grade, 0) / announcement.createdBy.reviews.length ? 'text-yellow-400' : 'text-gray-300'" />
            </div>
            <p class="text-sm text-gray-600" v-if="announcement.createdBy.reviews.length > 0">{{
              (announcement.createdBy.reviews.reduce((acc, review) => acc +
                review.grade, 0) / announcement.createdBy.reviews.length).toFixed(1) }}/5</p>
            <p class="text-sm text-gray-600" v-else>Il y a 0 avis</p>
          </div>
          <p class="text-sm text-gray-600">Tarif horaire: {{ announcement.createdBy.credits }} crédits</p>
          <div class="flex flex-row gap-4">
            <UButton @click="contact" class="rounded-3xl p-4  text-2xl  w-fit"
              v-if="announcement.createdBy._id !== userStore.user._id">
              <UIcon name="i-heroicons-chat-bubble-left-right-solid" class="text-2xl " />
              Contacter
            </UButton>
            <UButton @click="roll" class="rounded-3xl p-4  text-2xl  w-fit"
              v-if="!isRegistered && announcement.createdBy._id !== userStore.user._id">
              <UIcon name="i-heroicons-user-plus-solid" class="text-2xl " />
              M'inscrire
            </UButton>

            <UButton disabled class="rounded-3xl p-4  text-2xl  w-fit"
              v-else-if="announcement.createdBy._id !== userStore.user._id">
              <UIcon name="i-heroicons-check-solid" class="text-2xl" />
              Inscrit
            </UButton>

          </div>
          <UButton v-if="isRegistered || announcement.createdBy._id == userStore.user._id"
            @click="displayCamera = !displayCamera">
            <UIcon name="i-heroicons-video-camera" class="text-2xl " />
            Facetime
          </UButton>
          <!-- liste des inscrits -->
          <div class="flex flex-row gap-4">
            <UMenu>
              <template #trigger>
                <UButton class="rounded-3xl p-4  text-2xl  w-fit">
                  <UIcon name="i-heroicons-users-solid" class="text-2xl " />
                  Liste des inscrits ({{ announcement.registeredUsers.length }})
                </UButton>
              </template>
              <UMenuItem v-for="user in announcement.registeredUsers" :key="user._id">
                <div class="flex gap-4 items-center">
                  <img :src="user.profile_picture" v-if="user.profile_picture" class="w-12 h-12 rounded-full mb-2" />
                  <UIcon class="h-12 w-12 rounded-full" name="i-mdi-account-circle" v-else />
                  <p class="text-gray-800">{{ user.name }}</p>
                </div>
              </UMenuItem>
            </UMenu>
          </div>
        </div>
      </UCard>
    </div>
    <Chat v-if="showChat" :id-announcement="announcementId" :announcement="announcement" />
  </div>



  <div v-if="displayCamera">
    <Facecam />
  </div>



  <UModal v-model="isOpen">
    <form @submit.prevent="addReview">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white ">
              {{ "Ajout d'un avis" }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>


        <div class="flex flex-col justify-center gap-6 px-8 ">
          <UFormGroup label="Note" name="note">
            <UInput type="text" v-model="revrev.grade" required />
          </UFormGroup>
          <UFormGroup label="Description" name="description">
            <UTextarea class="mt-2" placeholder="Description avis..." v-model="revrev.description" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex gap-3 py-4 justify-center">
            <UButton @click="isOpen = false" class="bg-red-500">
              Annuler
            </UButton>
            <UButton type="submit" :loading="isLoadingReview">
              Enregistrer
            </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>

</template>

<style scoped></style>