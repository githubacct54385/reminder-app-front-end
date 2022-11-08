<template>
  <div class="home">
    <button v-if="isAuthenticated" @click="doSomethingWithToken">call api</button>
    <button v-if="isAuthenticated" @click="logout">Logout</button>
    <button v-else @click="login">Log in</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { logout, loginWithRedirect, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout();
      },
      user,
      isAuthenticated,
      doSomethingWithToken: async () => {
        const token = await getAccessTokenSilently();
        console.log(token);
        const response = await fetch("http://localhost:3000/reminders?email=alexbarke002@gmail.com", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const data = await response.json();
        console.log(data);
      },
    };
  },
});
</script>
