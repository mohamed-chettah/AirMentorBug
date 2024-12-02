<template>
  <div>
    <div class="mt-2 relative">
      <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <div class="flex flex-wrap p-2">
          <div v-for="item in selectedItems" :key="item._id" class="flex items-center m-1 px-2 py-1 bg-gray-200 rounded-full text-sm">
            {{ item.title }}
            <button @click="removeItem(item)" class="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none">
              &times;
            </button>
          </div>
<!--          empecher d'ecrire-->
          <input
              type="text"
              class="flex-grow p-2 outline-none"
              v-model="search"
              @focus="showDropdown = true"
              @blur="hideDropdown"
              @input="filterOptions"
              placeholder="Select skills"
          />
        </div>
      </div>
      <transition name="fade">
        <div v-if="showDropdown && filteredOptions.length" class="absolute mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm">
          <ul tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3">
            <li
                v-for="option in filteredOptions"
                :key="option._id"
                @mousedown.prevent="toggleSelect(option)"
                class="cursor-pointer select-none relative py-2 pl-3 pr-9"
            >
              <span class="block truncate">{{ option.title }}</span>
              <span v-if="selectedItems.includes(option)" class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Option {
  _id: number;
  title: string;
}

interface Props {
  selectedItems: Option[];
  options: Option[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:selectedItems']);

const search = ref('');
const showDropdown = ref(false);
const selectedItems = ref<Option[]>(props.selectedItems);
const filteredOptions = computed(() => {
  if (!search.value) {
    return props.options;
  }
  return props.options.filter(option => option.title.toLowerCase().includes(search.value.toLowerCase()));
});

const toggleSelect = (option: Option) => {
  const index = selectedItems.value.findIndex(item => item._id === option._id);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(option);
  }
  emit('update:selectedItems', selectedItems.value);
};

const removeItem = (option: Option) => {
  const index = selectedItems.value.findIndex(item => item._id === option._id);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
    emit('update:selectedItems', selectedItems.value);
  }
};

const filterOptions = () => {
  // This will trigger the computed property to filter options
};

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200); // Adjust the delay to fit your needs
};

watch(() => props.selectedItems, (newValue) => {
  selectedItems.value = newValue;
});
</script>

<style scoped>

</style>
