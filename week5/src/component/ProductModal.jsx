/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as bootstrap from 'bootstrap';
// import { api } from '../api/api';
// import Swal from 'sweetalert2';

function ProductModal({
  product, addCart, onCloseModal
}) {
  const [cartQuantity, setCartQuantity] = useState(1);

  // 操作 Modal DOM 元素
  const productModalRef = useRef(null);

  useEffect(() => {
    // 初始化 Modal
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });
  }, []);

  return (
    <div
      id="productModal"
      className="modal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      ref={productModalRef}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header">
              <h5 className="modal-title">產品名稱：{product?.title}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onCloseModal}
              />
          </div>
          <div className="modal-body">
            <img className="w-100" src={product?.imageUrl} alt={product?.title} />
            <p className="mt-3">產品內容：{product?.content}</p>
            <p>產品描述：{product?.description}</p>
            <p>
              價錢：<del>原價 ${product?.origin_price}</del>，特價：$
              {product?.price}
            </p>
            <div className="d-flex align-items-center">
              <label style={{ width: "150px" }}>購買數量：</label>
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => setCartQuantity((prev) => (prev === 1 ? prev : prev - 1))}
              >
                -
              </button>
              <input
                className="form-control"
                type="number"
                value={cartQuantity}
                min="1"
                max="10"
                onChange={(e) => setCartQuantity(Number(e.target.value))}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setCartQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addCart(product?.id, cartQuantity)}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


ProductModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    origin_price: PropTypes.number,
    price: PropTypes.number
  }),
  addCart: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired
};

export default ProductModal;