<template>
  <ChangePasswordModal :mode="'reset'" :token="token" @close="goToLogin" />
</template>
  
  <script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";

const router = useRouter();
const route = useRoute();
const token = ref(route.query.token || "");

const goToLogin = () => {
  router.push("/login");
};
</script>
  