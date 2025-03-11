import ReactLoading from "react-loading";
import { currency } from "../utils/filter";
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { pushMessage } from "../redux/toastSlice";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useState, useEffect } from "react";

function ProductList() {
  const { getCart } = useContext(CartContext);
  const dispatch = useDispatch();


  const navigate = useNavigate();

    useEffect(() => {
      getProducts();
      getCart();
    }, []);

    // 設定初始產品資料
    const [products, setProducts] = useState([]);

    const [loadingCartId, setLoadingCartId] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [loadingProductId, setLoadingProductId] = useState(null);

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

  const handleViewDetails = async(productId) => {
    try {
      const res = await api.getProduct(productId);
      navigate(`/product-list/${productId}`, { state: { product: res.data.product } });
    } catch (error) {
      console.log(error);
      dispatch(
        pushMessage({
          text: "取得產品失敗",
          status: "error",
        })
      );
     }
  };

  return (
    <div className="container py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>產品列表</h2>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
              <th>圖片</th>
              <th>產品名稱</th>
              <th>價錢</th>
              <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                  <div
                    style={{
                      height: "100px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${product.imageUrl})`,
                    }}
                  />
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">
                  原價： {currency(product.origin_price)} 元
                </del>
                <div className="h5">特價： {currency(product.price)} 元</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleViewDetails(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <>
                        <ReactLoading
                          type="spin"
                          color="#6c757d"
                          height={20}
                          width={20}
                        />
                        <span className="ms-1">Loading...</span>
                      </>
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id, 1)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <ReactLoading
                        type="spin"
                        color="#dc3545"
                        height={20}
                        width={20}
                      />
                    ) : (
                      "加入購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default ProductList;