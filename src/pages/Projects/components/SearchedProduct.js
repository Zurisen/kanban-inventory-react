import React from 'react';

export const SearchedProduct = ({ serial, onDelete }) => {
  return (
    <div className="flex mt-2 mr-2">
        <small className="p-1.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-l-gray-50 border-l-2 border border-gray-300  dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{serial}</small>
        <button  onClick={() => onDelete(serial)} class="top-0 right-0 p-1.5 text-sm font-medium text-white bg-red-500 rounded-r-lg focus:ring-4 focus:outline-none  dark:bg-red-500 dark:hover:bg-red-700 border-gray-300">
            {<i class="bi bi-x"></i>}
        </button>
    </div>
    
    );
};



export default SearchedProduct;