<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let favorites = ref<Array<Record<string, string>>>([]);

onBeforeMount(async () => {
  await getFavorites();
  loaded.value = true;
});

async function getFavorites() {
  let favoriteResults;
  try {
    favoriteResults = await fetchy("/api/favorites", "GET", {});
  } catch (_) {
    return;
  }
  favorites.value = favoriteResults;
  console.log(favoriteResults);
}
</script>
<template>
  <section class="favorites" v-if="isLoggedIn && loaded && favorites.length !== 0">
    <ul v-for="favorite in favorites" :key="favorite._id">
      <li v-if="favorite.itemType === 'post'">Post: {{ favorite.likedItem }}</li>
      <li v-if="favorite.itemType === 'user'">User: {{ favorite.likedItem }}</li>
    </ul>
  </section>
</template>
