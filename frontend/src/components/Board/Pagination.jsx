import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 표시할 페이지 번호가 없을 경우 아무것도 렌더링하지 않음
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center items-center mt-10 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border border-gray-300 bg-white text-gray-700 min-w-[38px] h-[38px] px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200 hover:enabled:bg-gray-50 hover:enabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        &lt; 이전
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`border min-w-[38px] h-[38px] px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200 ${
            currentPage === number
              ? 'bg-gradient-to-r from-pink-300 to-red-400 text-white border-pink-300 font-bold'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border border-gray-300 bg-white text-gray-700 min-w-[38px] h-[38px] px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200 hover:enabled:bg-gray-50 hover:enabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        다음 &gt;
      </button>
    </nav>
  );
};

export default Pagination;
