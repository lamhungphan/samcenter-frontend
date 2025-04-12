<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h2 class="text-center mb-4 fw-bold">Quên Mật Khẩu</h2>
      <form @submit.prevent="changePassword">
        <div class="mb-3">
          <label for="email" class="form-label"></label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            required
            placeholder="Nhập địa chỉ email của bạn"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Gửi</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["close"]);
const email = ref("");

const close = () => emit("close");

const changePassword = () => {
  console.log("Gửi yêu cầu reset mật khẩu:", email.value);
  emit("close");
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
