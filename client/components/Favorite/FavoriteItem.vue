<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item", "itemType"]);
const emit = defineEmits(["refreshFavorites"]);
let itemId = ref("");

const favoriteItem = async () => {
  try {
    if (props.itemType === "user") {
      itemId.value = (await fetchy(`/api/users/${props.item}`, "GET"))._id;
    } else {
      itemId.value = props.item;
    }
    await fetchy(`/api/favorites`, "POST", {
      body: { item: itemId.value, itemType: props.itemType },
    });
    emit("refreshFavorites");
  } catch (_) {
    return;
  }
};

const buttonColor = props.itemType === "post" ? "#0000ff" : "white";
const textColor = props.itemType === "post" ? "white" : "black";
const buttonText = props.itemType === "post" ? "Favorite Post" : "Favorite User";
</script>

<template>
  <form @submit.prevent="favoriteItem()">
    <button type="submit" class="pure-button favorite-btn" :style="{ 'background-color': buttonColor, color: textColor }">{{ buttonText }}</button>
  </form>
</template>

<style scoped>
.favorite-btn {
  width: 200px;
}
</style>
