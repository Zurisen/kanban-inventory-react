import React, { useEffect, useState, useCallback } from 'react';
//import { filter } from 'json-server-auth';
export const SearchBar = ({products, setProducts}) => {

  /* Component interaction Hooks */
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState("All");

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const changeCategoryName = (input) => {
    setCategory(input);
    toggleDropdown();
  }


  /* DB fitlering hooks */
//   const [searchQuery, setSearchQuery] = useState('');

//   const filterProducts = useCallback(
//     debounce (async (searchQuery) => {
//         const filtered = products.filter((product) => {
//             return product.name.toLowerCase().includes(searchQuery.toLowerCase());
//         });
//         setProducts(filtered);
//         }, 
//     500),
//     []
//   );



//   useEffect(() => {
//     filterProducts();
//   }, [searchQuery]);


  return (
    <form className="w-full">
        {/* Dropdown categories menu */}
        <div className="flex">

            <button
            id="dropdown-button"
            onClick={toggleDropdown}
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            type="button"
            >
            {category}
            <svg
                className={`w-2.5 h-2.5 ml-2.5 transition-transform transform ${
                isDropdownOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
            >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
            </button>


            {/* The Search Bar */}
            <div className="relative w-full">
                <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" 
                placeholder={`Search by ${category}...`} required/>
                <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </div>
        </div>

        <div
            id="dropdown"
            className={`absolute z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ${
                isDropdownOpen ? '' : 'hidden'
            }`}
            >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                <li>
                <button type="button" onClick={() => changeCategoryName("Product Name")} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Product Name
                </button>
                </li>
                <li>
                <button type="button" onClick={() => changeCategoryName("Category")} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Category
                </button>
                </li>
                <li>
                <button type="button" onClick={() => changeCategoryName("Location")} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Location
                </button>
                </li>
                <li>
                <button type="button" onClick={() => changeCategoryName("State")} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    State
                </button>
                </li>
            </ul>
            </div>
    </form>
  )
}

export default SearchBar;