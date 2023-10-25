import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingView from "../views/SettingView.vue";
import FavoritesView from "../views/FavoritesView.vue";
import CreatePostView from "../views/CreatePostView.vue";
import ArtistView from "../views/ArtistView.vue";
import SimilarPostView from "../views/SimilarPostView.vue";
import MapView from "../views/MapView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/map",
      name: "Map",
      component: MapView,
      meta: { requiresAuth: true },
    },
    {
      path: "/searchArtist/:username?",
      name: "Artist",
      component: ArtistView,
      meta: { requiresAuth: true },
    },
    {
      path: "/createPost",
      name: "Create Post",
      component: CreatePostView,
      meta: { requiresAuth: true },
    },
    {
      path: "/favorite",
      name: "Favorites",
      component: FavoritesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/tags/:tagID/similarPosts/:tagContent",
      name: "Similar Post",
      component: SimilarPostView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
