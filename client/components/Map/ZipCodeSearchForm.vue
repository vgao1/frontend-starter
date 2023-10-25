<script setup lang="ts">
import { ref } from "vue";

const zipCode = ref("");
function zipCodeURL(zipCode: string) {
  return "/map/" + zipCode;
}
</script>
<template>
  <form :action="zipCodeURL(zipCode)" class="pure-form">
    <fieldset>
      <legend>Search by Zip Code</legend>
      <input id="zipCode" type="text" v-model="zipCode" placeholder="12345" />
      <button type="submit" class="pure-button brown-btn">Search</button>
    </fieldset>
  </form>
</template>
<style scoped>
.brown-btn {
  background-color: #886750;
  color: white;
}
</style>
