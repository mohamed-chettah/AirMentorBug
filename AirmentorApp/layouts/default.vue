<script setup lang="ts">
import Header from "~/components/header.vue";
</script>

<template>


  <Header class="pt-1"/>

  <div class="mt-2">
    <slot />

    <Footer />
  </div>

</template>
