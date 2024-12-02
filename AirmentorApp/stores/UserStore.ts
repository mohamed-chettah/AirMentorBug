import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import type { UserType } from "~/types/UserType";

export const useUserStore = defineStore("user", () => {
  const loading = ref(false);
  const user = ref<UserType>({
    _id: "",
    name: "",
    email: "",
    phoneNumber: "",
    place: "",
    password: "",
    profile_picture: "",
    grade: 0,
    credits: 0,
    description: "",
    languages: [],
    googleId: "",
    role: "",
  });

  const listUsers = ref<UserType[]>([]);

  const isAuthenticated = ref(false);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/check", {
        method: "GET",
        credentials: "include", // This is important to include cookies
      });

      if (response.ok) {
        const data = await response.json();
        isAuthenticated.value = true;

        const userFetch = await myProfile(data.user.googleId);

        updateUser(userFetch);
        saveUserToLocalStorage(data.user);
      } else {
        isAuthenticated.value = false;
        clearUser();
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      isAuthenticated.value = false;
      clearUser();
    }
  };

  const updateUser = (userData: Partial<UserType>) => {
    user.value = { ...user.value, ...userData };
  };

  const saveUserToLocalStorage = (userData: Partial<UserType>) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    user.value = {
      _id: "",
      name: "",
      email: "",
      phoneNumber: "",
      place: "",
      password: "",
      profile_picture: "",
      grade: 0,
      credits: 0,
      description: "",
      languages: [],
      googleId: "",
      role: "",
    };
    localStorage.removeItem("user");
  };

  const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      updateUser(JSON.parse(storedUser));
    }
  };

  async function logout() {
    await $fetch("http://localhost:3001/auth/logout", {
      method: "GET",
      credentials: "include",
    });
  }

  async function myProfile(userId: string) {
    try {
      loading.value = true;

      const rep = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "GET",
        credentials: "include", // This is important to include cookies
      });

      const user = await rep.json();

      return user;
    } catch (e) {
      console.log(e);
    } finally {
      // setMessage('La réservation a été mise à jour avec succès');
      loading.value = false;
    }
  }

  async function getAllUsers() {
    try {
      loading.value = true;
      listUsers.value = await $fetch("http://localhost:3001/api/users", {
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

  onMounted(async () => {
    loadUserFromLocalStorage();
    await checkAuth();
  });

  async function deleteUser(id: string) {
    try {
      loading.value = true;
      await $fetch("http://localhost:3001/api/users/" + id, {
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
    myProfile,
    user,
    listUsers,
    isAuthenticated,
    checkAuth,
    updateUser,
    deleteUser,
    logout,
    clearUser,
    getAllUsers,
    loading,
  };
});
