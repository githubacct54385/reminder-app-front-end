import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { authGuard } from "@auth0/auth0-vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/reminders",
    name: "Reminders",
    component: () => import(/* webpackChunkName: "reminders" */ "../views/RemindersView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/my-account",
    name: "My Account",
    component: () => import(/* webpackChunkName: "myAccount" */ "../views/MyAccountView.vue"),
  },
  {
    path: "/add-reminder",
    name: "Add Reminder",
    component: () => import(/* webpackChunkName: "myAccount" */ "../views/AddReminderView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
