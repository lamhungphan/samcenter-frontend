<template>
    <div>Đang đăng nhập...</div>
  </template>
  
  <script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/userStore';
  
  const route = useRoute();
  const router = useRouter();
  const store = useUserStore();
  
  const token = route.query.token;
  const refreshToken = route.query.refreshToken;
  
  if (token) {
    store.token = token;
    store.refreshToken = refreshToken;
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    store.user = {
      username: payload.sub,
      id: payload.userId,
      email: payload.email,
    };
  
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(store.user));
  
    router.push('/');
  }
  </script>
  
  