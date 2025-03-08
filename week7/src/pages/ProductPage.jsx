import axios from "axios";
import { useEffect, useState } from "react";
// import Pagination from "../components/Pagination";
// import ProductModal from "../components/ProductModal";
// import DelProductModal from "../components/ProductModalDel";
// import Toast from "../components/Toast";
import ReactLoading from "react-loading";
import PropTypes from "prop-types";

// 環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// Modal 初始狀態
const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductPage({ setIsLogin }) {
    // 設定錯誤訊息
    const [error, setError] = useState(null);
  // 存放產品列表的狀態
  const [productList, setProductList] = useState([]);

  // 螢幕 loading
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 獲取產品列表
  // 向後端 API 取得產品列表，並更新 productList
  const getProducts = async (page = 1) => {
    try {
      setIsScreenLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProductList(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 檢查登入狀態
  // 驗證使用者是否已登入，如果登入成功，則載入產品列表。
  const checkIsLogin = async () => {
    setError(null);
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("hexToken="))?.split("=")[1];
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.post(`${BASE_URL}/api/user/check`);
      if(res.data.success === true){
        // 根據登入狀態設置顏色
        // setButtonClass(token ? 'btn-success' : 'btn-danger');
        alert("登入成功");
      }
    } catch (error) {
      setError('登入檢查失敗:', error);
      // setButtonClass('btn-danger');
    }
  };

  // 初始掛載時檢查登入
  // 當元件掛載時，從 cookie 取得 token，設置 Authorization，並檢查是否已登入。
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    axios.defaults.headers.common["Authorization"] = token;

    checkIsLogin();
  }, []);

  //  ——————— 加入產品 Modal ———————

  // 記錄當前 Modal 是 "create" 還是 "edit"
  const [modalMode, setmodalMode] = useState(null);

  // 產品 Modal 狀態是開或關
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // 刪除產品 Modal 狀態是開或關
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  // 打開產品 Modal
  const handleOpenProductModal = (mode, product) => {
    setmodalMode(mode);

    switch (mode) {
      // mode === "create" 時，設置空白的產品表單
      case "create":
        setTempProduct(defaultModalState);
        break;

      // mode === "edit" 時，載入選中的產品資料
      case "edit":
        setTempProduct(product);
        break;

      default:
        break;
    }

    setIsProductModalOpen(true);
  };

  // 打開刪除產品 Modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);

    setIsDelProductModalOpen(true);
  };

  const [tempProduct, setTempProduct] = useState(defaultModalState);

  // 分頁狀態
  const [pageInfo, setPageInfo] = useState({});

  // 換頁功能
  const handlePageChange = (page) => {
    getProducts(page);
  };

  // 登出功能
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`);
      setIsLogin(false);
    } catch (error) {
      console.log(error);
      alert("登出失敗");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row mb-4">
          <div className="justify-content-end">
            <button
              onClick={handleLogout}
              type="button"
              className="btn btn-secondary"
            >
              登出
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2 className="fw-bold">產品列表</h2>
              <button
                onClick={() => handleOpenProductModal("create")}
                type="button"
                className="btn btn-primary"
              >
                建立新的產品
              </button>
            </div>
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">編輯 / 刪除</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() =>
                            handleOpenProductModal("edit", product)
                          }
                          type="button"
                          className="btn btn-outline-primary btn-sm me-2"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} /> */}
      </div>

      {/* <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        getProducts={getProducts}
      /> */}

      {/* <DelProductModal
        tempProduct={tempProduct}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
        getProducts={getProducts}
      /> */}

      {/* <Toast /> */}

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


ProductPage.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};

export default ProductPage;