<script setup lang="ts">
import CommentItem from "@/components/Reaction/CommentItem.vue";
import TagItem from "./TagItem.vue";
import CreateReactionForm from "./CreateReactionForm.vue";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
let comments = ref<Array<Record<string, string>>>([]);
let tags = ref<Array<Record<string, string>>>([]);
const props = defineProps(["post"]);

async function getReactions() {
  let query: Record<string, string> = { post: props.post._id };
  let reactionResults;
  let commentObjs: Array<Record<string, string>> = [];
  let tagObjs: Array<Record<string, string>> = [];
  try {
    reactionResults = await fetchy("/api/reactions", "GET", { query });
    for (const result of reactionResults) {
      if (result.reactionType === "comment") {
        commentObjs.push(result);
      } else {
        tagObjs.push(result);
      }
    }
    comments.value = commentObjs;
    tags.value = tagObjs;
  } catch {
    return;
  }
}

onBeforeMount(async () => {
  await getReactions();
  loaded.value = true;
});
</script>
<template>
  <section class="tags" v-if="loaded && tags.length !== 0">
    <hr />
    <b>Tags</b>
    <article v-for="tag in tags" :key="tag._id">
      <TagItem :tag="tag" @refreshReactions="getReactions" />
    </article>
  </section>
  <section class="comments" v-if="loaded && comments.length !== 0">
    <hr />
    <b>Comments</b>
    <article v-for="comment in comments" :key="comment._id">
      <CommentItem :comment="comment" @refreshReactions="getReactions" />
    </article>
  </section>
  <hr />
  <CreateReactionForm :post="post" @refreshReactions="getReactions" />
</template>
<style scoped>
.comments,
.tags {
  padding-top: 0.5em;
}

hr {
  width: 100%;
}
</style>
