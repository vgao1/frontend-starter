<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import ReportForm from "../Moderation/ReportForm.vue";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["comment"]);
let displayStyleClass = ref("hideForm");
let alreadyReported = ref(false);
let loaded = ref(false);
const emit = defineEmits(["refreshReactions"]);

function userURL(username: string) {
  return "/searchArtist/" + username;
}

function updateReportStyle() {
  if (displayStyleClass.value === "showForm") {
    displayStyleClass.value = "hideForm";
  } else {
    displayStyleClass.value = "showForm";
  }
}

const deleteComment = async () => {
  try {
    await fetchy(`/api/reactions/${props.comment._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshReactions");
};

onBeforeMount(async () => {
  loaded.value = true;
});

async function refreshComment() {
  updateReportStyle();
}
</script>
<template v-if="loaded">
  <div v-if="props.comment.reacter === currentUsername" class="row">
    <b>
      <a :href="userURL(props.comment.reacter)">{{ props.comment.reacter }}</a>
    </b>
    : {{ props.comment.content }}
    <button type="button" class="delete-btn" @click="deleteComment">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"></path>
        <path
          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
        ></path>
      </svg>
    </button>
  </div>
  <div v-else class="row">
    <div class="comment-text">
      <b>
        <a :href="userURL(props.comment.reacter)">{{ props.comment.reacter }}</a>
      </b>
      :
      <hr v-if="displayStyleClass === 'showForm'" class="new-line" />
      {{ props.comment.content }}
      <button v-if="displayStyleClass === 'hideForm' && !alreadyReported" type="button" class="report-btn" @click="updateReportStyle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-flag-fill" viewBox="0 0 16 16">
          <path
            d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"
          ></path>
        </svg>
      </button>
    </div>
    <div :class="{ 'report-form-container': displayStyleClass === 'showForm' }">
      <button v-if="displayStyleClass === 'showForm'" type="button" class="close-btn" @click="updateReportStyle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-x-square-fill" viewBox="0 0 16 16">
          <path
            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"
          ></path>
        </svg>
      </button>
      <ReportForm :post="props.comment.post" :item="props.comment._id" itemType="reaction" :class="displayStyleClass" @refreshReports="refreshComment" />
    </div>
  </div>
</template>
<style scoped>
.delete-btn {
  background-color: white;
  border: 2px solid black;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.25em;
}

.report-btn,
.close-btn {
  background-color: red;
  border: 2px solid red;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.25em;
  float: right;
}

.delete-btn:hover {
  background-color: rgba(128, 128, 128, 0.087);
}

svg {
  display: flex;
  justify-content: center;
  padding: 0.2em;
}

.row {
  display: flex;
  margin: 0 auto;
  max-width: 60em;
  align-items: center;
  margin-bottom: 0.3em;
}

a {
  text-decoration: none;
  color: blue;
}

.comment-text {
  display: flex;
  align-items: center;
  flex-flow: wrap;
}

.comment-text hr {
  width: 100%;
  visibility: hidden;
}

.report-form-container {
  border: 2px solid red;
  border-radius: 5px;
  padding-left: 1.75em;
  padding-bottom: 0.3em;
}
</style>
