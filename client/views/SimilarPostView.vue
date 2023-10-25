<script setup lang="ts">
import SimilarPostsComponent from "../components/Reaction/SimilarPostsComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="!isLoggedIn">Please login!</h1>
    </section>
    <SimilarPostsComponent v-if="isLoggedIn" :tagID="$route.params.tagID" :tagContent="$route.params.tagContent" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
