<script setup lang="ts">
import FavoriteItem from "@/components/Favorite/FavoriteItem.vue";
import UnfavoriteItem from "@/components/Favorite/UnfavoriteItem.vue";
import ReportForm from "@/components/Moderation/ReportForm.vue";
import ReactionsListComponent from "../Reaction/ReactionsListComponent.vue";
import PostContent from "./PostContent.vue";

import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const userURL = "/searchArtist/" + props.post.author;
const alreadyReported = ref(false);
let favoritePostId = ref("");
let favoriteUserId = ref("");
let displayStyleClass = ref("hideForm");
let refreshPost = ref(false);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  refreshPost.value = true;
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

async function updateFavoritePosts() {
  await getFavoritePost();
  refreshPost.value = true;
  emit("refreshPosts");
}

async function updateFavoriteUsers() {
  await getFavoriteUser();
  refreshPost.value = true;
  emit("refreshPosts");
}

function updateReportStyle() {
  if (displayStyleClass.value === "showForm") {
    displayStyleClass.value = "hideForm";
  } else {
    displayStyleClass.value = "showForm";
  }
}

onBeforeMount(async () => {
  await getFavoritePost();
  await getFavoriteUser();
});
</script>

<template>
  <div>
    <PostContent :post="post" :refreshPost="refreshPost" />
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
  <div>
    <div id="report-left">
      <section v-if="isLoggedIn">
        <UnfavoriteItem v-if="favoritePostId.length > 0" itemType="post" :item="post._id" :favoriteItem="favoritePostId" @refreshFavorites="updateFavoritePosts" />
        <FavoriteItem v-else itemType="post" :item="post._id" @refreshFavorites="updateFavoritePosts" />
      </section>
    </div>
    <div id="report" v-if="props.post.author !== currentUsername && !alreadyReported">
      <button v-if="displayStyleClass === 'hideForm'" type="button" class="report-btn" @click="updateReportStyle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-flag-fill" viewBox="0 0 16 16">
          <path
            d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"
          ></path>
        </svg>
      </button>
    </div>
  </div>
  <div v-if="props.post.author !== currentUsername" :class="{ 'report-form-container': displayStyleClass === 'showForm' }">
    <button v-if="displayStyleClass === 'showForm'" type="button" class="close-btn" @click="updateReportStyle">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-x-square-fill" viewBox="0 0 16 16">
        <path
          d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"
        ></path>
      </svg>
    </button>
    <ReportForm :post="props.post._id" :item="props.post._id" itemType="post" :class="displayStyleClass" @refreshReports="updateReportStyle" />
  </div>
  <ReactionsListComponent :post="props.post" />
  <div class="base">
    <p class="author">
      <a v-bind:href="userURL">{{ props.post.author }}</a>
    </p>
    <section v-if="props.post.author !== currentUsername && isLoggedIn">
      <FavoriteItem v-if="favoriteUserId.length == 0" itemType="user" :item="props.post.author" @refreshFavorites="updateFavoriteUsers" />
    </section>
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 1em;
}

.author a {
  text-decoration: none;
  color: blue;
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
  flex-basis: 100%;
  display: flex;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.report-btn,
.close-btn {
  background-color: red;
  border: 2px solid red;
  border-radius: 5px;
  cursor: pointer;
  float: right;
  width: fit-content;
}

.add-bottom-margin {
  margin-bottom: 1em;
}

#report-left {
  float: left;
  width: 95%;
}

#report {
  float: left;
  width: 5%;
}

svg {
  display: flex;
  justify-content: center;
  padding: 0.4em;
}

.close-btn svg {
  padding: 0.3em;
}

.report-form-container {
  border: 2px solid red;
  border-radius: 5px;
  padding-left: 1.75em;
  padding-bottom: 0.3em;
}
</style>
