<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { storeToRefs } from "pinia";
import ReportForm from "../Moderation/ReportForm.vue";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["tag"]);
let displayStyleClass = ref("hideForm");
let alreadyReported = ref(false);
let loaded = ref(false);
const emit = defineEmits(["refreshReactions"]);
const similarPostURL = "/tags/" + props.tag._id + "/similarPosts/" + props.tag.content;

const upvoteTag = async () => {
  try {
    await fetchy("/api/reactions/upvote", "POST", {
      body: { reaction: props.tag._id },
    });
  } catch (_) {
    return;
  }
  emit("refreshReactions");
};

function updateReportStyle() {
  if (displayStyleClass.value === "showForm") {
    displayStyleClass.value = "hideForm";
  } else {
    displayStyleClass.value = "showForm";
  }
}

onBeforeMount(async () => {
  loaded.value = true;
});
</script>
<template>
  <div class="row">
    <div class="tag-container">
      <div v-if="props.tag.reacter !== currentUsername">
        <button type="button" class="btn upvote-btn" @click="upvoteTag">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
            <path
              d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"
            ></path>
          </svg>
        </button>
      </div>
      <a :href="similarPostURL">
        <button type="button" class="tag-btn">#{{ props.tag.content }}</button>
      </a>
      <div v-if="props.tag.reacter !== currentUsername">
        <button v-if="displayStyleClass === 'hideForm' && !alreadyReported" type="button" class="report-btn" @click="updateReportStyle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-flag-fill" viewBox="0 0 16 16">
            <path
              d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <div :class="{ 'report-form-container': displayStyleClass === 'showForm' }">
      <button v-if="displayStyleClass === 'showForm'" type="button" class="close-btn" @click="updateReportStyle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-x-square-fill" viewBox="0 0 16 16">
          <path
            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"
          ></path>
        </svg>
      </button>
      <ReportForm :post="props.tag.post" :item="props.tag._id" itemType="reaction" :class="displayStyleClass" @refreshReports="updateReportStyle" />
    </div>
  </div>
</template>
<style scoped>
.tag-container {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  max-width: fit-content;
  float: left;
  margin-bottom: 0.3em;
  border-radius: 5px;
  border: 2px solid black;
}

.upvote-btn,
.tag-btn,
.report-btn {
  cursor: pointer;
  border: none;
  height: 100%;
}

.tag-btn {
  padding: 0.3em;
}
.upvote-btn {
  background-color: black;
}

.report-btn {
  background-color: red;
}

.close-btn {
  background-color: red;
  border: 2px solid red;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.25em;
  float: right;
}

.upvote-btn:hover {
  background-color: gray;
  color: white;
}

.tag-btn:hover {
  background-color: lightgrey;
}

svg {
  display: flex;
  justify-content: center;
  padding: 0.2em;
}

.report-form-container {
  border: 2px solid red;
  border-radius: 5px;
  padding-left: 1.75em;
  padding-bottom: 0.3em;
  margin-left: 0.5em;
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
</style>
