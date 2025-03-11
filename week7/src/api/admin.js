// import { api } from './api';
import Swal from 'sweetalert2';

import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export const admin = {
  signIn: (formData) => axios.post(`${API_BASE_URL}/admin/signin`, formData),
  checkAdmin: () => axios.post(`${API_BASE_URL}/api/user/check`),
  getProductData: (page = 1) => axios.get(`${API_BASE_URL}/api/${API_PATH}/admin/products?page=${page}`),
  createProductData: (productData) => axios.post(`${API_BASE_URL}/api/${API_PATH}/admin/product`, productData),
  updateProductData: (productData) => axios.put(`${API_BASE_URL}/api/${API_PATH}/admin/product/${productData.data.id}`, productData),
  delProductData: (productId) => axios.delete(`${API_BASE_URL}/api/${API_PATH}/admin/product/${productId}`),
  uploadImage: (imageData) => axios.post(`${API_BASE_URL}/api/${API_PATH}/admin/upload`, imageData),


  checkLogin: async () => {
      try {
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );
        axios.defaults.headers.common.Authorization = token;
        if (!token) {
          return
        } else {
          const response = await axios.post(`${API_BASE_URL}/api/user/check`, {},{
            headers: {
              Authorization: `Bearer ${token}`
          }
        });

          return response.data.success;
        }
        
      } catch (error) {
          if(error.response?.data?.success === false){
            Swal.fire({
              title: "驗證失敗，請重新登入",
              icon: "error"
            })
          }
      }
    },

  login: async (formData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/signin`, formData);
        localStorage.setItem("authToken", response.data.token);
        const { token, expired } = response.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        axios.defaults.headers.common.Authorization = `${token}`;
      } catch (error) {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "登入失敗",
            icon: "error"
          })
        }
      }
    },
}; 