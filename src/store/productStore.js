import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from "@/axios/axios";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME;

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const productDetail = ref(null);
  const pageNumber = ref(0);
  const totalPages = ref(0);

  const formatProduct = (product) => ({
    ...product,
    image: product.image
      ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${product.image}`
      : "no img",
    publishDate: product.publishDate || "Chưa cập nhật",
  });

  const fetchProducts = async (page = 0) => {
    try {
      const response = await axiosInstance.get(`/products`, {
        params: { page }
      });
      const productList = response.data?.data?.content || [];
      products.value = productList.map(formatProduct);
      pageNumber.value = response.data?.data?.number || 0;
      totalPages.value = response.data?.data?.totalPages || 1;
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error.response?.data || error.message);
    }
  };


  const fetchProductById = async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      const productData = response.data?.data;
      productDetail.value = productData ? formatProduct(productData) : null;
    } catch (error) {
      console.error(`Lỗi khi tải sản phẩm có ID ${id}:`, error.response?.data || error.message);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axiosInstance.get(`/products/category/${categoryId}`);
      const productList = response.data?.data?.content || [];
      products.value = productList.map(product => ({
        ...product,
        image: product.image ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${product.image}` : 'no img',
        publishDate: product.publishDate || "Chưa cập nhật"
      }));
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm theo danh mục:', error.response?.data || error.message);
    }
  };

  const searchProducts = async (keyword) => {
    try {
      const response = await axiosInstance.get(`/products/search`, {
        params: { keyword }
      });
      const productList = response.data?.data?.content || [];
      products.value = productList.map(formatProduct);
    } catch (error) {
      console.error(`Lỗi khi tìm kiếm sản phẩm với từ khóa "${keyword}":`, error.response?.data || error.message);
    }
  };

  const create = async (product) => {
    try {
      const response = await axiosInstance.post(`/products`, product);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message);
      return null;
    }
  };

  const update = async (productId, product) => {
    try {
      const response = await axiosInstance.put(`/products/${productId}`, product);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error.response?.data || error.message);
      return null;
    }
  };

  const remove = async (productId) => {
    try {
      const response = await axiosInstance.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error.response?.data || error.message);
      return null;
    }
  };

  const uploadImage = async (productId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post(`/products/${productId}/upload`, formData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi upload ảnh sản phẩm:', error.response?.data || error.message);
      return null;
    }
  };

  return {
    products,
    productDetail,
    pageNumber,
    totalPages,
    fetchProducts,
    fetchProductById,
    fetchProductsByCategory,
    searchProducts,
    create,
    update,
    delete: remove,
    uploadImage,
  };

});
