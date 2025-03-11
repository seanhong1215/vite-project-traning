import PropTypes from 'prop-types';

function ProductList({
  products,
  onEditProduct,
}) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>分類</th>
          <th>產品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>啟用</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.category}</td>
            <td>{product.title}</td>
            <td>{product.origin_price}</td>
            <td>{product.price}</td>
            <td>
              {product.is_enabled
                ? <span className="text-success">啟用</span>
                : <span className="text-secondary">未啟用</span>
              }
            </td>
            <td>
              <div className="btn-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => onEditProduct('update', product)}>
                  編輯
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onEditProduct('delete', product)}>
                  刪除
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onEditProduct: PropTypes.func.isRequired,
};

export default ProductList;