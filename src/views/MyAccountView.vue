<template>
  <h1>Welcome {{ name }}</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { user } = useAuth0();
    const name = user.value.name;

    return {
      name,
    };
  },
});
</script>
