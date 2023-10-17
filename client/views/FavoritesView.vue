<script setup lang="ts">
import FavoriteListComponent from "../components/Favorite/FavoriteListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Favorites Page</h1>
    <section>
      <h1 v-if="isLoggedIn">{{ currentUsername }}'s Favorites</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <FavoriteListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
