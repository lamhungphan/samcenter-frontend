<template>
  <div class="container">
    <div class="row">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="col-md-3 col-sm-6 mb-4"
      >
        <div class="card product-card" @click="goToProduct(product.id)">
          <div class="image-container">
            <img
              :src="product.image"
              class="card-img-top"
              :alt="product.name"
            />
          </div>
          <div class="card-body text-center">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="text-danger">{{ formatPrice(product.price) }}₫</p>
          </div>
        </div>
      </div>
    </div>

    <!-- PHÂN TRANG -->
    <div
      class="d-flex justify-content-center mt-4"
      v-if="!props.hidePagination && totalPages > 1"
    >
      <button
        class="btn btn-outline-primary me-2"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Trang trước
      </button>

      <span class="align-self-center"
        >Trang {{ currentPage }} / {{ totalPages }}</span
      >

      <button
        class="btn btn-outline-primary ms-2"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Trang sau
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "vue-router";

const props = defineProps({
  categoryId: {
    type: Number,
    required: false,
  },
  hidePagination: {
    type: Boolean,
    default: false,
  },
});
const categoryProducts = ref([]);

const productStore = useProductStore();
const router = useRouter();

const products = computed(() => productStore.products);
const itemsPerPage = 8;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(products.value.length / itemsPerPage)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return products.value.slice(start, start + itemsPerPage);
});

const formatPrice = (price) => price.toLocaleString("vi-VN");

const goToProduct = (id) => {
  router.push(`/product/${id}`);
};

const loadProducts = async () => {
  currentPage.value = 1;
  if (props.categoryId) {
    const response = await productStore.fetchProductsByCategory(props.categoryId);
    categoryProducts.value = response;
  } else {
    const response = await productStore.fetchProducts();
    categoryProducts.value = response;
  }
};

watch(() => props.categoryId, async (newCategoryId, oldCategoryId) => {
  if (newCategoryId !== oldCategoryId) {
    await loadProducts();
  }
});

</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  background-color: #f8f9fa;
}

.card-img-top {
  max-height: 200px;
  width: auto;
  object-fit: contain;
}
</style>
