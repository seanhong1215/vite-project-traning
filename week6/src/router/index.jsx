import { createHashRouter } from "react-router-dom";
import FrontendLayout from '../layouts/FrontendLayout';
import CheckoutPage from '../pages/CheckoutPage';
import CartPage from '../pages/CartPage';
import ProductPage from '../pages/Product';

const createRouter = (deleteCartAll, deleteCart, updateCart, getCart, cart) => {
    return createHashRouter([
      {
        path: '/',
        element: <FrontendLayout />,
        children: [
          {
            index: true, //設定首頁
            element: <ProductPage getCart={getCart} cart={cart} />,
          },
          {
            path: 'checkout',
            element: <CheckoutPage getCart={getCart} />,
          },
          {
            path: 'cart',
            element: (
              <CartPage
                cart={cart}
                deleteCartAll={deleteCartAll}
                deleteCart={deleteCart}
                updateCart={updateCart}
              />
            ),
          },
        ],
      },
    ]);
  };

export default createRouter ;
