<script setup lang="ts">
  import ListeCategorie from "~/components/categorie/liste-categorie.vue";
  import ListeSkill from "~/components/skill/liste-skill.vue";
  import ListeUtilisateur from "~/components/utilisateur/liste-utilisateur.vue";

  definePageMeta({
    middleware: ["guard-global"],
    requiresAuth: true,
  })


  const items = [{
    key: 'categorie',
    label: 'Categories',
    icon: 'i-heroicons-tag-16-solid',
  }, {
    key: 'skill',
    label: 'Compétences',
    icon: 'i-mdi-lightning-bolt',
  }, {
    key: 'utilisateur',
    label: 'Utilisateurs',
    icon: 'i-heroicons-user-group-20-solid',
  }]
</script>

<template>
  <div class="flex justify-center items-center gap-2 mt-10">
    <UIcon name="i-heroicons-adjustments-horizontal" class="text-[25px] text-primary" />
    <h1 class="text-3xl "> Administration : </h1>
  </div>


  <div class="xl:container xl:mx-auto mx-20 mt-16">
    <UTabs :items="items" class="col-span-5">
      <template #default="{ item, index, selected }">
        <div class="flex items-center gap-2 relative truncate">
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0"
            :class="{ 'text-black': !selected, 'text-white': selected }" />

          <span :class="{ 'text-black': !selected, 'text-white': selected }" class="truncate">{{ item.label }}</span>

        </div>
      </template>
      <template #item="{ item }">
        <div v-if="item.key === 'categorie'">
          <ListeCategorie />
        </div>
        <div v-else-if="item.key === 'skill'">
          <ListeSkill />
        </div>
        <div v-else-if="item.key === 'utilisateur'">
          <ListeUtilisateur />
        </div>
      </template>
    </UTabs>
  </div>
</template>
