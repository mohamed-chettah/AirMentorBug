<template>
  <div class="max-w-4xl mx-auto p-4">
    <UCard class="flex flex-col">
      <h3 class="font-bold w-full text-center pb-3">Création d'une annonce 📝</h3>
      <UForm :schema="schema" :state="form" class="space-y-4">
        <UFormGroup label="Titre" name="title">
          <UInput v-model="form.title" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UInput v-model="form.description" />
        </UFormGroup>
        <UFormGroup label="Annonce active" name="is_activate">
          <UCheckbox v-model="form.is_activate" />
        </UFormGroup>
        <UFormGroup label="Skills" name="skills">
          <MultiSelect v-model:selectedItems="form.skills" :options="skillsOptions" />
        </UFormGroup>
        <UButton @click="handleSubmit" type="submit" class="w-fit px-4 rounded-full bg-gray-500 hover:bg-blue-500">
          Create
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  import { AnnouncementSchema, type AnnouncementType } from '@/types/AnnouncementType'; // Assurez-vous que ce chemin est correct
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import MultiSelect from '~/components/multi-select.vue';
  import { useUserStore } from '~/stores/UserStore';

  const userStore = useUserStore();
  const form = ref<Partial<AnnouncementType>>({
    title: '',
    description: '',
    is_activate: true,
    skills: [],
  });

  const schema = AnnouncementSchema; // Associe le schéma Zod à une variable pour UForm
  const router = useRouter();

  const skillsOptions = await fetch('http://localhost:3001/api/skills').then(res => res.json());

  const handleSubmit = async () => {
    form.value.createdBy = userStore.user;
    form.value.picture = userStore.user.profile_picture;
    const result = schema.safeParse(form.value);
    if (!result.success) {
      alert('Validation failed');
      return;
    }

    const url = 'http://localhost:3001/api/announcements';
    const method = 'POST';

    await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    }).then(() => {
      router.push('/mes-annonces');
    });

  };

</script>

<style scoped>
  /* Ajoute des styles personnalisés ici si nécessaire */
</style>
