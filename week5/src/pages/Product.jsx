import { useState, useEffect, useRef } from 'react'
import ProductList from '../component/ProductList'
import Pagination from '../component/Pagination'
import ProductModal from '../component/ProductModal';
import CheckoutPage from './CheckoutPage'
import CartPage from './CartPage'
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { api } from '../api/api';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function ProductPage() {

  // 設定初始產品資料
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ carts: [] });
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 設定分頁資料
  const [pagination, setPagination] = useState({
    current_page: 1,
    has_pre: false,
    has_next: true,
    total_pages: 5
  });

  // 操作 Modal DOM 元素
  const productModalRef = useRef(null);

  useEffect(() => {
    getProducts();
    getCart();
  }, []);

  // 取得全部產品，page = 1 帶入分頁
  const getProducts = async (page = 1) => {
    await api
      .getProducts(page)
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "取得產品失敗",
            icon: "error"
          })
        }
      });
  };

  // 取得單一產品
  const getProduct = async (id) => {
    setLoadingProductId(id);
    await api
      .getProduct(id)
      .then((res) => {
        setSelectedProduct(res.data.product);
        setLoadingProductId(null);
        console.log(res);
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "取得產品失敗",
            icon: "error"
          })
        }
      });
  };

  // 打開 Modal
  const openModal = async (productId) => {
    setLoadingProductId(productId);

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    if(productId){
      getProduct(productId);
      productModalRef.current.show();
      setLoadingProductId(null);
    }
    
  }

  // 關閉 Modal
  const closeModal = () => {
    productModalRef.current.hide();
  }

  // 取得購物車列表
  const getCart = async () => {
    await api
    .getCart()
    .then((res) => {
        setCart(res.data.data);
        console.log(res);
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "取得購物車失敗",
            icon: "error"
          })
        }
      });
  };

  // 加入購物車
  const addCart = async (id, num) => {
    setLoadingCartId(id);
    const data = {
      product_id: id,
      qty: num,
    };
    await api
    .addCart(data)
    .then((res) => {
        getCart();
        setLoadingCartId(null);
        productModalRef.current.hide();
        Swal.fire({
          title: "加入購物車成功",
          icon: "success"
        })
        console.log(res);
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "加入購物車失敗",
            icon: "error"
          })
        }
      });
  };

  // 清除單一筆購物車
  const deleteCart = async (id) => {
    await api
    .deleteCart(id)
    .then((res) => {
      if(res?.data?.success === true){
        Swal.fire({
          title: "刪除購物車成功",
          icon: "success"
        })
      }
        getCart();
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "刪除購物車失敗",
            icon: "error"
          })
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
      if(res?.data?.success === true){
        Swal.fire({
          title: "更新商品數量成功",
          icon: "success"
        })
        getCart();
      }
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "更新商品數量失敗",
            icon: "error"
          })
        }
      });
  };

  // 清空購物車
  const deleteCartAll = async () => {
    await api
    .deleteCartAll()
    .then((res) => {
      if(res?.data?.success === true){
        Swal.fire({
          title: "清空購物車成功",
          icon: "success"
        })
      }
        getCart();
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "清空購物車失敗",
            icon: "error"
          })
        }
      });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="vite-project-traning/week5" 
          element={
            <div className="container py-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>產品列表</h2>
                <Link to="/vite-project-traning/week5/cart" className="btn btn-outline-primary">
                  查看購物車 ({cart?.carts?.length})
                </Link>
              </div>

              <ProductList 
                products={products}
                openModal={openModal}
                addCart={addCart}
                loadingProductId={loadingProductId}
                loadingCartId={loadingCartId}
              />
            
              <Pagination
                pagination={pagination}
                onPageChange={getProducts}
              />

              <ProductModal
                product={selectedProduct} 
                addCart={addCart}
                onCloseModal={closeModal}
              />
            </div>
          } 
        />
        <Route 
          path="/vite-project-traning/week5/cart"
          element={
            <CartPage 
              cart={cart}
              deleteCartAll={deleteCartAll}
              deleteCart={deleteCart}
              updateCart={updateCart}
            />
          } 
        />
        <Route path="/vite-project-traning/week5/checkout" element={<CheckoutPage getCart={getCart}/>} />
   </Routes>
 </BrowserRouter>
  );
}

export default ProductPage