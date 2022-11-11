<template>
  <div class="home">
    <button class="rounded text-white bg-blue-600 p-3" @click="login">Log in</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { logout, loginWithRedirect, user, isAuthenticated } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout();
      },
      user,
      isAuthenticated,
    };
  },
});
</script>
