import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { admin } from '../api/admin';

function LoginPage({ setIsLogin }) {
  // api載入 loading..
  // const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  // 存放登入時的帳號與密碼
  const [account, setAccount] = useState({
    username: "benny@gmail.com",
    password: "benny1215",
  });

  // 處理帳號輸入
  // 更新 account 狀態，讓使用者輸入帳號密碼時即時更新
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAccount((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // 登入功能
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await admin.login(account);
      setIsLogin(true);
      navigate("/product"); // 登入後跳轉到 product 頁面
    } catch (error) {
      console.log(error);
      alert("登入失敗");
    }
  };



  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input
            name="username"
            value={account.username}
            onChange={handleInputChange}
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            name="password"
            value={account.password}
            onChange={handleInputChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

LoginPage.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};



export default LoginPage;