import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export const api = {
  signIn: (formData) => axios.post(`${API_BASE_URL}/admin/signin`, formData),
  checkAdmin: () => axios.post(`${API_BASE_URL}/api/user/check`),
  getProductData: (page = 1) => axios.get(`${API_BASE_URL}/api/${API_PATH}/admin/products?page=${page}`),
  createProductData: (productData) => axios.post(`${API_BASE_URL}/api/${API_PATH}/admin/product`, productData),
  updateProductData: (productData) => axios.put(`${API_BASE_URL}/api/${API_PATH}/admin/product/${productData.data.id}`, productData),
  delProductData: (productId) => axios.delete(`${API_BASE_URL}/api/${API_PATH}/admin/product/${productId}`),
  uploadImage: (imageData) => axios.post(`${API_BASE_URL}/api/${API_PATH}/admin/upload`, imageData),
};