import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { api } from '../api/api';
import validate from "validate.js";
import CheckoutForm from '../component/CheckoutForm';
import PropTypes from 'prop-types';

const CheckoutPage = ({getCart}) => {
  const navigate = useNavigate();

    const validateForm = (data) => {
      const validationErrors = validate(data);
      return validationErrors || {};
    };

  const onSubmit = async (data) => {
    const validationErrors = validateForm(data);
        if (Object.keys(validationErrors).length === 0) {
          const res = await api.order(data);
          try{
              Swal.fire({
                title: "送出訂單資料成功",
                text: `你的訂單編號為: ${res.data.orderId}`,
                icon: "success"
              }).then((result) => {
                if (result.isConfirmed) {
                  getCart();
                  navigate("/");
                }
              });
          } catch(error) {
            if(error.response?.data?.success === false){
              Swal.fire({
                title: "送出訂單資料失敗",
                icon: "error"
              })
            }
          }
        }
  };

  return (
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>結帳頁面</h2>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/')}
          >
            返回購物車清單
          </button>
        </div>
        <CheckoutForm onSubmit={onSubmit} />
      </div>
  );
};

CheckoutPage.propTypes = {
  getCart: PropTypes.func.isRequired,
}

export default CheckoutPage;
