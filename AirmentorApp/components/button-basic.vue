<script setup lang="ts">

const props = defineProps(
    {
        label: {
          type: String,
          required : true
        }
    }
)

</script>

<template>
  <UButton class="bg-gray-100 text-primary rounded-xl hover:text-white xl:text-sm text-xs" variant="solid">{{label }}</UButton>
</template>

<style scoped>

</style>