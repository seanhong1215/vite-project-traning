import { Outlet, useNavigate  } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import PropTypes from 'prop-types';


const FrontendLayout = ({cart, isLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/login', { replace: true });
    }
  }, [isLogin, navigate]);

  return (
    <>
      <main className="container">
        <Navbar cartCount={cart?.carts?.length} isLogin={isLogin} />
        <Outlet />
      </main>
    </>
  )
};

FrontendLayout.propTypes = {
  cart: PropTypes.object.isRequired,    
  isLogin: PropTypes.bool.isRequired, 
};

export default FrontendLayout;
