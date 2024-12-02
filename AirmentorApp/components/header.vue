<script setup lang="ts">
  import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { useUserStore } from '~/stores/UserStore';

  const userStore = useUserStore();
  const { user, isAuthenticated } = storeToRefs(userStore);

  const announcementStore = useAnnouncementStore();
  const selected = ref();
  const loading = ref(false);

  async function authenticate() {
    window.location.href = 'http://localhost:3001/auth/google';
  }

  async function logout() {
    console.log('logout');
    window.location.href = 'http://localhost:3001/auth/logout';
  }

  async function search(q: string) {

    if (!q) {
      return [];
    }

    loading.value = true;
    const announcement = await $fetch<any[]>('http://localhost:3001/api/announcements/search/' + encodeURIComponent(q), {
      method: "GET",
      credentials: "include", // This is important to include cookies
    })
    loading.value = false;
    return announcement;
  }

  function redirectAnnouncement() {

    if (selected.value.id) {
      const router = useRouter();
      router.push('/annonces/' + selected.value.id);
      selected.value = null;
    }
  }

</script>

<template>
  <Disclosure as="nav" class="bg-white z-50" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center px-2 lg:px-0">
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="cursor-pointer text-2xl font-bold text-primary">
              AirMentor
            </NuxtLink>
          </div>
          <div class="hidden lg:ml-6 lg:block">
            <div class="flex space-x-4">
              <NuxtLink to="/annonces" active-class="font-bold text-primary underline"
                class="rounded-md border-primary hover:opacity-65 px-3 pt-1 text-lg font-medium">Annonces
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="flex flex-1 justify-center px-2 gap-3 lg:ml-6 lg:justify-end">

          <UInputMenu v-model="selected" :search="search" :loading="loading"
            placeholder="Que souhaiter vous apprendre ?" option-attribute="title" trailing class="w-[40%]" by="id">
          </UInputMenu>
          <UButton @click="redirectAnnouncement" class="rounded-xl p-2" icon="i-heroicons-magnifying-glass-20-solid" />
        </div>
        <div class="flex lg:hidden">
          <DisclosureButton
            class="relative inline-flex items-center bg-primary text-white justify-center rounded-md p-2 hover:bg-primary/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <UIcon v-if="!open" class="xl:hidden h-6 w-6 flex" name="i-heroicons-bars-2-solid" />
            <UIcon v-else class=" h-6 w-6  " name="i-mdi-close" />
          </DisclosureButton>
        </div>
        <div class="hidden lg:ml-4 lg:block">
          <div class="flex items-center">
            <!-- Profile dropdown -->
            <div class="flex flex-row" v-if="!isAuthenticated">

              <UButton @click="authenticate"
                class="bg-gray-100 text-primary rounded-xl hover:text-white xl:text-sm text-xs  border-[1px] border-primary"
                variant="solid"> <img class="h-6" src="../public/img/google.png" alt="Google logo" /> Se connecter
              </UButton>
            </div>

            <Menu as="div" class="relative ml-4 flex-shrink-0" v-else>
              <div>
                <MenuButton
                  class="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" :src="userStore.user.profile_picture" alt=""
                    v-if="userStore.user.profile_picture" />
                  <UIcon v-else class="h-8 w-8 rounded-full" name="i-mdi-account-circle" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                  <NuxtLink to="/mon-compte" class="block px-4 py-2 text-sm"
                    active-class="font-bold text-primary underline">Mon compte</NuxtLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" v-if="userStore.user.role == 'ADMIN'">
                  <NuxtLink to="/admin" class="block px-4 py-2 text-sm" active-class="font-bold text-primary underline">
                    Administration
                  </NuxtLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                  <NuxtLink to="/mes-annonces" class="block px-4 py-2 text-sm"
                    active-class="font-bold text-primary underline">Mes Annonces
                  </NuxtLink>
                  </MenuItem>
                  <MenuItem @click="logout" v-slot="{ active }">

                  <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">
                    Déconnexion</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>

    <DisclosurePanel class="lg:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <NuxtLink as="a" href="/annonces" active-class="font-bold text-primary underline"
          class="block rounded-md   hover:opacity-65 px-3 py-2 text-base font-medium text-black">
          Annonces
        </NuxtLink>
      </div>
      <div class="border-t border-gray-700 pb-3 pt-4">

        <div class="flex justify-center flex-row" v-if="!isAuthenticated">

          <UButton @click="authenticate"
            class="bg-gray-100 text-primary rounded-xl hover:text-white xl:text-sm text-xs  border-[1px] border-primary"
            variant="solid"> <img class="h-6" src="../public/img/google.png" alt="Google logo" /> Se connecter</UButton>
        </div>

        <div v-else>

          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full" :src="userStore.user.profile_picture" alt="" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-white">Tom Cook</div>
              <div class="text-sm font-medium text-gray-400">tom@example.com</div>
            </div>
            <button type="button"
              class="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <DisclosureButton as="a" href="/mon-compte"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
              Mon compte
            </DisclosureButton>
            <DisclosureButton v-if="useUserStore().user.role == 'ADMIN'" as="a" href="/admin"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
              Administration
            </DisclosureButton>
            <DisclosureButton as="a" href="/mes-annonces"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
              Mes annonces
            </DisclosureButton>
            <DisclosureButton as="a" href="#"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              @click="logout">
              Déconnexion
            </DisclosureButton>
          </div>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
