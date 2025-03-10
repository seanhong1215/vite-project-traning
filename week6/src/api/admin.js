import { api } from './api';
import axios from 'axios';
import Swal from 'sweetalert2';

export const admin = {
  login: async (formData) => {
    try {
      const response = await api.signIn(formData);
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
  checkLogin: async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
  
      if (!token) {
        localStorage.removeItem("isAuthLogin");
        return false; 
      }
  
      const response = await axios.get("/api/checkAdmin", {
        headers: { Authorization: token }
      });
  
      if (response.data.success) {
        localStorage.setItem("isAuthLogin", "true");
        return true;
      } else {
        localStorage.removeItem("isAuthLogin");
        return false;
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem("isAuthLogin");
      return false;
    }
  },
  
}; 