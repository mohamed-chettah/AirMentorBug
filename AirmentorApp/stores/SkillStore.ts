import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import type { UserType } from "~/types/UserType";
import type {CategorieType} from "~/types/CategorieType";
import type {SkillType} from "~/types/SkillType";

export const useSkillStore = defineStore("skill", () => {
    const loading = ref(false);
    const listSkills = ref<SkillType[]>([]);
    const skill = ref<SkillType>({
        title: "",
        categories: "",
        _id: "",
    });

    async function getAllSkill() {
        try {
            loading.value = true;
            listSkills.value = await $fetch("http://localhost:3001/api/skills", {
                method: "GET",
                credentials: "include", // This is important to include cookies
            });
        } catch (e) {
            console.log(e);
        } finally {
            // setMessage('La réservation a été mise à jour avec succès');
            loading.value = false;
        }
    }


    async function updateSkill(skill: SkillType) {
        try {
            loading.value = true;
            await $fetch("http://localhost:3001/api/skills/" + skill._id, {
                method: "PUT",
                credentials: "include", // This is important to include cookies
                body: JSON.stringify(skill),
            });
        } catch (e) {
            console.log(e);
        }
        finally {
            const toast = useToast()

            toast.add({
                id: 'delete_files',
                title: 'Mise à jour de la compétence',
                description: 'La compétence a été mise à jour avec succès',
                icon: 'i-octicon-desktop-download-24',
                timeout: 3000
            })

            loading.value = false;
        }
    }

    async function createSkill(skill: SkillType) {
        try {
            loading.value = true;
            await $fetch("http://localhost:3001/api/skills", {
                method: "POST",
                credentials: "include", // This is important to include cookies
                body: JSON.stringify(skill),
            });
        } catch (e) {
            console.log(e);
        } finally {
            const toast = useToast()

            toast.add({
                id: 'delete_files',
                title: 'Création de la compétence',
                description: 'La compétence a été créé avec succès',
                icon: 'i-octicon-desktop-download-24',
                timeout: 3000
            })

            loading.value = false;
        }
    }

    async function deleteSkill(id: string) {
        try {
            loading.value = true;
            await $fetch("http://localhost:3001/api/skills/" + id, {
                method: "DELETE",
                credentials: "include", // This is important to include cookies
            });
        } catch (e) {
            console.log(e);
        } finally {
            loading.value = false;
        }
    }

    return {
        getAllSkill,
        createSkill,
        deleteSkill,
        updateSkill,
        listSkills,
        loading,
    };
})
