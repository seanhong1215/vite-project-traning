/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as bootstrap from 'bootstrap';
import { api } from '../api/api';
import Swal from 'sweetalert2';

function ProductModal({
  mode,
  product,
  onCloseModal,
  onEditProduct,
  oncreateProductData,
  onupdateProductData,
  ondelProductData,
}) {

  // 操作 Modal DOM 元素
  const productModalRef = useRef(null);

  useEffect(() => {
    // 初始化 Modal
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file-to-upload', file);

    await api
      .uploadImage(formData)
      .then((res) => {
        onEditProduct((prevData) => ({
          ...prevData,
          imageUrl: res.data.imageUrl,
        }));
      })
      .catch((err) => {
        Swal.fire({
          title: '上傳失敗' + err.response.data.message,
          icon: "error"
        });
      });
  }

  // 新增圖片
  const handleAddImage = () => {
    onEditProduct((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.push("");
      return { ...prevData, imagesUrl: newImages };
    });
  }

  // 移除圖片
  const handleRemoveImage = () => {
    onEditProduct((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  }

  // 動態管理圖片輸入框
  const handleImageChange = (index, value) => {
    onEditProduct((prevData) => {
      const newImages = [...prevData.imagesUrl]; // 存放圖片 URL
      newImages[index] = value.trim(); // 去掉前後空格;
      return { ...prevData, imagesUrl: newImages };
    });
  }

  // 觸發 onChange 事件的 input 元素
  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    onEditProduct((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  }

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
          <ProductModalHeader mode={mode} />
          <ProductModalBody
            mode={mode}
            product={product}
            handleFileChange={handleFileChange}
            handleModalInputChange={handleModalInputChange}
            handleImageChange={handleImageChange}
            handleAddImage={handleAddImage}
            handleRemoveImage={handleRemoveImage}
          />
          <ProductModalFooter
            mode={mode}
            onCloseModal={onCloseModal}
            oncreateProductData={oncreateProductData}
            onupdateProductData={() => onupdateProductData(product)}
            ondelProductData={() => ondelProductData(product)}
          />
        </div>
      </div>
    </div>
  );
}

const ProductModalHeader = ({ mode }) => {
  return (
    <div className='modal-header'>
      <h3 id='productModalLabel' className='modal-title'>
        <span>
          {
            mode === 'create'
              ? '建立產品'
              : mode === 'update'
                ? '編輯產品'
                : mode === 'delete'
                  ? '刪除產品'
                  : null
          }
        </span>
      </h3>
      <button
        type='button'
        className='btn-close'
        data-bs-dismiss='modal'
        aria-label='Close'
      ></button>
    </div>
  );
}

const ProductModalBody = ({
  mode,
  product,
  handleFileChange,
  handleModalInputChange,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
}) => {
  return (
    <div className='modal-body'>
      {mode === 'delete'
        ? (
          <p className='h5'>
            確定要刪除
            <span className='text-danger'>{product.title}</span>
            嗎?
          </p>
        )
        : (
          <div className='row'>
            <div className='col-sm-4'>
              <div className='mb-3'>
                <label htmlFor='fileInput' className='form-label'> 圖片上傳 </label>
                <input
                  id='fileInput'
                  type='file'
                  accept='.jpg,.jpeg,.png'
                  className='form-control'
                  onChange={handleFileChange}
                />
              </div>
              <p>or</p>
              <div className='mb-3'>
                <label htmlFor='imageUrl' className='form-label'> 圖片連結 </label>
                <input
                  id='imageUrl'
                  type='text'
                  className='form-control mb-2'
                  placeholder='請輸入主圖連結'
                  value={product.imageUrl}
                  onChange={handleModalInputChange}
                />
                <img
                  className='img-fluid mb-2'
                  src={product.imageUrl}
                  alt='主圖'
                />
              </div>

              <div>
                {product.imagesUrl.map((image, index) => (
                  <div key={index} className='mb-2'>
                    <input
                      type='text'
                      className='form-control mb-2'
                      placeholder={`副圖連結 ${index + 1}`}
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                    />
                    {image && (
                      <img
                        src={image}
                        alt={`副圖 ${index + 1}`}
                        className='img-fluid mb-2'
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className='d-flex justify-content-between'>
                {product.imagesUrl.length < 5 && product.imagesUrl[product.imagesUrl.length - 1] !== "" && (
                  <button
                    className='btn btn-outline-primary btn-sm w-100'
                    onClick={handleAddImage}>新增副圖</button>
                )}
                {product.imagesUrl.length >= 1 && (
                  <button
                    className='btn btn-outline-danger btn-sm w-100'
                    onClick={handleRemoveImage}>取消副圖</button>
                )}
              </div>
            </div>
            <div className='col-sm-8'>
              <div className='mb-3'>
                <label htmlFor='title' className='form-label'> 標題 </label>
                <input
                  id='title'
                  type='text'
                  className='form-control'
                  placeholder='請輸入標題'
                  value={product.title}
                  onChange={handleModalInputChange}
                />
              </div>
              <div className='row mb-3'>
                <div className='col-md-6'>
                  <label htmlFor='category' className='form-label'> 分類 </label>
                  <input
                    id='category'
                    type='text'
                    className='form-control'
                    placeholder='請輸入分類'
                    value={product.category}
                    onChange={handleModalInputChange}
                  />
                </div>
                <div className='col-md-6'>
                  <label htmlFor='unit' className='form-label'> 單位 </label>
                  <input
                    id='unit'
                    type='text'
                    className='form-control'
                    placeholder='請輸入單位'
                    value={product.unit}
                    onChange={handleModalInputChange}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <label htmlFor='originPrice' className='form-label'> 原價 </label>
                  <input
                    id='originPrice'
                    type='number'
                    min='0'
                    className='form-control'
                    placeholder='請輸入原價'
                    value={product.originPrice}
                    onChange={handleModalInputChange}
                  />
                </div>
                <div className='col-md-6'>
                  <label htmlFor='price' className='form-label'> 售價 </label>
                  <input
                    id='price'
                    type='number'
                    min='0'
                    className='form-control'
                    placeholder='請輸入售價'
                    value={product.price}
                    onChange={handleModalInputChange}
                  />
                </div>
              </div>
              <hr />
              <div className='mb-3'>
                <label htmlFor='description' className='form-label'> 產品描述 </label>
                <textarea
                  id='description'
                  className='form-control'
                  placeholder='請輸入產品描述'
                  value={product.description}
                  onChange={handleModalInputChange}
                ></textarea>
              </div>
              <div className='mb-3'>
                <label htmlFor='content' className='form-label'> 說明內容 </label>
                <textarea
                  id='content'
                  className='form-control'
                  placeholder='請輸入說明內容'
                  value={product.content}
                  onChange={handleModalInputChange}
                ></textarea>
              </div>
              <div className='mb-3'>
                <div className='form-check'>
                  <label className='form-check-label' htmlFor='isEnabled'> 是否啟用 </label>
                  <input
                    id='isEnabled'
                    type='checkbox'
                    className='form-check-input'
                    checked={product.isEnabled}
                    onChange={handleModalInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

const ProductModalFooter = ({
  mode,
  onCloseModal,
  oncreateProductData,
  onupdateProductData,
  ondelProductData,
}) => {
  return (
    <div className='modal-footer'>
      <button
        type='button'
        className='btn btn-outline-secondary'
        onClick={onCloseModal}>
        取消
      </button>
      {
        mode === 'create'
          ? <button
            type='button'
            className='btn btn-primary'
            onClick={oncreateProductData}>
            新增
          </button>
          : mode === 'update'
            ? <button
              type='button'
              className='btn btn-primary'
              onClick={onupdateProductData}>
              更新
            </button>
            : mode === 'delete'
              ? <button
                type='button'
                className='btn btn-danger'
                onClick={ondelProductData}>
                刪除
              </button>
              : null
      }
    </div>
  );
}

ProductModal.propTypes = {
  mode: PropTypes.string,
  product: PropTypes.object,
  onCloseModal: PropTypes.func.isRequired,
  onEditProduct: PropTypes.func.isRequired,
  oncreateProductData: PropTypes.func.isRequired,
  onupdateProductData: PropTypes.func.isRequired,
  ondelProductData: PropTypes.func.isRequired,
};

export default ProductModal;