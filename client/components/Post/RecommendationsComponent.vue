<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
let editing = ref("");
let recommendedPosts = ref<Array<Record<string, string>>>([]);

async function getRecommendations() {
  let recommended_post_ids;
  const postObjs = [];
  try {
    recommended_post_ids = await fetchy("/api/getRecommendations", "GET");
    for (const post_id of recommended_post_ids) {
      const postResult = await fetchy(`/api/posts/${post_id}`, "GET");
      postObjs.push(postResult);
    }
    recommendedPosts.value = postObjs;
  } catch {
    return;
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getRecommendations();
  loaded.value = true;
});
</script>
<template>
  <div class="row">
    <h2>Recommendations:</h2>
  </div>
  <section class="posts" v-if="loaded && recommendedPosts.length !== 0">
    <article v-for="post in recommendedPosts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getRecommendations" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getRecommendations" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found. Please visit <a href="/map">Map</a> or <a href="/searchArtist">Artist</a> and favorite posts/users to get recommendations!</p>
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

a {
  text-decoration: none;
  color: blue;
}
</style>
