
function App() {

  const API_BASE = "https://ec-course-api.hexschool.io/v2";
  const API_PATH = "benny";

  // 表單輸入的帳號密碼資料
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const [isAuthLogin, setisAuthLogin] = React.useState(false);
  
  // 設定初始產品資料
  const [products, setProducts] = React.useState([]);
  // 設定存入產品資料
  const [tempProduct, setTempProduct] = React.useState(null);
  // 設定錯誤訊息
  const [error, setError] = React.useState(null);
  // 檢查登入成功按鈕換顏色
  const [buttonClass, setButtonClass] = React.useState('btn-danger');
  // 處理檢查登入的按鈕邏輯
  const checkLogin = async() =>{
    setError(null);
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("hexToken="))?.split("=")[1];
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.post(`${API_BASE}/api/user/check`);
      if(res.data.success === true){
        // 根據登入狀態設置顏色
        setButtonClass(token ? 'btn-success' : 'btn-danger');
        alert("登入成功");
      }
    } catch (error) {
      setError('登入檢查失敗:', error);
      setButtonClass('btn-danger');
    }
  }
  // 取得產品資料
  const getData = async () => {
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      setProducts(response.data.products);
    } catch (error) {
      setError('取得產品失敗:', error.response.data.message);
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
      getData();
      setisAuthLogin(true);
    } catch (error) {
      setError('登入失敗:', error.response.data.message);
    }
  };

  return (
    <>
      {isAuthLogin ? (
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6">
              <button
                className={`btn ${buttonClass} mb-5`}
                type="button"
                id="check"
                onClick={checkLogin}
              >
                確認是否登入
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setTempProduct(item)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.category}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl?.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className="images"
                          alt="副圖"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
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
    </>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
