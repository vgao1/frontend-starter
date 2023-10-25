<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { BodyT, fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const photoURL = ref(props.post.photoURL);
const zipCode = ref(props.post.zipCode);
const address = ref(props.post.options != null ? props.post.options.address : "");
let centerData = ref(Array<number>());
let loading = ref(true);
const emit = defineEmits(["editPost", "refreshPosts"]);

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

const editPost = async (photoURL: string, zipCode: string, address: string) => {
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
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { update: { photoURL: photoURL, zipCode: zipCode, options: options } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(photoURL, zipCode, address)">
    <p class="author">{{ props.post.author }}</p>
    <label for="photoURL">Photo URL:</label>
    <textarea id="photoURL" v-model="photoURL" placeholder="URL to a photo https:// ..." required> </textarea>
    <label for="zipCode">Zip Code:</label>
    <textarea id="zipCode" v-model="zipCode" placeholder="<digit><digit><digit><digit><digit>" required> </textarea>
    <label for="address">Address:</label>
    <textarea id="address" v-model="address" placeholder="... Ave/Blvd/Ln/Dr/Rd/St"> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button brown-btn" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.brown-btn {
  background-color: #886750;
  color: white;
}
</style>
