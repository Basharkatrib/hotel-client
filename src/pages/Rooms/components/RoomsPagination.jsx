import React from 'react';

const RoomsPagination = ({ pagination, currentPage, onPageChange }) => {
  if (pagination.last_page <= 1) return null;

  return (
    <>
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
            let pageNum;
            if (pagination.last_page <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= pagination.last_page - 2) {
              pageNum = pagination.last_page - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pagination.last_page}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Next
        </button>
      </div>

      {/* Pagination Info */}
      {pagination.total > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
          Showing {pagination.from} to {pagination.to} of {pagination.total} rooms
        </div>
      )}
    </>
  );
};

export default RoomsPagination;










