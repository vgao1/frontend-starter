<script setup lang="ts">
const props = defineProps(["post", "refreshPost"]);
const emit = defineEmits(["refreshedPost"]);

if (props.refreshPost.value) {
  emit("refreshedPost");
}
</script>
<template>
  <div class="add-bottom-margin">
    <p v-if="props.post.options != null"><u>Address</u>: {{ props.post.options.address }}</p>
    <p><u>Zip Code</u>: {{ props.post.zipCode }}</p>
  </div>
  <img class="post-image" v-bind:src="props.post.photoURL" />
</template>
<style scoped>
.post-image {
  max-width: 100%;
  max-height: 500px;
  width: auto;
}
</style>
