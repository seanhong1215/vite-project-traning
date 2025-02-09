
const LoadingSpinner = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      {/* Bootstrap Spinner */}
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;