import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { CartProvider, useCart  } from "./contexts/CartContext";
import { createHashRouter, Navigate } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import ProductPageList from "./pages/ProductPageList";
import ProductPageListDetail from "./pages/ProductPageDetail";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Layout from "./Layouts/FrontendLayout";
import store from './redux/store';
import { Provider } from "react-redux";


function App() {

  return (
    <Provider store={store}>
      <CartProvider>
        <RouterWrapper />
      </CartProvider>
    </Provider>
  );
}

// eslint-disable-next-line react/prop-types
const RouterWrapper = () => {
  const { cart, getCart, deleteCart, updateCart, deleteCartAll } = useCart(); // 使用 CartContext 提供的 cart 和方法

  // 記錄是否登入的狀態
  const [isLogin, setIsLogin] = useState(false);

  return (
    <RouterProvider
      router={createHashRouter([
        {
          path: "/",
          element: isLogin ? <Navigate to="/product" replace /> : <Navigate to="/login" replace />,
        },
        {
          path: "/login",
          element: <Login setIsLogin={setIsLogin} />,
        },
        {
          path: "/product",
          element: <Layout cart={cart} isLogin={isLogin} />,
          children: [
            { index: true, element: <ProductPage /> },
          ],
        },
        {
          path: "/product-list",
          element: <Layout cart={cart} isLogin={isLogin} />,
          children: [
            { index: true, element: <ProductPageList getCart={getCart} /> },
            { path: ":id", element: <ProductPageListDetail cart={cart} getCart={getCart} /> },
          ],
        },
        {
          path: "/checkout",
          element: <CheckoutPage getCart={getCart} />,
        },
        {
          path: "/cart",
          element: <CartPage cart={cart} deleteCartAll={deleteCartAll} deleteCart={deleteCart} updateCart={updateCart} />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ])}
    />
  );
};

export default App;





