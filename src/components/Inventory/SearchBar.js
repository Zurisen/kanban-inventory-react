import React from 'react';
import { debounce } from 'lodash';

export const SearchBar = ({itemsFound, setSearchQuery}) => {

    const onChange = debounce((event) => {
        const input = event.target.value;
        setSearchQuery(input);
      }, 500);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission
          // Your custom handling logic here
        }
    };
    return (
        <form className="w-full" onKeyDown={handleKeyDown}> 
            <div className="flex">
                {/* The Search Bar */}
                <label for="default-search" class="mb-2 text-sm font-medium sr-only   text-white">Search</label>
                <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4    text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" onChange={onChange} id="default-search" class="block w-full p-4 pl-10 text-sm  border  rounded-lg    bg-gray-700   border-gray-600   placeholder-gray-400   text-white   focus:ring-blue-500   focus:border-blue-500" placeholder="Search by Product Name, Serial Number, State..." required/>
                    <button class="absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2   text-white bg-blue-600   hover:bg-blue-700   focus:ring-blue-800">Found: {itemsFound}</button>
                </div>
            </div>

        </form>
    )
}

export default SearchBar;