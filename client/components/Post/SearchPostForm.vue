<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
function artistURL(username: string) {
  return "/searchArtist/" + username;
}
</script>

<template>
  <form :action="artistURL(author)" class="pure-form">
    <fieldset>
      <legend>Search by Artist</legend>
      <input id="author" type="text" v-model="author" placeholder="Username" />
      <button type="submit" class="pure-button brown-btn">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
  margin: 0 auto;
}

.brown-btn {
  background-color: #886750;
  color: white;
}
</style>
