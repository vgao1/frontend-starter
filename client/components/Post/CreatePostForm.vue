<script setup lang="ts">
import { ref } from "vue";
import { BodyT, fetchy } from "../../utils/fetchy";

const photoURL = ref("");
const zipCode = ref("");
const address = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (photoURL: string, zipCode: string, address: string) => {
  let options: BodyT;
  if (address !== "") {
    options = { address };
  } else {
    options = null;
  }
  try {
    await fetchy("/api/posts", "POST", {
      body: { photoURL, zipCode, options },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

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
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
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
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
