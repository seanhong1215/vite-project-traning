import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { useContext } from "react";
import axios from 'axios';
// 環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const { cart } = useContext(CartContext);

  // 登出功能
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`);
      // setIsLogin(false);
    } catch (error) {
      console.log(error);
      alert("登出失敗");
    }
  };

  return (
    <nav className="navbar navbar-light bg-light px-3 mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">我的商店</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">首頁</a>
            </li>
            <li className="nav-item">
            <Link className="btn btn-outline-primary" to="/cart">
              購物車 {cart?.carts.length}
            </Link>
            </li>
          </ul>
          <button className="btn btn-primary">登入</button>
          {/* 如果已登入，顯示登出按鈕 */}
          <button className="btn btn-danger" onClick={handleLogout}>登出</button>
        </div>

        {/* <Link className="btn btn-outline-primary" to="/cart">
          購物車 ({cartCount})
        </Link> */}
      </div>
    </nav>
  );
}


export default Navbar
