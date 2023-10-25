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
  } catch (_) {
    return;
  }
  emit("refreshFavorites");
};

const buttonColor = props.itemType === "post" ? "#886750" : "white";
const textColor = props.itemType === "post" ? "white" : "black";
const buttonText = props.itemType === "post" ? "Favorite Post" : "Favorite User";
</script>

<template>
  <form @submit.prevent="favoriteItem()">
    <button type="submit" class="pure-button brown-btn favorite-btn" :style="{ 'background-color': buttonColor, color: textColor }">{{ buttonText }}</button>
  </form>
</template>

<style scoped>
.favorite-btn {
  width: fit-content;
  padding: 0.5em;
  border-radius: 5px;
}
</style>
