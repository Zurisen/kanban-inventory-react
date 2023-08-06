import React from 'react'

export const ShowTaskProductsDropwdown = ({searchResults, handleProductOnClick}) => {
  return (
    <div className='dropdown z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700'>
      <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
        {(searchResults.length===0) && <div className='text-sm block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'> Serial Number not available In Stock</div>}
        {searchResults && searchResults.map((result) => 
        <div className=' text-sm block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
        onClick={(event) => {handleProductOnClick(event, result.serial)}}
        > [{result.serial}] {result.name}</div>)}
      </ul>
    </div>
  );
}

export default ShowTaskProductsDropwdown;