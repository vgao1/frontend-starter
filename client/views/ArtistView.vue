<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>
<template>
  <main>
    <section>
      <h1 v-if="!isLoggedIn">Please login!</h1>
      <PostListComponent v-else :searchArtist="$route.params.username" />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
