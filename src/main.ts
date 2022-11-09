import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import "./style.css";

createApp(App)
  .use(router)
  .use(
    createAuth0({
      domain: "dev-mrtdtl5v5f22pdok.us.auth0.com",
      client_id: "nFkLbBUmWbmeZUK3m0NPnz7K4USg5asH",
      redirect_uri: window.location.origin,
      audience: "https://reminders-api",
    })
  )
  .mount("#app");
