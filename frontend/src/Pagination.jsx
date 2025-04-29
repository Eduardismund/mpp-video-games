import { Link } from "react-router-dom";

/**
 *
 * @param {number} totalCount
 * @param {number} currentPage
 * @param {number} pageSize
 * @param {number} maxPageButtonsCount
 * @param {string} baseUri
 * @returns {JSX.Element}
 * @constructor
 */
function Pagination({ totalCount, currentPage, pageSize, maxPageButtonsCount, baseUri }) {
  const pageCount = Math.ceil(totalCount / pageSize);
  const pageItems = createPageItems(currentPage, pageCount, maxPageButtonsCount);

  return (
      <ul className="pagination">
        {pageItems.map((item, i) => (
            <li key={i} className={liClassName(item, currentPage)}>
              {item < 0 ? (
                  <span className="ellipsis">...</span>
              ) : (
                  <Link to={`${baseUri}/${item}`} className="page-link">
                    {item}
                  </Link>
              )}
            </li>
        ))}
      </ul>
  );
}

function liClassName(page, currentPage) {
  if (page < 1) {
    return "ellipsis";
  } else if (page === currentPage) {
    return "page current";
  } else {
    return "page";
  }
}

function createPageItems(currentPage, totalPages, maxVisibleButtons) {
  const pagination = [];
  const delta = 2;

  if (totalPages <= maxVisibleButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.push(i);
    }
  } else {
    let left = Math.max(2, currentPage - delta);
    let right = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage - delta > 2) {
      pagination.push(1, -1);
    } else {
      for (let i = 1; i < left; i++) {
        pagination.push(i);
      }
    }

    for (let i = left; i <= right; i++) {
      pagination.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      pagination.push(-1, totalPages);
    } else {
      for (let i = right + 1; i <= totalPages; i++) {
        pagination.push(i);
      }
    }
  }
  return pagination;
}

export default Pagination;
