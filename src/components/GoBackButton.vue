<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6 mb-4 hover:text-slate-400 cursor-pointer"
    @click="action"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
</template>

<script setup lang="ts">
import router from "@/router";
import { defineProps } from "vue";
const props = defineProps({
  route: String,
});

const action = () => {
  if (!props?.route) {
    throw new Error("prop route cannot be empty");
  }
  router.push(props.route);
};
</script>
