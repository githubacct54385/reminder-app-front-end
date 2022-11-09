<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link v-if="isAuthenticated" to="/reminders">Reminders</router-link>
    <button class="font-bold" v-if="isAuthenticated" @click="logoutAction">Logout</button>
    <router-link v-else to="/login">Login</router-link>
    <router-link to="/my-account">My Account</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a {
  padding: 0 5px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { isAuthenticated, logout } = useAuth0();

    return {
      isAuthenticated,
      logoutAction: () => logout(),
    };
  },
});
</script>
