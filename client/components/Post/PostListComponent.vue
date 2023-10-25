<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
const props = defineProps(["searchArtist"]);

async function getPosts() {
  let query: Record<string, string> = props.searchArtist ? { author: props.searchArtist } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch {
    return;
  }
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2 v-if="!props.searchArtist">Posts:</h2>
    <h2 v-else>Posts by {{ props.searchArtist }}:</h2>
  </div>
  <div class="row">
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div>
  <div class="row">
    <section class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </div>
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
  margin: 0 auto;
  max-width: 60em;
}
</style>
