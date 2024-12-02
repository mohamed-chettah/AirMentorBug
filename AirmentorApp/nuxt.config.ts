// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,
  ssr: false,
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {
        exposeConfig: true,
      },
      autoprefixer: {},
    },
  },
  modules: ["@nuxt/image", "@nuxt/ui", "@pinia/nuxt", "@nuxtjs/color-mode"],
  ui: {
    global: true,
    icons: ["heroicons", "mdi"],
  },
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  compatibilityDate: "2024-07-08",
  app: {
    head: {
      script: [
        {
          src: "https://unpkg.com/@daily-co/daily-js",
          crossorigin: "anonymous",
        },
      ],
    },
  }
});
