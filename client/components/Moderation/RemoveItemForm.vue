<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import { ref } from "vue";

const shouldRemove = ref("");
const props = defineProps(["item", "itemType"]);
const emit = defineEmits(["refreshReports"]);

const emptyForm = () => {
  shouldRemove.value = "";
};

const submitReview = async (decision: string) => {
  try {
    await fetchy("/api/submitRemovalVote", "POST", {
      body: { item: props.item, itemType: props.itemType, decision },
    });
  } catch (_) {
    return;
  }
  emit("refreshReports");
  emptyForm();
};
</script>
<template>
  <form @submit.prevent="submitReview(shouldRemove)">
    <div id="select-container">
      <label for="shouldRemove"><b>Remove reported item?</b></label>
      <select name="shouldRemove" id="shouldRemove" v-model="shouldRemove">
        <option value="yes">Remove</option>
        <option value="no">Don't Remove</option>
      </select>
    </div>
    <button type="submit" class="pure-button brown-btn">Submit</button>
  </form>
</template>
<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
}

#select-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
}

select {
  margin-left: 0.5em;
}

.brown-btn {
  background-color: #886750;
  color: white;
}
</style>
