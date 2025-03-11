import { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { api } from "../api/api";

// 建立 Context
export const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ carts: [] });

  // 取得購物車列表
  const getCart = async () => {
    try {
      const res = await api.getCart();
      setCart({ carts: res.data.data?.carts || [] });
    } catch (error) {
      setCart({ carts: [] });
      if (error.response?.data?.success === false) {
        Swal.fire({
          title: "取得購物車失敗",
          icon: "error",
        });
      }
    }
  };

  // 刪除單一購物車
  const deleteCart = async (id) => {
    try {
      const res = await api.deleteCart(id);
      if (res?.data?.success === true) {
        Swal.fire({
          title: "刪除購物車成功",
          icon: "success",
        }).then(getCart);
      }
    } catch (error) {
      if (error.response?.data?.success === false) {
        Swal.fire({
          title: "刪除購物車失敗",
          icon: "error",
        });
      }
    }
  };

  // 更新商品數量
  const updateCart = async (id, qty = 1) => {
    try {
      const data = { product_id: id, qty };
      const res = await api.updateCart(id, data);
      if (res?.data?.success === true) {
        Swal.fire({
          title: "更新商品數量成功",
          icon: "success",
        });
        getCart();
      }
    } catch (error) {
      if (error.response?.data?.success === false) {
        Swal.fire({
          title: "更新商品數量失敗",
          icon: "error",
        });
      }
    }
  };

  // 清空購物車
  const deleteCartAll = async () => {
    try {
      const res = await api.deleteCartAll();
      if (res?.data?.success === true) {
        Swal.fire({
          title: "清空購物車成功",
          icon: "success",
        });
      }
      getCart();
    } catch (error) {
      if (error.response?.data?.success === false) {
        Swal.fire({
          title: "清空購物車失敗",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, getCart, deleteCart, updateCart, deleteCartAll }}>
      {children}
    </CartContext.Provider>
  );
};

// 建立 Hook 讓元件更方便取用 Context
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
