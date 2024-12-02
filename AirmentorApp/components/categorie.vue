<script setup lang="ts">

import {useCategorieStore} from "~/stores/CategorieStore";

useCategorieStore().getAllCategorie()
</script>

<template>

  <div class=" mt-20 xl:mx-32 mx-20 ">

    <div class="flex items-center gap-2">
      <UIcon name="i-heroicons-tag-solid" class="text-[25px] text-primary" />
      <h2 class="text-2xl "> Différentes Catégorie de mentorat : </h2>
    </div>


  <div class="justify-center grid xl:grid-cols-3 grid-cols-1 gap-6 my-16" >

    <div v-if="useCategorieStore().listCategories" v-for="item in useCategorieStore().listCategories" class="col-span-1">

      <NuxtLink  :to="{ path: '/annonces', query: { categorie: item._id } }" >

        <UCard class="h-full bg-gradient-to-tl from-indigo-600 to-cyan-300  w-full border-[1px]" :ui="{    base: '',    ring: '',    divide: 'divide-y divide-gray-200 dark:divide-gray-700',    header: { padding: 'px-4 py-5' },    body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' }    }">

            <div class="flex flex-col items-center justify-center gap-6 px-8 py-5">
              <h3 class="text-white" >{{ item.title }}</h3>

              <p class="text-sm text-white italic">  {{ item.description }}</p>


            </div>
        </UCard>
      </NuxtLink>


    </div>

  </div>

  </div>

</template>

<style scoped>

</style>