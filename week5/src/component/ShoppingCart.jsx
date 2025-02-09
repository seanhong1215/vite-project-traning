// Shopping Cart Component
import { currency } from "../utils/filter";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = ({ cart, deleteCartAll, deleteCart, updateCart }) => {
  const navigate = useNavigate();
  if (!cart?.carts || cart.carts.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="bi bi-cart text-muted" style={{ fontSize: '4rem' }}></i>
        </div>
        <h3 className="mb-4">購物車是空的</h3>
        <p className="text-muted mb-4">目前沒有商品，請回到商品列表繼續選購</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/vite-project-traning/week5')}
        >
          回到商品列表
        </button>
    </div>
    )
  }

  return (
    <div>
      <div className="text-end">
        <button
          className="btn btn-outline-danger"
          type="button"
          onClick={deleteCartAll}
        >
          清空購物車
        </button>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th>數量/單位</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((item) => (
            <tr key={item.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => deleteCart(item.id)}
                >
                  <i className="bi bi-x" /> 刪除
                </button>
              </td>
              <td>
                {item.product.title}

              </td>
              <td>
                <div className="input-group input-group-sm">
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    defaultValue={item.qty}
                    key={item.qty}
                    onChange={(e) => updateCart(item.id, Number(e.target.value))}
                  />
                  <div className="input-group-text">/{item.product.unit}</div>
                </div>
              </td>
              <td className="text-end">
                {currency(item.final_total)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計
            </td>
            <td className="text-end">{currency(cart?.total)}</td>
          </tr>
        </tfoot>
      </table>
      <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/vite-project-traning/week5/checkout')}
          >
            結帳
          </button>
    </div>
  );
};

ShoppingCart.propTypes = {
  cart: PropTypes.shape({
    total: PropTypes.number,
    final_total: PropTypes.number,
    carts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        qty: PropTypes.number.isRequired,
        final_total: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        coupon: PropTypes.bool,
        product: PropTypes.shape({
          title: PropTypes.string.isRequired,
          unit: PropTypes.string.isRequired
        }).isRequired
      })
    )
  }),
  deleteCartAll: PropTypes.func.isRequired,
  deleteCart: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
};

export default ShoppingCart;