<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import ReportedItemsComponent from "../components/Moderation/ReportedItemsComponent.vue";
import RecommendationsComponent from "../components/Post/RecommendationsComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <div v-else>
        <h1>
          Login to Find
          <div id="gold-text">Art in the USA</div>
        </h1>
        <div id="img-container">
          <img src="../assets/images/usaMap.jpeg" />
        </div>
      </div>
    </section>
    <ReportedItemsComponent v-if="isLoggedIn" />
    <RecommendationsComponent v-if="isLoggedIn" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

img {
  max-width: 50%;
  height: auto;
}

#gold-text {
  color: #886750;
}

#img-container {
  display: flex;
  justify-content: center;
}
</style>
