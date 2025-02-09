import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export const api = {
  getProducts: (page = 1) => axios.get(`${API_BASE_URL}/api/${API_PATH}/products?page=${page}`),
  getProduct: (id) => axios.get(`${API_BASE_URL}/api/${API_PATH}/product/${id}`),
  getCart: () => axios.get(`${API_BASE_URL}/api/${API_PATH}/cart`),
  addCart: (data) => axios.post(`${API_BASE_URL}/api/${API_PATH}/cart`, { data }),
  deleteCart: (id) => axios.delete(`${API_BASE_URL}/api/${API_PATH}/cart/${id}`),
  deleteCartAll: () => axios.delete(`${API_BASE_URL}/api/${API_PATH}/carts`),
  updateCart: (id, data) => axios.put(`${API_BASE_URL}/api/${API_PATH}/cart/${id}`, { data }),
  addCouponCode: (data) => axios.post(`${API_BASE_URL}/api/${API_PATH}/coupon`, {data}),
  order: (data) => axios.post(`${API_BASE_URL}/api/${API_PATH}/order`, {data: { user: data, message: data.message }}),
};
