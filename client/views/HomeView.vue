<script setup lang="ts">
import RecommendationsComponent from "../components/Post/RecommendationsComponent.vue";
import ReportedItemsComponent from "../components/Moderation/ReportedItemsComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <ReportedItemsComponent v-if="isLoggedIn" />
    <RecommendationsComponent v-if="isLoggedIn" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
