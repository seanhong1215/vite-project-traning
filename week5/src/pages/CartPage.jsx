import ShoppingCart from '../component/ShoppingCart'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


const CartPage = ({ 
  cart, 
  deleteCartAll, 
  deleteCart, 
  updateCart, 
}) => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>購物車</h2>
        {(cart?.carts && cart.carts.length > 0) && (
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/vite-project-traning/week5')}
          >
            返回商品列表
          </button>
        )}
      </div>
      <ShoppingCart
        cart={cart}
        deleteCartAll={deleteCartAll}
        deleteCart={deleteCart}
        updateCart={updateCart}
      />
    </div>
  );
};

CartPage.propTypes = {
  cart: PropTypes.shape({
    total: PropTypes.number,
    final_total: PropTypes.number,
    carts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      qty: PropTypes.number.isRequired,
      product: PropTypes.shape({
        title: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired
      }).isRequired
    }))
  }).isRequired,
  deleteCartAll: PropTypes.func.isRequired,
  deleteCart: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
};


export default CartPage