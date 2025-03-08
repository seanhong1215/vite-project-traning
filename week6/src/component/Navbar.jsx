import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar navbar-light bg-light px-3 mb-4">
      <Link className="navbar-brand" to="/">首頁</Link>
      <Link className="btn btn-outline-primary" to="/cart">
        購物車 ({cartCount})
      </Link>
    </nav>
  );
}
Navbar.propTypes = {
  cartCount: PropTypes.number.isRequired,   
};

export default Navbar