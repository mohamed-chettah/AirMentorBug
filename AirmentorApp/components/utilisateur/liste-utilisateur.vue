<script setup lang="ts">
import {useCategorieStore} from "~/stores/CategorieStore";
import type {CategorieType} from "~/types/CategorieType";
import type {UserType} from "~/types/UserType";

const userStore = useUserStore()

userStore.getAllUsers()

const columns = [{
  key: 'name',
  label: 'Utilisateur',
  sortable: true
},
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Actions'
  }]


function deleteUser(row : UserType) {


  const confirmDelete = confirm(`Voulez-vous vraiment supprimer l'utilisateur "${row.name}" ?`);

  if (confirmDelete) {
    userStore.deleteUser(row._id)
        .then(() => {
          const toast = useToast()

          toast.add({
            id: 'delete_files',
            title: 'Suppression Utilisateur',
            description: 'L \'utilisateur a été supprimé avec succès',
            icon: 'i-octicon-desktop-download-24',
            timeout: 3000
          })
          userStore.getAllUsers()
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', error);
          alert('Erreur lors de la suppression de l\'utilisateur');
        });
  }
}
</script>-

<template>
  <UTable :columns="columns" :rows="userStore.listUsers" :loading="userStore.loading">
    <template #actions-data="{ row }">
      <div class="flex items-center space-x-2">
        <UButton @click="deleteUser(row)" icon="i-heroicons-trash-16-solid" class="bg-red-700 hover:bg-red-700/80"/>
      </div>
    </template>
  </UTable>


</template>

<style scoped>

</style>