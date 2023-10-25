<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import UserLink from "@/components/User/UserLink.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import EditPostForm from "../Post/EditPostForm.vue";

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let users = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getFavorites() {
  posts.value = [];
  users.value = [];
  let favoriteResults;
  try {
    favoriteResults = await fetchy("/api/favorites", "GET", {});
  } catch (_) {
    return;
  }
  for (const favorite of favoriteResults) {
    if (favorite.itemType === "post") {
      const postObj = await getFavoritePost(favorite.likedItem);
      posts.value.push(postObj);
    } else if (favorite.itemType === "user") {
      const userObj = await getFavoriteUser(favorite.likedItem);
      users.value.push({ username: userObj, favorite_id: favorite._id });
    }
  }
}

async function getFavoritePost(post_id: string) {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/${post_id}`, "GET");
    return postResults;
  } catch (_) {
    return;
  }
}

async function getFavoriteUser(user_id: string) {
  let userResult;
  try {
    userResult = await fetchy(`/api/users/getUsername/${user_id}`, "GET");
    return userResult;
  } catch (_) {
    return;
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getFavorites();
  loaded.value = true;
});
</script>
<template>
  <section class="favorites" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getFavorites" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getFavorites" @editPost="updateEditing" />
    </article>
  </section>
  <section class="favorites" v-if="loaded && users.length !== 0">
    <article v-for="user in users" :key="user.favorite_id">
      <UserLink :usersName="user.username" :favoriteId="user.favorite_id" @refreshUserLink="getFavorites" />
    </article>
  </section>
</template>
<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.favorites {
  padding: 1em;
  max-width: 400px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
