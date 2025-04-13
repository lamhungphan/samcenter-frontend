<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content p-4 rounded shadow bg-white" style="width: 400px">
      <h2 class="text-center mb-4 fw-bold">Quên Mật Khẩu</h2>
      <form @submit.prevent="changePassword">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            required
            placeholder="Nhập địa chỉ email của bạn"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? "Đang gửi..." : "Gửi" }}
        </button>
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        <p v-if="success" class="text-success mt-2">Đã gửi email khôi phục thành công!</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/store/userStore";

const email = ref("");
const loading = ref(false);
const error = ref(null);
const success = ref(false);

const userStore = useUserStore();

const emit = defineEmits(["close"]);
const close = () => emit("close");

const changePassword = async () => {
  error.value = null;
  success.value = false;
  loading.value = true;

  const ok = await userStore.forgotPassword(email.value.trim());
  loading.value = false;

  if (ok) {
    success.value = true;
    setTimeout(() => {
      emit("close");
    }, 1500);
  } else {
    error.value = userStore.error;
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
</style>
