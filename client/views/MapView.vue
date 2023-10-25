<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import MapComponent from "@/components/Map/MapComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>
<template>
  <main>
    <section>
      <MapComponent v-if="isLoggedIn" />
      <h1 v-else>Please login!</h1>
    </section>
  </main>
</template>
<style scoped>
h1 {
  text-align: center;
}
</style>
