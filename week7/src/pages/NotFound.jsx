import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 text-danger">404</h1>
      <h2>找不到頁面</h2>
      <p className="lead">很抱歉，您訪問的頁面不存在。</p>
      <Link to="/" className="btn btn-primary">
        返回首頁
      </Link>
    </div>
  );
}

export default NotFound;
