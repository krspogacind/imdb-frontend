import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Registration from "./components/Registration.vue";
import Login from "./components/Login.vue";
import MovieList from "./components/MovieList.vue";
import MovieListItemPage from "./components/MovieListItemPage.vue";

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
    {
      path: "/movies",
      component: MovieList,
    },
    {
      path: "/movies/:id",
      component: MovieListItemPage,
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
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("token") === null) {
      next("/login")
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
