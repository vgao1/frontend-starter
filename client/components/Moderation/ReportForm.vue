<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const reportReason = ref("");
const props = defineProps(["post", "item", "itemType", "class"]);
const emit = defineEmits(["refreshReports"]);

const createReport = async (reason: string) => {
  try {
    await fetchy("/api/report", "POST", {
      body: { post: props.post, item: props.item, itemType: props.itemType, reason },
    });
  } catch (_) {
    emit("refreshReports");
    emptyForm();
    return;
  }
  emit("refreshReports");
  emptyForm();
};

const emptyForm = () => {
  reportReason.value = "";
};
</script>
<template>
  <form @submit.prevent="createReport(reportReason)" :class="props.class">
    <label for="reportReason">Why are you reporting this {{ props.itemType }}?</label>
    <textarea id="reportReason" v-model="reportReason" placeholder="Because ... " required> </textarea>
    <button type="submit" class="pure-button brown-btn">Submit Report</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

.hideForm {
  display: none;
}

.showForm {
  display: flex;
}

.brown-btn {
  background-color: #886750;
  color: white;
}
</style>
