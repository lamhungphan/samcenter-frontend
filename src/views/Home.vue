<template>
  <div>
     <HeaderComponent/>
    <Carousel />
    <ProductCategory />
    <ProductList :products="products" v-if="products.length > 0" />
    <p v-else class="text-center text-danger">Không có sản phẩm nào</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useProductStore } from '@/store/productStore';
import Carousel from '@/components/Carousel.vue';
import ProductCategory from '@/components/CategoryList.vue';
import ProductList from '@/components/ProductList.vue';
import HeaderComponent from '@/components/Header.vue'
import FooterComponent from '@/components/Footer.vue'

const productStore = useProductStore();
const products = computed(() => productStore.products);

onMounted(() => {
  productStore.fetchProducts();
});
</script>
