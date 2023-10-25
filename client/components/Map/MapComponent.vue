<script setup lang="ts">
import axios from "axios";
import { onBeforeMount, ref } from "vue";
import MapImageComponent from "./MapImageComponent.vue";

const props = defineProps(["zipCode"]);
let centerData = ref(Array<number>());
let loading = ref(true);
let loaded = ref(false);

async function getCenter() {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${props.zipCode},United States.json?limit=1&access_token=pk.eyJ1IjoidmdhbyIsImEiOiJjbG8yM2VxYTcxZ3B2MmtwZG51OWphdHVvIn0.FyQStQzF5XW9Ii-w6qiIgA`,
    );
    loading.value = false;
    centerData.value = response.data.features[0].center;
    return centerData.value;
  } catch (err) {
    loading.value = false;
    centerData.value = [];
    return [];
  }
}

onBeforeMount(async () => {
  await getCenter();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2>Map</h2>
  </div>
  <div v-if="loaded" ref="mapContainer" class="map-container row">
    <MapImageComponent />
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
