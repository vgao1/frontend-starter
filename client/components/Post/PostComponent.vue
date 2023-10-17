<script setup lang="ts">
import FavoriteItem from "@/components/Favorite/FavoriteItem.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import UnfavoriteItem from "../Favorite/UnfavoriteItem.vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts", "favorite", "unfavorite"]);
const { currentUsername } = storeToRefs(useUserStore());
let favoritePostId = ref("");
let favoriteUserId = ref("");

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

async function getFavoritePost() {
  let query: Record<string, string> = { item: props.post._id };
  let favoriteResults;
  try {
    favoriteResults = await fetchy(`/api/favorites/findFavoritePost`, "GET", { query });
    favoritePostId.value = favoriteResults._id;
  } catch {
    favoritePostId.value = "";
    return;
  }
}

async function getFavoriteUser() {
  try {
    let query: Record<string, string> = { otherUser: props.post.author };
    const favoriteResults = await fetchy(`/api/favorites/findFavoriteArtist`, "GET", { query });
    favoriteUserId.value = favoriteResults._id;
  } catch {
    favoriteUserId.value = "";
    return;
  }
}

onBeforeMount(async () => {
  await getFavoritePost();
  await getFavoriteUser();
});
</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <section v-if="props.post.author !== currentUsername && isLoggedIn">
    <UnfavoriteItem v-if="favoriteUserId.length > 0" itemType="user" :item="props.post.author" :favoriteItem="favoriteUserId" @click="emit('unfavorite')" @refreshFavorites="getFavoriteUser" />
    <FavoriteItem v-else itemType="user" :item="props.post.author" @click="emit('favorite')" @refreshFavorites="getFavoriteUser" />
  </section>
  <p><u>Zip Code</u>: {{ props.post.zipCode }}</p>
  <p v-if="props.post.options != null"><u>Address</u>: {{ props.post.options.address }}</p>
  <img class="post-image" v-bind:src="props.post.photoURL" />
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <section v-if="isLoggedIn">
      <UnfavoriteItem v-if="favoritePostId.length > 0" itemType="post" :item="post._id" :favoriteItem="favoritePostId" @click="emit('unfavorite')" @refreshFavorites="getFavoritePost" />
      <FavoriteItem v-else itemType="post" :item="post._id" @click="emit('favorite')" @refreshFavorites="getFavoritePost" />
    </section>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
