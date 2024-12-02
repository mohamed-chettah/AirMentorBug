<script setup lang="ts">
import { ref } from 'vue';
import { useCategorieStore } from "~/stores/CategorieStore";
import { useSkillStore } from "~/stores/SkillStore";
import {type SkillType} from "~/types/SkillType";

const categorieStore = useCategorieStore();
categorieStore.getAllCategorie();

const skillStore = useSkillStore();
skillStore.getAllSkill();

const columns = [
  { key: 'title', label: 'Compétence', sortable: true },
  { key: 'categories.title', label: 'Catégorie', sortable: true },
  { key: 'actions', label: 'Actions' }
];

const isOpen = ref(false);
const idSkill = ref('');
const nameSkill = ref('');
const selectedCategorie = ref('');
const categories = ref([]);

function openModal(row: SkillType | null = null) {
  if (row) {
    // Editing existing skill
    idSkill.value = row._id;
    nameSkill.value = row.title;
    selectedCategorie.value = row.categories ? row.categories._id : '';
  } else {
    idSkill.value = '';
    nameSkill.value = '';
    selectedCategorie.value = '';
  }

  categories.value = categorieStore.listCategories.map((categorie) => {
    return { label: categorie.title, value: categorie._id };
  });
  isOpen.value = true;
}

function submitForm() {
  if (nameSkill.value === '') {
    alert('Le nom de la compétence est obligatoire');
    return;
  }

  const skill = ref({} as SkillType)

  if (idSkill.value){
     skill.value = <SkillType>{
      _id: idSkill ? idSkill.value : null,
      title: nameSkill.value,
      categories: selectedCategorie.value
    };
  }
  else {
    skill.value = <SkillType>{
      title: nameSkill.value,
      categories: selectedCategorie.value
    };
  }

  if (idSkill.value) {
    skillStore.updateSkill( skill.value)
        .then(() => {
          skillStore.getAllSkill();
          isOpen.value = false;
        })
        .catch((error) => {
          console.error('Erreur lors de la modification de la compétence:', error);
          alert('Erreur lors de la modification de la compétence');
        });
  } else {
    skillStore.createSkill( skill.value)
        .then(() => {
          skillStore.getAllSkill();
          isOpen.value = false;
        })
        .catch((error) => {
          console.error('Erreur lors de la création de la compétence:', error);
          alert('Erreur lors de la création de la compétence');
        });
  }
}

function deleteSkill(row: SkillType) {
  const confirmDelete = confirm(`Voulez-vous vraiment supprimer la compétence "${row.title}" ?`);
  if (confirmDelete) {
    skillStore.deleteSkill(row._id)
        .then(() => {
          const toast = useToast()

          toast.add({
            id: 'delete_files',
            title: 'Suppression de la compétence',
            description: 'La compétence supprimé avec succès',
            icon: 'i-octicon-desktop-download-24',
            timeout: 3000
          })

          skillStore.getAllSkill();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de la compétence:', error);
          alert('Erreur lors de la suppression de la compétence');
        });
  }
}
</script>

<template>
  <div class="my-5">
    <UTooltip text="Création Compétence" :popper="{ placement: 'top' }">
      <UButton @click="openModal(null)" class="bg-primary text-white" icon="i-heroicons-document-plus" size="sm" variant="solid" label="Compétences" :trailing="false" />
    </UTooltip>
  </div>
  <UTable :columns="columns" :rows="skillStore.listSkills" :loading="skillStore.loading">
    <template #actions-data="{ row }">
      <div class="flex items-center space-x-2">
        <UButton @click="openModal(row)" icon="i-heroicons-pencil-square" class="bg-primary" />
        <UButton @click="deleteSkill(row)" icon="i-heroicons-trash-16-solid" class="bg-red-700 hover:bg-red-700/80" />
      </div>
    </template>
  </UTable>

  <UModal v-model="isOpen">
    <form @submit.prevent="submitForm">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white ">
              {{ idSkill ? 'Modification Compétence' : 'Création Compétence' }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div class="flex flex-col justify-center gap-6 px-8 ">
          <UFormGroup label="Compétence" name="nom">
            <UInput type="text" v-model="nameSkill" required />
          </UFormGroup>
          <UFormGroup label="Catégories" name="categorie">
            <USelect class="w-64" placeholder="Catégorie" v-model="selectedCategorie" :options="categories" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex gap-3 py-4 justify-center">
            <UButton @click="isOpen = false" class="bg-red-500">
              Annuler
            </UButton>
            <UButton type="submit" :loading="skillStore.loading">
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
