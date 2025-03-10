import { Outlet } from 'react-router-dom';
import Navbar from '../component/Navbar';
import PropTypes from 'prop-types';

const FrontendLayout = ({cart}) => {
  return (
    <>
      <main className="container">
        <Navbar cartCount={cart?.carts?.length} />
        <Outlet />
      </main>
    </>
  )
};

FrontendLayout.propTypes = {
  cart: PropTypes.object.isRequired,    
};

export default FrontendLayout;
