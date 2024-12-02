<script setup lang="ts">
const stats = [
  { id: 1, name: 'Sessions de mentorat par mois', value: '5000+' },
  { id: 2, name: 'Mentors disponibles', value: '1200' },
  { id: 3, name: 'Taux de satisfaction', value: '98%' },
]

</script>

<template>
  <div class="bg-gradient-to-r from-orange-200 to-gray-100 ">

  <div class="mx-32 pb-20cc flex justify-center flex-col xl:gap-16 gap-10 ">

    <div class="flex flex-col gap-8">

      <div class="opacity-0">
        <UBadge class="title dark:bg-gold-200/50 bg-gold-200/50 xl:text-sm text-[10px] text-white dark:text-white rounded-xl" size="lg" variant="solid">Design - Développement Web - SEO </UBadge>
      </div>

      <div class="xl:text-left text-center flex  xl:flex-row flex-col justify-center items-center xl:gap-32 gap-20">
        <div>
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
            Des mentors experts pour résoudre tous vos problèmes.
          </h1>

          <div class="flex flex-col font-bold gap-4 mt-14">
            <p class="text-xl">🔥 Des mentors partout en France </p>
            <p  class="text-xl">🎓 Pour toutes les matières de la tech </p>
            <p  class="text-xl"> 💪 Pour tous les niveaux et budgets </p>
          </div>

          <div class="mt-24">
            <div class="max-w-4xl">
              <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                <div v-for="stat in stats" :key="stat.id" class="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt class="text-base leading-7 text-gray-600">{{ stat.name }}</dt>
                  <dd class="order-first font-semibold tracking-tight text-gray-900 text-2xl">{{ stat.value }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div class="xl:pt-5 pt-32 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
          <div class="mr-auto w-44 flex-none space-y-8 sm:mr-0 ">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80" alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
              <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80" alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
              <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
            </div>
          </div>
          <div class="w-44 flex-none space-y-8 sm:pt-0">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80" alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
              <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80" alt="" class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg" />
              <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
  </div>
</template>

<style scoped>

</style>