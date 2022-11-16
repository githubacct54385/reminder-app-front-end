<template>
  <div class="home">
    <HelloWorld />
    <button class="rounded text-white bg-blue-600 p-3 mt-3" v-if="!isAuthenticated" @click="login">Log in</button>
    <button class="rounded text-white bg-blue-600 p-3 mt-3" v-if="isAuthenticated" @click="logoutAction">
      Log out
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  name: "HomeView",
  components: {
    HelloWorld,
  },
  setup() {
    const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      logoutAction: () => {
        logout();
      },
      user,
      isAuthenticated,
    };
  },
});
</script>
