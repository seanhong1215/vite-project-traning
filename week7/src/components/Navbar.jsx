import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { useContext } from "react";
import axios from 'axios';
import { pushMessage } from "../redux/toastSlice";
import { useDispatch } from "react-redux";

// 環境變數
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 登出功能
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`);
      dispatch(
        pushMessage({
          text: "登出成功",
          status: "success",
        })
      );
      navigate('/login');
     
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3 mb-4">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
            <Link className="navbar-brand fw-bold" to="/product">
            首頁
            </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link className="btn btn-outline-primary position-relative" to="/product-list">
              產品列表
            </Link>
            <Link className="btn btn-outline-primary position-relative" to="/cart">
              購物車
              {cart?.carts.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.carts.length}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </Link>
          
              <button className="btn btn-danger" onClick={handleLogout}>
                登出
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


export default Navbar
