<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { BodyT, fetchy } from "../../utils/fetchy";

const photoURL = ref("");
const zipCode = ref("");
const address = ref("");
let centerData = ref(Array<number>());
let loading = ref(true);
const emit = defineEmits(["refreshPosts"]);

const createPost = async (photoURL: string, zipCode: string, address: string) => {
  let options: BodyT;
  if (address !== "") {
    const center = await getCenter(address, zipCode);
    if (center.length === 2) {
      options = { address, latitude: center[1], longitude: center[0] };
    } else {
      throw new TypeError("Invalid Address not added to post!");
    }
  } else {
    options = null;
  }
  try {
    await fetchy("/api/posts", "POST", {
      body: { photoURL, zipCode, options },
    });
  } catch {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

async function getCenter(address: string, zipCode: string) {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address},${zipCode},United States.json?limit=1&access_token=pk.eyJ1IjoidmdhbyIsImEiOiJjbG8yM2VxYTcxZ3B2MmtwZG51OWphdHVvIn0.FyQStQzF5XW9Ii-w6qiIgA`,
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
const emptyForm = () => {
  photoURL.value = "";
  zipCode.value = "";
  address.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(photoURL, zipCode, address)">
    <label for="photoURL">Photo URL:</label>
    <textarea id="photoURL" v-model="photoURL" placeholder="URL to a photo https:// ..." required> </textarea>
    <label for="zipCode">Zip Code:</label>
    <textarea id="zipCode" v-model="zipCode" placeholder="<digit><digit><digit><digit><digit>" required> </textarea>
    <label for="address">Address:</label>
    <textarea id="address" v-model="address" placeholder="... Ave/Blvd/Ln/Dr/Rd/St"> </textarea>
    <button type="submit" class="pure-button brown-btn">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 1em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#photoURL {
  height: 2em;
}

.brown-btn {
  background-color: #886750;
  color: white;
}
</style>
