import { RouterProvider } from "react-router-dom";
import router from "./router";
import { api } from './api/api';
import Swal from 'sweetalert2';
import { useState } from 'react';

const App = () => {
  const [cart, setCart] = useState({ carts: [] });

  // 取得購物車列表
  const getCart = async () => {
    await api
      .getCart()
      .then((res) => {
        setCart(res.data.data);
      })
      .catch((error) => {
        if (error.response?.data?.success === false) {
          Swal.fire({
            title: "取得購物車失敗",
            icon: "error",
          });
        }
      });
  };

  // 清除單一筆購物車
  const deleteCart = async (id) => {
    await api
      .deleteCart(id)
      .then((res) => {
        if (res?.data?.success === true) {
          Swal.fire({
            title: "刪除購物車成功",
            icon: "success",
          });
        }
        getCart();
      })
      .catch((error) => {
        if (error.response?.data?.success === false) {
          Swal.fire({
            title: "刪除購物車失敗",
            icon: "error",
          });
        }
      });
  };

  // 更新商品數量
  const updateCart = async (id, qty = 1) => {
    const data = {
      product_id: id,
      qty,
    };
    await api
      .updateCart(id, data)
      .then((res) => {
        if (res?.data?.success === true) {
          Swal.fire({
            title: "更新商品數量成功",
            icon: "success",
          });
          getCart();
        }
      })
      .catch((error) => {
        if (error.response?.data?.success === false) {
          Swal.fire({
            title: "更新商品數量失敗",
            icon: "error",
          });
        }
      });
  };

  // 清空購物車
  const deleteCartAll = async () => {
    await api
      .deleteCartAll()
      .then((res) => {
        if (res?.data?.success === true) {
          Swal.fire({
            title: "清空購物車成功",
            icon: "success",
          });
        }
        getCart();
      })
      .catch((error) => {
        if (error.response?.data?.success === false) {
          Swal.fire({
            title: "清空購物車失敗",
            icon: "error",
          });
        }
      });
  };

  return ( 
    <RouterProvider router={router(deleteCartAll, deleteCart, updateCart, getCart, cart)} />
  );
};

export default App;
