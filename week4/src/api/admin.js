import { api } from './api';
import axios from 'axios';
import Swal from 'sweetalert2';

export const admin = {
  login: async (formData) => {
    try {
      const response = await api.signIn(formData);
      const { token, expired } = response.data;
      document.cookie = `accessToken=${token}; expires=${new Date(expired)}`;
    } catch (error) {
      if(error.response?.data?.success === false){
        Swal.fire({
          title: "登入失敗",
          icon: "error"
        })
      }
    }
  },
  checkAdmin: async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common.Authorization = token;
      const response = await api.checkAdmin();
      return response.data.success;
    } catch (error) {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "驗證失敗，請重新登入",
            icon: "error"
          })
        }
    }
  },
}; 