
import PropTypes from "prop-types";
function Pagination({
  pagination,
  onPageChange
}){
  
  const handlePageChange = (e, page) => {
    e.preventDefault();
    onPageChange(page);
  }
  
  return (
  <div className="d-flex justify-content-center">
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <a
            href="/"
            aria-label="Previous"
            className={`page-link ${pagination.has_pre ? '' : 'disabled'}`}
            onClick={(e) => handlePageChange(e, pagination.current_page - 1)}
          >
            上一頁
          </a>
        </li>

        {[...new Array(pagination.total_pages)].map((_, i) => (
          <li className="page-item" key={`${i}_page`}>
            <a
              href="/"
              className={`page-link ${i + 1 === pagination.current_page && 'active'}`}
              onClick={(e) => handlePageChange(e, i + 1)}
            >
              {i + 1}
            </a>
          </li>
        ))}

        <li className="page-item">
          <a
            href="/"
            aria-label="Next"
            className={`page-link ${pagination.has_next ? '' : 'disabled'}`}
            onClick={(e) => handlePageChange(e, pagination.current_page + 1)}
          >
            下一頁
          </a>
        </li>
      </ul>
    </nav>
  </div>
  )
}

Pagination.propTypes = {
  pagination: PropTypes.object.isRequired,
  onPageChange: PropTypes.func.isRequired, // 切換頁面的函數
};


export default Pagination;