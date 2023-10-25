<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const content = ref("");
const reactionType = ref("");
const props = defineProps(["post"]);
const emit = defineEmits(["refreshReactions"]);

const createReaction = async (content: string, reactionType: string) => {
  try {
    await fetchy("/api/reactions", "POST", {
      body: { post: props.post._id, content, reactionType },
    });
  } catch (_) {
    return;
  }
  emit("refreshReactions");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
  reactionType.value = "";
};

const placeholderText = () => {
  if (reactionType.value === "tag") {
    return "#";
  } else if (reactionType.value === "comment") {
    return "";
  }
};
</script>
<template>
  <form @submit.prevent="createReaction(content, reactionType)">
    <div id="select-container">
      <label for="reactionType"><b>New</b></label>
      <select name="reactionType" id="reactionType" v-model="reactionType">
        <option value="comment">Comment</option>
        <option value="tag">Tag</option>
      </select>
    </div>
    <label for="content">Content:</label>
    <textarea id="content" v-model="content" :placeholder="placeholderText()" required> </textarea>
    <button type="submit" class="pure-button brown-btn">Submit Reaction</button>
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

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 1em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#content {
  margin-bottom: 0.5em;
}

.brown-btn {
  background-color: #886750;
  color: white;
}
</style>
