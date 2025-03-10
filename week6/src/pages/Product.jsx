import { useState, useEffect } from 'react';
import ProductList from '../component/ProductList';
import Pagination from '../component/Pagination';
import Swal from 'sweetalert2';
import { api } from '../api/api';
// import { admin } from '../api/admin';
import PropTypes from 'prop-types';

const ProductPage = ({ getCart }) => {

  // 設定初始產品資料
  const [products, setProducts] = useState([]);

  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);

  // 設定分頁資料
  const [pagination, setPagination] = useState({
    current_page: 1,
    has_pre: false,
    has_next: true,
    total_pages: 5
  });


  useEffect(() => {
    getProducts();
    getCart();
  }, []);

  // 取得全部產品，page = 1 帶入分頁
  const getProducts = async (page = 1) => {
    const res = await api.getProducts(page);
    try {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
    } catch (error) {
      if(error.response?.data?.success === false){
        Swal.fire({
          title: "取得產品失敗",
          icon: "error"
        })
      }
    }
  };

  // 加入購物車
  const addCart = async (id, num) => {
    setLoadingCartId(id);
    const data = {
      product_id: id,
      qty: num,
    };
    await api.addCart(data);
      try {
        getCart();
        setLoadingCartId(null);
        Swal.fire({
          title: "加入購物車成功",
          icon: "success"
        })
      } catch (error) {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "加入購物車失敗",
            icon: "error"
          })
        }
      }
  };

  return (
    <div className="container py-5">
      {/* <Navbar cartCount={cart?.carts?.length} /> */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>產品列表</h2>
      </div>
      <ProductList 
        products={products}
        addCart={addCart}
        loadingProductId={loadingProductId}
        loadingCartId={loadingCartId}
      />
      <Pagination
        pagination={pagination}
        onPageChange={getProducts}
      />
    </div>
  );
}

ProductPage.propTypes = {
  getCart: PropTypes.func.isRequired,   
  cart: PropTypes.object.isRequired,    
};

export default ProductPage