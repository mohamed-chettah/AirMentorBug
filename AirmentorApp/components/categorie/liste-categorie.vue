<script setup lang="ts">
import { ref } from 'vue';
import { useCategorieStore } from "~/stores/CategorieStore";
import type { CategorieType } from "~/types/CategorieType";

const categorieStore = useCategorieStore();
categorieStore.getAllCategorie();

const columns = [
  { key: 'title', label: 'Catégorie', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'actions', label: 'Actions' }
];

const isOpen = ref(false);
const idCategorie = ref('');
const nameCategorie = ref('');
const descriptionCategorie = ref('');

function openModal(row: CategorieType | null = null) {
  if (row) {
    // Editing existing category
    idCategorie.value = row._id;
    nameCategorie.value = row.title;
    descriptionCategorie.value = row.description;
  } else {
    // Creating new category
    idCategorie.value = '';
    nameCategorie.value = '';
    descriptionCategorie.value = '';
  }
  isOpen.value = true;
}

function submitForm() {
  if (nameCategorie.value === '' || descriptionCategorie.value === '') {
    alert('Le nom et la desription de la catégorie est obligatoire');
    return;
  }


  const categBody = ref({} as CategorieType)

  if (idCategorie.value){
    categBody.value = <CategorieType>{
      _id: idCategorie.value ,
      title: nameCategorie.value,
      description: descriptionCategorie.value
    };
  }
  else {
    categBody.value = <CategorieType>{
      title: nameCategorie.value,
      description: descriptionCategorie.value
    };
  }

  if (idCategorie.value) {
    // Update existing category
    categorieStore.updateCategorie(categBody.value)
        .then(() => {
          categorieStore.getAllCategorie();
          isOpen.value = false;
        })
        .catch((error) => {
          console.error('Erreur lors de la modification de la catégorie:', error);
          alert('Erreur lors de la modification de la catégorie');
        });
  } else {
    categorieStore.createCategorie(categBody.value)
        .then(() => {
          categorieStore.getAllCategorie();
          isOpen.value = false;
        })
        .catch((error) => {
          console.error('Erreur lors de la création de la catégorie:', error);
          alert('Erreur lors de la création de la catégorie');
        });
  }
}

function deleteCategorie(row: CategorieType) {
  const confirmDelete = confirm(`Voulez-vous vraiment supprimer la catégorie "${row.title}" ?`);

  if (confirmDelete) {
    categorieStore.deleteCategorie(row._id)
        .then(() => {
          const toast = useToast()

          toast.add({
            id: 'delete_files',
            title: 'Suppression de la catégorie',
            description: 'La catégorie a été supprimé avec succès',
            icon: 'i-octicon-desktop-download-24',
            timeout: 3000
          })

          categorieStore.getAllCategorie();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de la catégorie:', error);
          alert('Erreur lors de la suppression de la catégorie');
        });
  }
}
</script>

<template>
  <div class="my-5">
    <UTooltip text="Création Catégorie" :popper="{ placement: 'top' }">
      <UButton @click="openModal(null)" class="bg-primary text-white" icon="i-heroicons-document-plus" size="sm" variant="solid" label="Catégorie" :trailing="false" />
    </UTooltip>
  </div>
  <UTable :columns="columns" :rows="categorieStore.listCategories" :loading="categorieStore.loading">
    <template #actions-data="{ row }">
      <div class="flex items-center space-x-2">
        <UButton @click="openModal(row)" icon="i-heroicons-pencil-square" class="bg-primary" />
        <UButton @click="deleteCategorie(row)" icon="i-heroicons-trash-16-solid" class="bg-red-700 hover:bg-red-700/80" />
      </div>
    </template>
  </UTable>

  <UModal v-model="isOpen">
    <form @submit.prevent="submitForm">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white ">
              {{ idCategorie ? 'Modification Catégorie' : 'Création Catégorie' }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div class="flex flex-col justify-center gap-6 px-8 ">
          <UFormGroup label="Catégorie" name="nom">
            <UInput type="text" v-model="nameCategorie" required />
          </UFormGroup>
          <UFormGroup label="Description" name="description">
            <UTextarea class="mt-2" placeholder="Description catégorie..." v-model="descriptionCategorie" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex gap-3 py-4 justify-center">
            <UButton @click="isOpen = false" class="bg-red-500">
              Annuler
            </UButton>
            <UButton type="submit" :loading="categorieStore.loading">
              Enregistrer
            </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>

<style scoped>
/* Ajoutez des styles supplémentaires ici si nécessaire */
</style>
