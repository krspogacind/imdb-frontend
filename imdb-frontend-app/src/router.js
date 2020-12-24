import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Registration from "./components/Registration.vue";
import Login from "./components/Login.vue";

const history = createWebHistory();
const router = createRouter({
  history,
  routes: [
    { path: "/", component: Home },
    {
      path: "/registration",
      component: Registration,
      meta: { requiresGuest: true },
    },
    {
      path: "/login",
      component: Login,
      meta: { requiresGuest: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (localStorage.getItem("token") !== null) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
