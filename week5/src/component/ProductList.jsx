import PropTypes from 'prop-types';
import ReactLoading from "react-loading";
import { currency } from "../utils/filter";
import Swal from 'sweetalert2';


function ProductList({
  products, openModal, addCart, loadingProductId, loadingCartId
}) {
  const handleAddToCart = async (productId, qty) => {
    await addCart(productId, qty);
    if(productId){
       Swal.fire({
        title: "加入購物車成功",
        icon: "success"
      })
    }
  };
    
  return (
    <table className="table align-middle">
      <thead>
        <tr>
            <th>圖片</th>
            <th>產品名稱</th>
            <th>價錢</th>
            <th></th>
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
                  onClick={() => openModal(product.id)}
                  disabled={loadingProductId === product.id}
                >
                  {loadingProductId === product.id ? (
                    <ReactLoading
                      type="spin"
                      color="#6c757d"
                      height={20}
                      width={20}
                    />
                  ) : (
                    "查看更多"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleAddToCart(product.id, 1)}
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
  );

}

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      origin_price: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired
    })
  ).isRequired,
  openModal: PropTypes.func.isRequired,
  addCart: PropTypes.func.isRequired,
  loadingProductId: PropTypes.string,
  loadingCartId: PropTypes.string
};

export default ProductList;