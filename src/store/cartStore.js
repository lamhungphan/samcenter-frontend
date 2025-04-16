import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axiosInstance from '@/axios/axios';
import { useUserStore } from '@/store/userStore';

export const useCartStore = defineStore('cart', () => {
  const cart = ref([]);
  const userStore = useUserStore();
  const userId = computed(() => userStore.user?.id || null);

  // --- Local Storage ---
  const getLocalCart = () => JSON.parse(localStorage.getItem('localCart') || '[]');
  const saveLocalCart = (items) => localStorage.setItem('localCart', JSON.stringify(items));
  const clearLocalCart = () => localStorage.removeItem('localCart');

  // --- Fetch Cart from DB ---
  const fetchCart = async () => {
    if (!userId.value) {
      cart.value = getLocalCart();
      return;
    }
    try {
      const res = await axiosInstance.get(`/cart/${userId.value}`);
      cart.value = res.data.data || [];
    } catch (err) {
      console.error('Lỗi fetchCart:', err);
      cart.value = [];
    }
  };

  // --- Add to Cart ---
  const addToCart = async (userIdParam, productId, quantityChange = 1) => {
    const id = userIdParam || userId.value;

    if (!id) {
      // ✅ Chưa đăng nhập → thao tác với local
      let localCart = getLocalCart();
      const item = localCart.find(i => i.productId === productId);
      if (item) {
        item.quantity += quantityChange;
        if (item.quantity <= 0) {
          localCart = localCart.filter(i => i.productId !== productId);
        }
      } else if (quantityChange > 0) {
        localCart.push({ productId, quantity: quantityChange });
      }
      saveLocalCart(localCart);
      cart.value = localCart;
      return;
    }

    // ✅ Đã đăng nhập → thao tác với DB
    const existing = cart.value.find(i => i.productId === productId);
    const newQuantity = (existing?.quantity || 0) + quantityChange;

    try {
      if (newQuantity > 0) {
        if (existing) {
          await axiosInstance.put('/cart/update', { userId: id, productId, quantity: newQuantity });
        } else {
          await axiosInstance.post('/cart/add', { userId: id, productId, quantity: newQuantity });
        }
      } else {
        await axiosInstance.delete(`/cart/remove/${id}/${productId}`);
      }
      await fetchCart();
    } catch (err) {
      console.error('Lỗi addToCart:', err);
    }
  };

  // --- Remove from Cart ---
  const removeFromCart = async (userIdParam, productId) => {
    const id = userIdParam || userId.value;

    if (!id) {
      let localCart = getLocalCart();
      localCart = localCart.filter(i => i.productId !== productId);
      saveLocalCart(localCart);
      cart.value = localCart;
      return;
    }

    try {
      await axiosInstance.delete(`/cart/remove/${id}/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error('Lỗi removeFromCart:', err);
    }
  };

  const clearCart = async () => {
    if (!userId.value) {
      clearLocalCart();
      cart.value = [];
      return;
    }

    try {
      await axiosInstance.delete(`/cart/clear/${userId.value}`); // bạn cần hỗ trợ API này ở backend
      cart.value = [];
    } catch (err) {
      console.error('Lỗi clearCart:', err);
    }
  };

  // --- Sync local cart vào DB sau khi đăng nhập ---
  const syncLocalCartToServer = async () => {
    if (!userId.value) return;

    const localCart = getLocalCart();
    if (localCart.length === 0) return;

    for (const item of localCart) {
      await addToCart(userId.value, item.productId, item.quantity);
    }

    clearLocalCart();
    await fetchCart();
    console.log('Đồng bộ giỏ hàng local lên server thành công');
  };

  // --- Init cart: gọi trong onMounted hoặc App.vue
  const initializeCart = async () => {
    if (userId.value) {
      await syncLocalCartToServer();
    }
    await fetchCart();
  };

  const cartTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  );

  return {
    cart,
    cartTotal,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    initializeCart,
    syncLocalCartToServer,
  };
});
