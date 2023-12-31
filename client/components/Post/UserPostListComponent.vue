<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { fetchy } from "../../utils/fetchy";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";

const props = defineProps(["usersName"]);
const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getPosts(author: string) {
  let query: Record<string, string> = { author };
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts(props.usersName);
  loaded.value = true;
});
</script>
<template>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
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

.posts {
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
