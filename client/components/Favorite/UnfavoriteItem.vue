<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item", "itemType", "favoriteItem"]);
const emit = defineEmits(["refreshFavorites"]);

const unfavorite = async () => {
  try {
    await fetchy(`/api/favorites/${props.favoriteItem}`, "DELETE");
    emit("refreshFavorites");
  } catch {
    return;
  }
};

const buttonColor = props.itemType === "post" ? "#0000ff" : "white";
const textColor = props.itemType === "post" ? "white" : "black";
const buttonText = props.itemType === "post" ? "Unfavorite Post" : "Unfavorite User";
</script>

<template>
  <form @submit.prevent="unfavorite()">
    <button type="submit" class="pure-button unfavorite-btn" :style="{ 'background-color': buttonColor, color: textColor }">{{ buttonText }}</button>
  </form>
</template>

<style scoped>
.unfavorite-btn {
  width: 200px;
}
</style>
