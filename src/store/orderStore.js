import { defineStore } from 'pinia';
import axiosInstance from '@/axios/axios';
import { useUserStore } from '@/store/userStore';

const getOrdersByUserId = (userId) => axiosInstance.get(`/order/user/${userId}`);

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [],
        currentOrder: null,
        orderDetailsList: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchOrders({ userId = null, keyword = '', sort = '', page = 1, size = 5 } = {}) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await axiosInstance.get(userId ? `/order/user/${userId}` : `/order`, {
                    params: { keyword, sort, page, size },
                });
                const data = response.data.data;
                this.orders = data.content || data;
                return data;
            } catch (err) {
                this.error = err;
                throw err;
            } finally {
                this.isLoading = false;
            }
        },        

        async fetchOrderById(orderId) {
            if (!orderId) {
                console.error('Không thể fetchOrderById vì orderId không hợp lệ:', orderId);
                return;
            }
            try {
                const response = await axiosInstance.get(`/order/${orderId}`);
                this.currentOrder = response.data.data;
                return this.currentOrder;
            } catch (error) {
                console.error(`Error fetching order with id ${orderId}:`, error);
                throw error;
            }
        },

        async createOrder(orderData) {
            try {
                const response = await axiosInstance.post('/order', orderData);
                const newOrder = response.data.data;
                console.log('Order created:', newOrder);

                if (newOrder && newOrder.id) {
                    this.orders.push(newOrder);
                    this.currentOrder = newOrder;
                    await this.fetchOrderById(newOrder.id);
                } else {
                    console.warn('⚠️ createOrder trả về order không có ID:', newOrder);
                }

                return newOrder;
            } catch (error) {
                console.error('Error creating order:', error);
                throw error;
            }
        },

        async updateOrder(orderId, orderData) {
            try {
                const response = await axiosInstance.put(`/order/${orderId}`, orderData);
                const updatedOrder = response.data.data;
                const index = this.orders.findIndex(order => order.id === orderId);
                if (index !== -1) {
                    this.orders[index] = updatedOrder || orderData;
                }
                if (this.currentOrder && this.currentOrder.id === orderId) {
                    this.currentOrder = updatedOrder || orderData;
                }
                return updatedOrder || orderData;
            } catch (error) {
                console.error(`Error updating order with id ${orderId}:`, error);
                throw error;
            }
        },

        async deleteOrder(orderId) {
            try {
                await axiosInstance.delete(`/order/${orderId}`);
                this.orders = this.orders.filter(order => order.id !== orderId);
                if (this.currentOrder && this.currentOrder.id === orderId) {
                    this.currentOrder = null;
                }
            } catch (error) {
                console.error(`Error deleting order with id ${orderId}:`, error);
                throw error;
            }
        },

        async fetchOrderDetails({ keyword = '', sort = '', page = 1, size = 5 } = {}) {
            try {
                const response = await axiosInstance.get('/order-detail', {
                    params: { keyword, sort, page, size },
                });
                const pageData = response.data.data;
                this.orderDetailsList = pageData.content;
                return pageData;
            } catch (error) {
                console.error('Error fetching order details:', error);
                throw error;
            }
        },

        async fetchOrdersByUser(userId) {
            this.loading = true;
            try {
                const response = await getOrdersByUserId(userId);
                this.orders = response.data.data;
            } catch (err) {
                this.error = err;
                console.error("Failed to fetch orders:", err);
            } finally {
                this.loading = false;
            }
        },
    },
});
