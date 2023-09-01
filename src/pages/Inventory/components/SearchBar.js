import React from 'react';
import FilterDropdown from './FilterDropdown';
import { useState } from 'react';

export const SearchBar = ({itemsFound, columns, setColumns, setSearchQuery}) => {
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);


    const onChange = (event) => {
        const input = event.target.value;
        setSearchQuery(input);
      };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission
          // Your custom handling logic here
        }
    };
    return (
        <form className="w-full" onKeyDown={handleKeyDown}> 
            <div className="flex items-center ">
                {/* The Search Bar */}
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    </div>
                    <input type="search" onChange={onChange} id="default-search" className="block w-full p-2 pl-10 pr-14 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by Product Name, Serial Number, State..." required />
                    <button className="absolute top-0 right-0 mt-1 mr-2 h-7 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Found: {itemsFound}</button>
                </div>

                {/* Dropwdown filter Button and dropdown menu */}
                <div id="dropdownContainer" className="relative">
                    <button id="dropdownMenuIconButton" onClick={() => setShowFilterDropdown(!showFilterDropdown)} data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center ml-4 border dark:border-gray-600 text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill w-5 h-5" viewBox="0 0 16 16">
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                        </svg>
                    </button>
                    {showFilterDropdown && <FilterDropdown columns={columns} setColumns={setColumns}/>}
                </div>

            </div>

        </form>
    )
}

export default SearchBar;