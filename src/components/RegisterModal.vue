<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <form @submit.prevent="register">
          <h2 class="text-center mb-4 fw-bold">Đăng ký tài khoản</h2>
  
          <input
            v-model="username"
            type="text"
            placeholder="Tên người dùng"
            required
            class="form-control mb-3"
          />
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="form-control mb-3"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu"
            required
            class="form-control mb-3"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            required
            class="form-control mb-4"
          />
          <button type="submit" class="btn btn-success w-100">Đăng ký</button>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useUsers } from "@/store/admin/UserStore";
  import Swal from "sweetalert2";
  
  const emit = defineEmits(["close"]);
  
  const router = useRouter();
  const userStore = useUsers();
  
  const username = ref("");
  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const errorMessage = ref("");
  
  const register = async () => {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Mật khẩu nhập lại không khớp!";
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: errorMessage.value,
      });
      return;
    }
  
    const payload = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
  
    const { success, message } = await userStore.createUser(payload);
  
    if (success) {
      await Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Chào mừng bạn đến với hệ thống!",
        showConfirmButton: false,
        timer: 1500,
      });
      emit("close");
      router.push("/login");
    } else {
      errorMessage.value = message;
      Swal.fire({ icon: "error", title: "Đăng ký thất bại", text: message });
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  .modal-content {
    width: 100%;
    max-width: 450px;
    background-color: #fff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
  .error {
    color: red;
    margin-top: 12px;
    text-align: center;
  }
  </style>
  