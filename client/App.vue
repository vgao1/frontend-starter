<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/logo.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Via Carto</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> <button>Home</button></RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <a href="/map" :class="{ underline: currentRouteName == 'Map' }"><button>Map</button></a>
        </li>
        <li v-if="isLoggedIn">
          <a href="/searchArtist" :class="{ underline: currentRouteName == 'Artist' }"><button>Artist</button></a>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Create Post' }" :class="{ underline: currentRouteName == 'Create Post' }"><button>Create Post</button></RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Favorites' }" :class="{ underline: currentRouteName == 'Favorites' }"><button>Favorites</button></RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"><button>Settings</button></RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"><button>Login</button></RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding-left: 1em;
  background-color: lightgray;
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  text-decoration: none;
  color: black;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-block-start: 0px;
  margin-block-end: 0px;
}

.underline {
  text-decoration: underline;
}

button {
  border: none;
  background-color: lightgray;
  cursor: pointer;
  padding: 1em;
}

button:hover {
  color: white;
  background-color: #886750;
}
</style>
