import { useEffect, useRef, useState } from "react";
import axios from "axios";

import * as bootstrap from "bootstrap";
import ProductModal from "./component/ProductModal";
import Pagination from "./component/Pagination";

import "./assets/style.css";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "benny";

function App() {
 
  const [pagination, setPagination] = useState({
    total_pages: 5,
    current_page: 1,
    has_pre: false,
    has_next: true,
  });

  // 設定錯誤訊息
  const [error, setError] = useState(null);

  // api載入 loading..
  const [isLoading, setIsLoading] = useState(false);

  // 表單輸入的帳號密碼資料
  const [formData, setFormData] = useState({
    username: "bennyhong@gmail.com",
    password: "bennyhong",
  });

  // check 登入
  const [isAuthLogin, setisAuthLogin] = useState(false);

  // 設定初始產品資料
  const [products, setProducts] = useState([]);

  // modal 相關
  const modalElementRef = useRef(null);
  
  const [modalType, setModalType] = useState("");
  const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  });

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    // 建立 axios 實例
    axios.defaults.headers.common.Authorization = token;

    // 初始化 Modal
    modalElementRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    document.querySelector('#productModal').addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    checkAdmin();

  }, []);

  // templateData 改變時，執行 useEffect 內的程式碼(只執行一次)
  useEffect(() => {}, [templateData]);

  // 處理檢查登入的按鈕邏輯
  const checkAdmin = async() =>{
      setIsLoading(true);
      setError(null);
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        setisAuthLogin(true);
        getProductData();
      } catch (error) {
        const errorMessage = error.response?.data?.message || '驗證失敗';
        setError(`登入驗證失敗: ${errorMessage}`);
        setisAuthLogin(false);
      } finally {
        setIsLoading(false);
      }
  }

  // 打開 Modal
  const openModal = (product, type) => {
    if (!modalElementRef.current) return;
    // 確保 modalElementRef.current 是 Bootstrap Modal 實例
    if (!modalElementRef.current || !(modalElementRef.current instanceof bootstrap.Modal)) {
      modalElementRef.current = new bootstrap.Modal(modalElementRef.current);
    }

    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      origin_price: product.origin_price || "",
      price: product.price || "",
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || false,
      imagesUrl: product.imagesUrl || [],
    });
    modalElementRef.current.show();
    setModalType(type);
  };

  // 關閉 Modal
  const closeModal = () => {
    modalElementRef.current.hide();
  };

  const handleFileChange = async (e) => {
    const url = `${API_BASE}/api/${API_PATH}/admin/upload`;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      let res = await axios.post(url, formData);
      const uploadedImageUrl = res.data.imageUrl;

      setTemplateData((prevTemplateData) => ({
        ...prevTemplateData,
        imageUrl: uploadedImageUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  // 觸發 onChange 事件的 input 元素
  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateData((prevData) => ({
      ...prevData, // 展開 templateData
      // 取得 input 的 id，用來對應 state 中的 key。
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // 動態管理圖片輸入框
  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      let newImages = [...prevData.imagesUrl]; // 存放圖片 URL
      newImages[index] = value.trim(); // 去掉前後空格;

      // 自動新增新的輸入框
      if (value.trim() && index === newImages.length - 1 && newImages.length < 5) {
        newImages.push("");
      }

      // 自動刪除多餘的空輸入框
      if (newImages.length > 1 && newImages[newImages.length - 1] === "") {
        newImages.pop();
      }

      // 更新 templateData
      return { ...prevData, imagesUrl: newImages };
    });
  };

  // 新增圖片
  const handleAddImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ""],
    }));
  };

  // 移除圖片
  const handleRemoveImage = () => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

   // 取得產品資料
  const getProductData = async (page = 1) => {
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('取得產品失敗:', error.response.data.message);
    }
  };

  // 編輯更新產品資料
  const updateProductData = async (id) => {
    let product;
    if (modalType === "edit") {
      product = `product/${id}`;
    } else {
      product = `product`;
    }

    const url = `${API_BASE}/api/${API_PATH}/admin/${product}`;

    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: templateData.imagesUrl,
      },
    };

    try {
      let response;
      if (modalType === "edit") {
        response = await axios.put(url, productData);
        console.log("更新成功", response.data);
      } else {
        response = await axios.post(url, productData);
        console.log("新增成功", response.data);
      }

      modalElementRef.current.hide();
      getProductData();
    } catch (err) {
      if (modalType === "edit") {
        console.error("更新失敗", err.response.data.message);
      } else {
        console.error("新增失敗", err.response.data.message);
      }
    }
  };

  // 刪除產品資料
  const delProductData = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      );
      console.log("刪除成功", response.data);
      modalElementRef.current.hide();
      getProductData();
    } catch (err) {
      console.error("刪除失敗", err.response.data.message);
    }
  };

  // 取得登入的帳號密碼 value 綁定 useState 
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // 登入按鈕邏輯
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      getProductData();
      setisAuthLogin(true);
    } catch (error) {
      setError('登入失敗:', error.response.data.message);
    }
  };



  // change 分頁
  const changePage = (page) => {
    if (page < 1 || page > pagination.total_pages) return;
    setPagination({
      ...pagination,
      current_page: page,
      has_pre: page > 1,
      has_next: page < pagination.total_pages,
    });
  };


 
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }





  return (
    <>
      {isAuthLogin ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={() => openModal("new")}>建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <td>{product.title}</td>
                  <td className="text-end">{product.origin_price}</td>
                  <td className="text-end">{product.price}</td>
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
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(product, "edit")}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal(product, "delete")}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            <Pagination pagination={pagination} changePage={changePage} />
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                    />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                  >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2025~∞ - 六角學院</p>
        </div>
      )}
      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        ref={modalElementRef}
        >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
          <div
              className={`modal-header ${
                modalType === "delete" ? "bg-danger" : "bg-dark"
              } text-white`}
            >
              <h5 id="productModalLabel" className="modal-title">
                <span>
                  {modalType === "delete"
                    ? "刪除產品"
                    : modalType === "edit"
                    ? "編輯產品"
                    : "新增產品"}
                </span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
              {modalType === "delete" ? (
                <p className="h4">
                  確定要刪除
                  <span className="text-danger">{templateData.title}</span>
                  嗎?
                </p>
              ) : (
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="imageUrl"
                          placeholder="請輸入圖片連結"
                          value={templateData.imageUrl}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <img
                        className="img-fluid"
                        src={templateData.imageUrl}
                        alt="主圖"
                      />
                    </div>
                    <div>
                      {templateData.imagesUrl.map((image, index) => (
                        <div key={index} className="mb-2">
                          <input
                            type="text"
                            value={image}
                            onChange={(e) =>
                              handleImageChange(index, e.target.value)
                            }
                            placeholder={`圖片網址 ${index + 1}`}
                            className="form-control mb-2"
                          />
                          {image && (
                            <img
                              src={image}
                              alt={`副圖 ${index + 1}`}
                              className="img-preview mb-2"
                            />
                          )}
                        </div>
                      ))}

                      <div className="d-flex justify-content-between">
                        {templateData.imagesUrl.length < 5 &&
                          templateData.imagesUrl[
                            templateData.imagesUrl.length - 1
                          ] !== "" && (
                            <button
                              className="btn btn-outline-primary btn-sm w-100"
                              onClick={handleAddImage}
                            >
                              新增圖片
                            </button>
                          )}

                        {templateData.imagesUrl.length >= 1 && (
                          <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={handleRemoveImage}
                          >
                            取消圖片
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        標題
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        value={templateData.title}
                        onChange={handleModalInputChange}
                      />
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <input
                          id="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={templateData.category}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          value={templateData.unit}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          id="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={templateData.origin_price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          id="price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={templateData.price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        產品描述
                      </label>
                      <textarea
                        id="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={templateData.description}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        說明內容
                      </label>
                      <textarea
                        id="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        value={templateData.content}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          id="is_enabled"
                          className="form-check-input"
                          type="checkbox"
                          checked={templateData.is_enabled}
                          onChange={handleModalInputChange}
                        />
                        <label className="form-check-label" htmlFor="is_enabled">
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={() => closeModal()}
              >
                取消
              </button>
              {modalType === "delete" ? (
                <div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => delProductData(templateData.id)}
                  >
                    刪除
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => updateProductData(templateData.id)}
                  >
                    確認
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProductModal
        modalType={modalType}
        templateData={templateData}
        onCloseModal={closeModal}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onUpdateProduct={updateProductData}
        onDeleteProduct={delProductData}
      />
    </>
  );
}

export default App;
