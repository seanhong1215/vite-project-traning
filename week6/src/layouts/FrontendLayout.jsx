import { Outlet } from 'react-router-dom';


const FrontendLayout = () => {
  return (
    <>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
};

export default FrontendLayout;
