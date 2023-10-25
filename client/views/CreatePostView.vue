<script setup lang="ts">
import CreatePostForm from "../components/Post/CreatePostForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Create a Post:</h1>
      <h1 v-else>Please login!</h1>
      <CreatePostForm v-if="isLoggedIn" />
    </section>
  </main>
</template>
<style scoped>
section {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 60em;
}
</style>
