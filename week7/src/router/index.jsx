import { createHashRouter, Navigate  } from "react-router-dom";
import Login from "../pages/LoginPage";
// import AdminPage from "../adminPages/AdminPage.jsx";
// import Home from "../pages/Home";
// import ProductDetailPage from "../pages/ProductDetailPage";
// import UserProductPage from "../pages/UserProductPage";
// import Carts from "../pages/Carts"

const routes = [
    {
        path:'/',
        element: <Navigate to="/login" replace />, // 預設導向 /login
    },
    {
        path:'/login',
        element:<Login />
    }
]

const router = createHashRouter(routes)

export default router;