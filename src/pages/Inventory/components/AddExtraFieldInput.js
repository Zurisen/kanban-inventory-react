import React, { useState } from 'react'

export const AddExtraFieldInput = ({availableCategories, setAvailableCategories, handleChangeCategory, category}) => {
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const onSelect = (newCategory) => {
      setSelectedCategory(newCategory);
      handleChangeCategory(category, newCategory); // Notify the parent component about the change
    };
    return (
        <div className="flex mb-5">
            <label for="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
            <button id="dropdown-button" onClick={() => setShowDropdown(!showDropdown)} data-dropdown-toggle="dropdown" className="flex-shrink-0 z-10 inline-flex items-center py-0.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 dark:border-gray-700 dark:text-white rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 " type="button">{selectedCategory} {availableCategories.length>0 && <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>}</button>
            
                {(showDropdown && availableCategories.length>0) &&              
                    <div id="dropdown" className="z-10 mt-7 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul className="py-0.5 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                            {availableCategories && availableCategories.map((category) => (
                                <li>
                                    <a onClick={()=>{
                                        onSelect(category);
                                        setShowDropdown(false);
                                    }
                                    } href="#" className="block px-4 py-1 rounded-lg border dark:border-gray-700 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{category}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
                <div className="relative w-full">
                    <input type="search" id="search-dropdown" className="block p-1 pl-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-100 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Some value" required/>
                    <button type="submit" className="absolute top-0 right-0 p-1 h-full text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg></button>
                </div>
            </div>
    )
}

export default AddExtraFieldInput;
