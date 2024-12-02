<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCategorieStore } from "~/stores/CategorieStore";
import { useSkillStore } from "~/stores/SkillStore";
import { useAnnouncementStore } from "~/stores/AnnouncementStore";
import type { AnnouncementType } from "~/types/AnnouncementType";

// Options pour les notes
const notes = [
  { label: 'Toutes', value: 'all' },
  { label: '1 étoile', value: '1' },
  { label: '2 étoiles', value: '2' },
  { label: '3 étoiles', value: '3' },
  { label: '4 étoiles', value: '4' },
  { label: '5 étoiles', value: '5' }
];

// Références réactives pour les catégories et les compétences
const categories = ref([]);
const selectedCategorie = ref('all');
const skills = ref([]);

// Récupération des stores
const categorieStore = useCategorieStore();
const skillStore = useSkillStore();
const announcementStore = useAnnouncementStore();

// Route actuelle
const route = useRoute();

// Fonction pour récupérer les annonces par catégorie
function getAnnouncementByCateg(categorie) {
  if (categorie === 'all') {
    announcementStore.getAllAnnouncement();
  } else {
    announcementStore.getAllAnnouncementByCateg(categorie);
  }
}

// Monté du composant
onMounted(async () => {
  await categorieStore.getAllCategorie();
  categories.value = categorieStore.listCategories.map((categorie) => {
    return { label: categorie.title, value: categorie._id };
  });
  categories.value.unshift({ label: 'Toutes', value: 'all' });

  await skillStore.getAllSkill();
  skills.value = skillStore.listSkills.map((skill) => {
    return { label: skill.title, value: skill._id };
  });

  if (route.query.categorie) {
    getAnnouncementByCateg(route.query.categorie as string);
    selectedCategorie.value = route.query.categorie;
  } else if (route.query.skills) {
    announcementStore.searchAnnouncementBySkill(route.query.skills as string);
  } else {
    announcementStore.getAllAnnouncement();
  }
});
</script>

<template>
  <!--  page qui presente les differentes annnonces -->
  <!--  un titre-->
  <!--  des filtres par note / par categorie / par skills-->
  <!--  une liste d'annonces (grid 3 col) sous forme de carde avec une image, un titre, une description, une note, un nombre de credit et un bouton pour voir plus de detail-->

  <div class="flex justify-center items-center mt-10 gap-2">
    <UIcon name="i-heroicons-squares-2x2-20-solid" class="text-[25px] text-primary" />
    <h1 class="text-3xl text-primary "> Listes des Annonces : </h1>
  </div>

  <div class=" flex flex-col gap-6 container mx-auto">
    <div class="flex gap-4">
      <USelect class="w-64" placeholder="Catégorie" v-model="selectedCategorie" @update:modelValue="getAnnouncementByCateg" :options="categories"/>
<!--      <USelect class="w-48" placeholder="Skills" :options="skills"/>-->
<!--      <USelect class="w-48" placeholder="Note" :options="notes"/>-->
    </div>

    <div v-if="useAnnouncementStore().listAnnouncements.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <NuxtLink :to="'/annonces/' + annonce._id" class="p-0" v-for="annonce in useAnnouncementStore().listAnnouncements" :key="annonce._id">
        <UCard>
          <div class="flex flex-col gap-4 p-4">
            <NuxtImg :src="annonce.picture " class="w-full h-48 object-cover rounded-md"/>
            <h3 class="font-bold text-xl text-gray-800 line-clamp-1">{{ annonce.title }}</h3>
            <p class="text-sm text-gray-600 line-clamp-3">{{ annonce.description }}</p>
            <h3 class="text-xl text-gray-600 font-bold mb-1">Skills</h3>
            <div class="mb-6 flex flex-wrap gap-2">
              <UBadge color="blue" variant="outline" i class="rounded-2xl text-lg px-2" v-for="skill in annonce.skills" :key="skill._id">
                <UIcon name="i-heroicons-map-pin" class="text-2xl " />
                {{ skill.title }}
              </UBadge>
            </div>
            <div class="flex gap-4 items-center">
              <div class="flex gap-1">
                <UIcon name="i-heroicons-star" class="text-lg text-yellow-400"/>
                <UIcon name="i-heroicons-star" class="text-lg text-yellow-400"/>
                <UIcon name="i-heroicons-star" class="text-lg text-yellow-400"/>
                <UIcon name="i-heroicons-star" class="text-lg text-yellow-400"/>
                <UIcon name="i-heroicons-star" class="text-lg text-yellow-400"/>
              </div>
              <p class="text-sm text-gray-600">5/5</p>
            </div>
            <p class="text-sm text-gray-600 font-medium">10 crédits</p>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <div v-else>
      <p>Aucune Annonces</p>
    </div>
  </div>
</template>