import React from 'react';
import PropTypes from 'prop-types';
import './pagination.scss';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);


    return (
        <div className="pagination">
            <button
                className="pagination__button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Prev
            </button>
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={`pagination__button ${currentPage === page ? 'pagination__button--active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button
                className="pagination__button"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
};


Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};


export default Pagination;