import { useState, useEffect, useRef } from 'react'
import ProductList from '../component/ProductList'
import Pagination from '../component/Pagination'
import ProductModal from '../component/ProductModal';
import LoginPage from '../pages/Login'
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { admin } from '../api/admin';
import { api } from '../api/api';

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
  // check 登入
  const [isAuthLogin, setisAuthLogin] = useState(false);

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

  useEffect(() => {
    const init = async () => {
      const isLoggedIn = await admin.checkLogin();
      setisAuthLogin(isLoggedIn);
      getProductData();
    };
    init();

    // 初始化 Modal
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });
  }, []);

  // page = 1 帶入分頁
  const getProductData = async (page = 1) => {
    await api
      .getProductData(page)
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "取得產品失敗",
            icon: "error"
          })
        }
      });
  };

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

    await api
      .createProductData(productData)
      .then((response) => {
        closeModal();
        getProductData();
        if(response?.data?.success === true){
          Swal.fire({
            title: "新增產品成功",
            icon: "success"
          })
        }
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "新增產品失敗",
            icon: "error"
          })
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

    await api
      .updateProductData(productData)
      .then((response) => {
        closeModal();
        getProductData();
        if(response?.data?.success === true){
          Swal.fire({
            title: "更新產品成功",
            icon: "success"
          })
        }
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "更新產品失敗",
            icon: "error"
          })
        }
      });
  }

  // 刪除產品
  const delProductData = async (product) => {
    await api
      .delProductData(product.id)
      .then((response) => {
        closeModal();
        getProductData();
        if(response?.data?.success === true){
          Swal.fire({
            title: "刪除產品成功",
            icon: "success"
          })
        }
      })
      .catch((error) => {
        if(error.response?.data?.success === false){
          Swal.fire({
            title: "刪除產品失敗",
            icon: "error"
          })
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
      {isAuthLogin
        ? (
          <div className="container">
            <div className="text-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => openModal('create', initProduct)}>
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
              onPageChange={getProductData}
            />
          </div>
        )
        : (<LoginPage />)
      }

      <ProductModal
        mode={modalMode}
        product={formData}
        onCloseModal={closeModal}
        onEditProduct={setFormData}
        oncreateProductData={createProductData}
        onupdateProductData={updateProductData}
        ondelProductData={delProductData}
      />
    </>
  );
}

export default ProductPage