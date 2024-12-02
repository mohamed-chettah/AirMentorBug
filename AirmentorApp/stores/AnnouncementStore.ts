import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import type { UserType } from "~/types/UserType";
import type {CategorieType} from "~/types/CategorieType";
import type {SkillType} from "~/types/SkillType";
import type {AnnouncementType} from "~/types/AnnouncementType";

export const useAnnouncementStore = defineStore("announcement", () => {
    const loading = ref(false);
    const listAnnouncements = ref<AnnouncementType[]>([]);
    const announcement = ref<AnnouncementType[]>([]);

    async function getAllAnnouncement() {
        try {
            loading.value = true;
            listAnnouncements.value = await $fetch("http://localhost:3001/api/announcements", {
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

    async function getAnnouncementById(id : string) {
        try {
            loading.value = true;
            announcement.value = await $fetch("http://localhost:3001/api/announcements/" + id, {
                method: "GET",
                credentials: "include", // This is important to include cookies
            })
        } catch (e) {
            console.log(e);
        } finally {
            // setMessage('La réservation a été mise à jour avec succès');
            loading.value = false;
        }
    }

    async function getAllAnnouncementByCateg(idCateg : string) {
        try {
            loading.value = true;
            listAnnouncements.value = await $fetch("http://localhost:3001/api/announcements/category/" + idCateg , {
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

    async function searchAnnouncementBySkill(idSkill : string){
        try {
            loading.value = true;
            listAnnouncements.value = await $fetch("http://localhost:3001/api/announcements/skills/" + idSkill , {
                method: "GET",
                credentials: "include", // This is important to include cookies
            });

        } catch (e) {
            console.log(e);
        } finally {
            loading.value = false;
        }
    }

    async function searchAnnouncementByTitle(title : string){
        try {
            loading.value = true;
            return await $fetch("http://localhost:3001/api/announcements/search/" + title , {
                method: "GET",
                credentials: "include", // This is important to include cookies
            });

        } catch (e) {
            console.log(e);
        } finally {
            loading.value = false;
        }
    }

    return {
        getAllAnnouncement,
        getAllAnnouncementByCateg,
        searchAnnouncementBySkill,
        searchAnnouncementByTitle,
        getAnnouncementById,
        listAnnouncements,
        announcement,
        loading,
    };
})
