
import { useEffect, useState, useRef } from "react";
import ProductList from '../components/ProductList'
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import * as bootstrap from 'bootstrap';
import Toast from "../components/Toast";
import ReactLoading from "react-loading";
import { admin } from '../api/admin';
import axios from 'axios';
import { pushMessage } from "../redux/toastSlice";
import { useDispatch } from "react-redux";

// 管理產品表單的初始狀態
const initProduct = {
  id: "",
  title: "",
  category: "",
  unit: "",
  originPrice: 0,
  price: 0,
  description: "",
  content: "",
  isEnabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function ProductPage() {

    const dispatch = useDispatch();

    // 設定錯誤訊息
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);

    // 設定初始產品資料
    const [products, setProducts] = useState([]);

    // 設定分頁資料
    const [pagination, setPagination] = useState({});
    
    // 設定 Modal 資料
    const [modalMode, setModalMode] = useState(null);
    
    // 帶入 Modal 資料 => 存放當前的產品資料
    const [formData, setFormData] = useState(initProduct);
   
     // 操作 Modal DOM 元素
    const productModalRef = useRef(null);

    // 螢幕 loading
    const [isScreenLoading, setIsScreenLoading] = useState(false);


  // 獲取產品列表
  const getProducts = async (page = 1) => {
    try {
      setIsScreenLoading(true);
      const res = await admin.getProductData(page);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScreenLoading(false);
    }
  };


  // 初始掛載時檢查登入
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("authToken"); // 從 localStorage 取得 token
      if (token) {
        axios.defaults.headers.common["Authorization"] = token;
        getProducts();
      }
    };
    init();

    // 初始化 Modal
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });
  }, []);


// 新增產品
  const createProductData = async () => {
    const productData = {
      data: {
        ...formData, // 複製 formData 內的所有屬性
        origin_price: Number(formData.originPrice),
        price: Number(formData.price),
        is_enabled: formData.isEnabled ? 1 : 0,
        imagesUrl: formData.imagesUrl,
      },
    };

    await admin
      .createProductData(productData)
      .then((response) => {
        closeModal();
        getProducts();
        if(response?.data?.success === true){
          dispatch(
            pushMessage({
              text: "新增產品成功",
              status: "success",
            })
          );
        }
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          dispatch(
            pushMessage({
              text: "新增產品失敗",
              status: "error",
            })
          );
        }
      });
  }

  // 更新產品
  const updateProductData = async (product) => {
    const productData = {
      data: {
        ...product,
        origin_price: Number(product.originPrice),
        price: Number(product.price),
        is_enabled: product.isEnabled ? 1 : 0,
        imagesUrl: product.imagesUrl,
      },
    };

    await admin
      .updateProductData(productData)
      .then((response) => {
        closeModal();
        getProducts();
        if(response?.data?.success === true){
          dispatch(
            pushMessage({
              text: "更新產品成功",
              status: "success",
            })
          );
        }
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          dispatch(
            pushMessage({
              text: "更新產品失敗",
              status: "error",
            })
          );
        }
      });
  }

  // 刪除產品
  const delProductData = async (product) => {
    await admin
      .delProductData(product.id)
      .then((response) => {
        closeModal();
        getProducts();
        if(response?.data?.success === true){
          dispatch(
            pushMessage({
              text: "刪除產品成功",
              status: "success",
            })
          );
        }
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          dispatch(
            pushMessage({
              text: "刪除產品失敗",
              status: "error",
            })
          );
        }
      });
  }

  // 打開 Modal
  const openModal = (mode, product) => {
    setModalMode(mode);
    setFormData({
      ...product,
      originPrice: product.origin_price || 0,
      isEnabled: product.is_enabled === 1,
      imagesUrl: product.imagesUrl || [],
    });
    productModalRef.current.show();
  }

  // 關閉 Modal
  const closeModal = () => {
    productModalRef.current.hide();
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2 className="fw-bold">產品列表</h2>
              <button
                onClick={() => openModal('create', initProduct)}
                type="button"
                className="btn btn-primary"
              >
                建立產品
              </button>
            </div>
            <div className="mt-4">
              <ProductList
                products={products}
                onEditProduct={openModal}
              />
            </div>
            <Pagination
              pagination={pagination}
              onPageChange={getProducts}
            />
            
          </div>
        </div>

      </div>

       <ProductModal
        mode={modalMode}
        product={formData}
        onCloseModal={closeModal}
        onEditProduct={setFormData}
        oncreateProductData={createProductData}
        onupdateProductData={updateProductData}
        ondelProductData={delProductData}
      />


      <Toast />

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </>
  );
}


export default ProductPage;