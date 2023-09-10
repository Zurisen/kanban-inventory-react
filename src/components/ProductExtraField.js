import React from 'react';

export const ProductExtraField = ({ field, handleDeleteExtraField }) => {
  return (
    <div className="flex mt-2 mr-4 mb-5">
        <small className="p-1.5 z-20 text-base text-gray-900 bg-gray-50 rounded border-l-gray-50 border-l-2 border border-gray-300  dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{field}</small>
        <button onClick={(event) => handleDeleteExtraField(event, field)} className="top-0 right-0 p-1.5 text-sm font-medium bg-transparent">
            {<i className="bi bi-x text-red-500"></i>}
        </button>
    </div>
    
    );
};



export default ProductExtraField;