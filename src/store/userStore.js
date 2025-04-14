import { defineStore } from "pinia";
import axiosInstance from "@/axios/axios";
import { decodeJWT } from "@/utils/jwt";
import { useCartStore } from "@/store/cartStore";

export const useUserStore = defineStore("login", {
  state: () => ({
    token: sessionStorage.getItem("token") || null,
    refreshToken: sessionStorage.getItem("refreshToken") || null,
    error: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,

    decodedToken: (state) => {
      if (!state.token) return null;
      try {
        return decodeJWT(state.token);
      } catch (e) {
        return null;
      }
    },

    userId: (state) => {
      const decoded = decodeJWT(state.token);
      console.log("Decoded token:", decoded);
      return decoded?.id || decoded?.sub || null;
    },    

    username: (state) => {
      return state.decodedToken?.username || null;
    },

    role: (state) => {
      let rawRole = state.decodedToken?.role;

      if (Array.isArray(rawRole)) rawRole = rawRole[0];
      if (typeof rawRole === "string") rawRole = rawRole.replace(/[\[\]']/g, "").trim();

      return rawRole?.toLowerCase() || null;
    },

    canViewManagerDashboard: (state) => {
      return ["director", "staff"].includes(state.role);
    },

    isDirector: (state) => state.role === "director",
    isStaff: (state) => state.role === "staff",
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post("/auth/access-token", {
          username,
          password,
        });

        if (response.data.accessToken) {
          this.token = response.data.accessToken;
          this.refreshToken = response.data.refreshToken;

          sessionStorage.setItem("token", this.token);
          sessionStorage.setItem("refreshToken", this.refreshToken);

          const userId = decodeJWT(this.token)?.id;
          const cartStore = useCartStore();

          await cartStore.syncLocalCartToServer(userId);
          await cartStore.initializeCart(userId);

          return true;
        } else {
          this.error = "Sai tên đăng nhập hoặc mật khẩu!";
          return false;
        }
      } catch (error) {
        console.error("Login error:", error);
        this.error = error.response?.data?.message || "Lỗi kết nối đến máy chủ!";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email) {
      this.loading = true;
      this.error = null;
      try {
        await axiosInstance.post("/account/forgot-password", null, {
          params: { email },
        });
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || "Lỗi gửi email đặt lại mật khẩu";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword({ token, newPassword }) {
      this.loading = true;
      this.error = null;
      try {
        await axiosInstance.post("/account/reset-password", {
          token,
          newPassword,
        });
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || "Lỗi đặt lại mật khẩu";
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.error = null;

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      localStorage.removeItem("localCart"); // Nếu bạn vẫn dùng localCart
    },
  },
});

