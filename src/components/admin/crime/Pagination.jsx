import React from 'react';

const Pagination = ({ currentPage, totalPages, maxDisplay, onPageChange }) => {
    const pagination = [];

    // Add the first page
    pagination.push(
        <button key={1} onClick={() => onPageChange(1)} className={`hover:underline ${currentPage === 1 ? 'font-bold text-lg' : ''}`}>
            1
        </button>
    );

    // Add ellipsis if there are pages before the current range
    if (currentPage - Math.floor(maxDisplay / 2) > 2) {
        pagination.push('...');
    }

    // Add pages within the range
    for (let page = Math.max(2, currentPage - Math.floor(maxDisplay / 2)); page <= Math.min(totalPages - 1, currentPage + Math.floor(maxDisplay / 2)); page++) {
        pagination.push(
            <button key={page} onClick={() => onPageChange(page)} className={`hover:underline ${currentPage === page ? 'font-bold text-lg' : ''}`}>
                {page}
            </button>
        );
    }

    // Add ellipsis if there are pages after the current range
    if (currentPage + Math.floor(maxDisplay / 2) < totalPages - 1) {
        pagination.push('...');
    }

    console.log(totalPages)

    // Add the last page
    pagination.push(
        <button key={totalPages} onClick={() => onPageChange(totalPages)}
            className={`hover:underline ${currentPage === totalPages ? 'font-bold text-lg' : ''}`}>
            {totalPages}
        </button>
    );

    return <>{pagination}</>
};

export default Pagination;