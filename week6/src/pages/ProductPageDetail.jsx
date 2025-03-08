import { useEffect, useState } from 'react';
import { api } from '../api/api';
import "../assets/style.css"; 
import Swal from 'sweetalert2';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProductDetail({ cart, getCart }) {
  const [cartQuantity, setCartQuantity] = useState(1);
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!product) {
      // 若無 product 資料，從 API 重新獲取
      api.getProduct(id).then((res) => setProduct(res.data.product));
    }
  }, [id, product]);

  // 加入購物車
  const addCart = async (id, num) => {
    const data = {
      product_id: id,
      qty: num,
    };
    await api.addCart(data);
      try {
        getCart();
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

  if (!product) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>產品詳細資料</h2>
        <div className="d-flex gap-2">
        <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/')}
          >
            返回商品列表
          </button>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/cart')}
          >
            查看購物車 ({cart?.carts?.length})
          </button>
        </div>
      </div>
      <div className="product-card">
        {/* 左側圖片 */}
        <div className="product-image">
          <img src={product?.imageUrl} alt={product?.title} />
        </div>

        {/* 右側內容 */}
        <div className="product-info">
          <h2 className="product-title">{product?.title}</h2>
          <p className="product-content">{product?.content}</p>
          <p className="product-description">{product?.description}</p>
          <p className="product-price">
            <del>${product?.origin_price}</del> <span className="sale-price">${product?.price}</span>
          </p>

          {/* 數量選擇區塊 */}
          <div className="quantity-control">
            <button
              className="quantity-btn"
              type="button"
              onClick={() => setCartQuantity((prev) => (prev === 1 ? prev : prev - 1))}
            >
              -
            </button>
            <input
              className="quantity-input"
              type="number"
              value={cartQuantity}
              min="1"
              max="10"
              onChange={(e) => setCartQuantity(Number(e.target.value))}
            />
            <button
              className="quantity-btn"
              type="button"
              onClick={() => setCartQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>

          {/* 加入購物車按鈕 */}
          <button className="add-to-cart" onClick={() => addCart(product?.id, cartQuantity)}>
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

ProductDetail.propTypes = {
  getCart: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,    
};



export default ProductDetail;




