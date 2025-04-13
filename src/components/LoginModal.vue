<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h2 class="text-center mb-4">Đăng nhập</h2>
  
        <form @submit.prevent="login">
          <div class="mb-3">
            <input
              v-model="username"
              type="text"
              class="form-control"
              placeholder="Tên người dùng"
              required
            />
          </div>
          <div class="mb-3">
            <input
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Mật khẩu"
              required
            />
          </div>
          <button
            type="submit"
            class="btn btn-warning w-100"
            :disabled="store.loading"
          >
            {{ store.loading ? "Đang đăng nhập..." : "Đăng nhập" }}
          </button>
        </form>
  
        <div class="sso-buttons">
          <button @click="googleLogin" class="google-btn">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google"
            />
            Đăng nhập với Google
          </button>
          <button @click="loginWithFacebook" class="facebook-btn">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook"
            />
            Đăng nhập với Facebook
          </button>
        </div>
  
        <p v-if="store.isAuthenticated" class="text-center mt-3">
          Đã đăng nhập với {{ store.user.username }}
          <a href="#" @click.prevent="router.push('/')">Về trang chủ</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useUserStore } from "@/store/userStore";
  import { useRouter } from "vue-router";
  import Swal from "sweetalert2";
  
  const emit = defineEmits(["close"]);
  
  const store = useUserStore();
  const router = useRouter();
  const username = ref("");
  const password = ref("");
  
  async function login() {
    const success = await store.login(username.value, password.value);
  
    if (success) {
      await Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        text: `Chào mừng, ${store.user?.username || "bạn"}!`,
        showConfirmButton: false,
        timer: 1500,
      });
  
      emit("close");
  
      if (store.canViewManagerDashboard) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: store.error || "Vui lòng kiểm tra lại tài khoản!",
      });
    }
  }
  
  function googleLogin() {
    console.log("Google login...");
    // Gọi hàm login Google
  }
  function loginWithFacebook() {
    console.log("Facebook login...");
    // Gọi hàm login Facebook
  }
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
    z-index: 1000;
  }
  .modal-content {
    width: 100%;
    max-width: 400px;
    background-color: #f8f9fa;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
  .sso-buttons {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .google-btn,
  .facebook-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: none;
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
  .google-btn {
    background-color: #db4437;
    color: white;
  }
  .facebook-btn {
    background-color: #3b5998;
    color: white;
  }
  .google-btn img,
  .facebook-btn img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  </style>
  