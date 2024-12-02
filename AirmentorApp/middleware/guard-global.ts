export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;
  if (to.meta.requiresAuth) {
    const token = useCookie("auth_token");
    let role = "";

    // If the route requires authentication
    if (to.path.startsWith("/admin")) {
      // Check if the user is authenticated
      if (!token) {
        console.log("no token provided");
        return navigateTo("/");
      }

      try {
        const response = await fetch("http://localhost:3001/auth/check", {
          method: "GET",
          credentials: "include", // This is important to include cookies
        });

        if (response.ok) {
          const rep = await response.json();
          role = rep.user.role;
        } else {
          return navigateTo("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        return navigateTo("/");
      }

      // Check if the user has the admin role
      if (!role || role !== "ADMIN") {
        return navigateTo("/");
      }
    }
  }
});
