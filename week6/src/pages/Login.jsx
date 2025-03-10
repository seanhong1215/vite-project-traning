import { useEffect, useState } from 'react';
import ProductPage from './Product';
import LoadingSpinner from '../component/Loading';
import { admin } from '../api/admin';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isAuthLogin, setisAuthLogin] = useState(false);
  const navigate = useNavigate();
  

   // api載入 loading..
   const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const init = async () => {
      const isLoggedIn = await admin.checkLogin();
      setisAuthLogin(isLoggedIn);
      setIsLoading(false);
    };
    init();
  }, []);

  // 表單輸入的帳號密碼資料
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

    // 取得登入的帳號密碼 value 綁定 useState 
    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    };

// 登入按鈕
  const handleSubmit = async (e) => {
    e.preventDefault();
    await admin.login(formData);
    setisAuthLogin(true);
    navigate("/product");
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isAuthLogin
        ? <ProductPage />
        : (
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
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                  <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">登入</button>
                </form>
              </div>
            </div>
            <p className="mt-5 mb-3 text-muted">&copy; 2025~∞ - 六角學院</p>
          </div>
        )
      }
    </>
  );
};

export default LoginPage; 