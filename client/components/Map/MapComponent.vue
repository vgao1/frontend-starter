<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import MapImageComponent from "./MapImageComponent.vue";
import { fetchy } from "../../utils/fetchy";

let loaded = ref(false);
let postsWithDestinations = ref<Array<Record<string, string>>>([]);
async function getDestinations() {
  let postObjs = [];
  try {
    const posts = await fetchy(`/api/posts`, "GET");
    for (const post of posts) {
      if (post.options !== null) {
        postObjs.push(post);
      }
    }
  } catch {
    return;
  }
  postsWithDestinations.value = postObjs;
}

onBeforeMount(async () => {
  await getDestinations();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2>Map</h2>
  </div>
  <div v-if="loaded" ref="mapContainer" class="map-container row">
    <MapImageComponent :postsWithDestinations="postsWithDestinations" />
  </div>
</template>
<style scoped>
h2 {
  text-align: center;
}

form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}

section {
  margin: 0 auto;
  max-width: 60em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.map-container {
  width: 500px;
  height: 500px;
}
</style>
