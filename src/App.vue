<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useUserStore } from "./store/userStore";

onMounted(() => {
  const userStore = useUserStore();

  if (userStore.isAuthenticated) {
    const userId = userStore.userId;
    console.log("User ID từ JWT:", userId);

    // Gọi API khởi tạo hoặc load data:
    // fetchCart(userId), fetchUserSettings(userId), v.v.
  }
});
</script>

<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<style scoped>
</style>
