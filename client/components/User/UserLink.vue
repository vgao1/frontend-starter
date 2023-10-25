<script setup lang="ts">
import UnfavoriteItem from "@/components/Favorite/UnfavoriteItem.vue";

const props = defineProps(["usersName", "favoriteId"]);
const userURL = "/searchArtist/" + props.usersName;
const emit = defineEmits(["refreshUserLink"]);

function updateFavoriteUsers() {
  emit("refreshUserLink");
}
</script>
<template>
  <section>
    <a v-bind:href="userURL" class="author"> {{ props.usersName }}</a>
    <UnfavoriteItem itemType="user" :item="props.usersName" :favoriteItem="props.favoriteId" @refreshFavorites="updateFavoriteUsers" />
  </section>
</template>

<style scoped>
.author {
  text-align: center;
  font-weight: bold;
  font-size: 1.2em;
  text-decoration: none;
  color: blue;
}
</style>
