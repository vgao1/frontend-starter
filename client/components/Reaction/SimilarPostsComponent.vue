<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const props = defineProps(["tagID", "tagContent"]);
let editing = ref("");
let similarPosts = ref<Array<Record<string, string>>>([]);

async function getSimilarPosts() {
  let query: Record<string, string> = { reaction: props.tagID };
  let similar_post_ids;
  const postObjs = [];
  try {
    similar_post_ids = await fetchy("/api/reactions/similarPosts", "GET", { query });
    for (const post_id of similar_post_ids) {
      const postResult = await fetchy(`/api/posts/${post_id}`, "GET");
      postObjs.push(postResult);
    }
    similarPosts.value = postObjs;
  } catch {
    return;
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getSimilarPosts();
  loaded.value = true;
});
</script>
<template>
  <div class="row">
    <h2 v-if="!props.tagID">Posts:</h2>
    <h2 v-else>Similar Posts for #{{ props.tagContent }}:</h2>
  </div>
  <section class="posts" v-if="loaded && similarPosts.length !== 0">
    <article v-for="post in similarPosts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getSimilarPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getSimilarPosts" @editPost="updateEditing" />
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
