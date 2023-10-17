<script setup lang="ts">
import { ref } from "vue";
import { BodyT, fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const photoURL = ref(props.post.photoURL);
const zipCode = ref(props.post.zipCode);
const address = ref(props.post.options != null ? props.post.options.address : "");
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (photoURL: string, zipCode: string, address: string) => {
  let options: BodyT;
  if (address.length > 0) {
    options = { address };
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
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
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
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
