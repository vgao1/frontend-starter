<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import PostContent from "../Post/PostContent.vue";
import RemoveItemForm from "./RemoveItemForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const isModerator = ref(false);
const loaded = ref(false);
let reportedPosts = ref<Array<Record<string, string>>>([]);
let reportedReactions = ref<Array<Record<string, string>>>([]);

async function findModerator() {
  const userId = await getUserId();
  try {
    const moderatorObj = await fetchy(`/api/findModerator/${userId}`, "GET");
    if (moderatorObj) {
      isModerator.value = true;
    }
    return moderatorObj;
  } catch {
    return;
  }
}

async function getUserId() {
  return (await fetchy(`/api/users/${currentUsername.value}`, "GET"))._id;
}

async function findReportedItems() {
  reportedPosts.value = [];
  reportedReactions.value = [];
  const reportedPostObjs = [];
  const reportedReactionObjs = [];
  try {
    const reportedObjs = await fetchy("/api/reportedItems", "GET");
    for (const reportedObj of reportedObjs) {
      const userId = await getUserId();
      if (!reportedObj.voted || !reportedObj.voted.includes(userId)) {
        if (reportedObj.itemType === "post") {
          const postObj = await fetchy(`/api/posts/${reportedObj.item}`, "GET");
          reportedPostObjs.push(postObj);
        } else if (reportedObj.itemType === "reaction") {
          const reactionObj = await fetchy(`/api/reactions/reaction/${reportedObj.item}`, "GET");
          reportedReactionObjs.push(reactionObj[0]);
        }
      }
    }
    reportedPosts.value = reportedPostObjs;
    reportedReactions.value = reportedReactionObjs;
  } catch {
    return;
  }
}

function reactionText(reactionType: string, content: string) {
  if (reactionType === "tag") {
    return "#" + content;
  } else {
    return content;
  }
}

onBeforeMount(async () => {
  await findModerator();
  await findReportedItems();
  loaded.value = true;
});
</script>
<template>
  <div class="row" v-if="isModerator">
    <h2>Reported Posts to Review:</h2>
    <p v-if="loaded && reportedPosts.length === 0">No reported posts to review</p>
    <section class="posts" v-else-if="loaded && reportedPosts.length !== 0">
      <article v-for="post in reportedPosts" :key="post._id">
        <PostContent :post="post" :refreshPost="false" @refreshedPost="findReportedItems" />
        <RemoveItemForm :item="post._id" itemType="post" @refreshReports="findReportedItems" />
      </article>
    </section>
  </div>
  <div class="row" v-if="isModerator">
    <h2>Reported Reactions to Review:</h2>
    <p v-if="loaded && reportedReactions.length === 0">No reported reactions to review</p>
    <section class="reactions" v-else-if="loaded && reportedReactions.length !== 0">
      <article v-for="reaction in reportedReactions" :key="reaction._id">
        <p @refreshReactions="findReportedItems">
          <u>Reaction</u>:
          {{ reactionText(reaction.reactionType, reaction.content) }}
        </p>
        <RemoveItemForm :item="reaction._id" itemType="reaction" @refreshReports="findReportedItems" />
      </article>
    </section>
  </div>
</template>
<style scoped>
section {
  float: left;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  width: fit-content;
  border-radius: 1em;
  gap: 0.5em;
  padding: 1em;
  margin-bottom: 1em;
}

.posts,
.reactions {
  max-width: 400px;
}

.row {
  margin: 0 auto;
  max-width: 60em;
  display: flex;
  flex-direction: column;
}
</style>
