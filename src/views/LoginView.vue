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
    const { logout, loginWithRedirect, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    return {
      login: () => {
        loginWithRedirect({
          redirect_uri: "http://localhost:8080/#/my-account",
        });
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
