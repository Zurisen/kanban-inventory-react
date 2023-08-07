import React, { useEffect, useState } from 'react';
import { SearchedProduct } from './SearchedProduct';
import ShowTaskProductsDropwdown from './ShowTaskProductsDropwdown';
import { firestore } from '../../lib/firebase';

export const AddProductToTask = ({col, searchedProducts, setSearchedProducts, deletedProducts, setDeletedProducts, snapshot}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([]);
    const [showProductsSelect, setShowProductsSelect] = useState(false);

    const checkSearchResultsInDB = async (snapshot) => {
        // Extract the data from the snapshot
        const data = snapshot.docs.map((doc) => doc.data());

        // Filter the products based on the user's search query
        const filteredProducts = data.filter((product) => {
            const lowerCaseSearchQuery = searchQuery.toLowerCase().trim();

            // Check if the product has already been searched
            const isAlreadySearched = searchedProducts.includes(product.serial);
            
            // Check if the search query matches the product name or serial and if it's not already searched
            return (
            (!isAlreadySearched && lowerCaseSearchQuery!=='' && product.state=='In Stock') &&
            (product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
                product.serial.toString().toLowerCase().includes(lowerCaseSearchQuery))
            );
        });
        // Convert the lastModified strings to Date objects
        filteredProducts.forEach((product) => {
        product.lastModified = new Date(product.lastModified).toLocaleString(); // Convert to a string in the desired format
        });
    
        // Sort the filtered products by lastModified in descending order
        filteredProducts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
        setSearchResults(filteredProducts);
        setShowProductsSelect(true);
    }

    useEffect(() => {
        searchQuery!= '' && checkSearchResultsInDB(snapshot);
    }, [searchQuery]);

    const handleSearch = async (event) => {
        setSearchQuery(event.target.value);
    };

    const handleProductOnClick = (event, serial) => {
        setSearchedProducts([...searchedProducts, serial]);
        setShowProductsSelect(false);
        setSearchQuery('');
        setSearchResults('');
    };

    const handleDelete = (serialToDelete) => {
        const updatedProducts = searchedProducts.filter((serial) => serial !== serialToDelete);
        setSearchedProducts(updatedProducts);
        if (deletedProducts) {
            setDeletedProducts([...deletedProducts, serialToDelete]);
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission
          // Your custom handling logic here
        }
    };


    return (
        <form onSubmit>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
            >
                <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
            </svg>
            </div>
            <input
            type="search"
            id="default-search"
            value={searchQuery}
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-transparent focus:ring-blue-500 focus:border-blue-500 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search products by Serial Number..."
            required
            on
            onChange={handleSearch}
            onKeyDown={handleKeyDown} 
            />
        </div>
        {showProductsSelect && <ShowTaskProductsDropwdown searchResults={searchResults} handleProductOnClick={handleProductOnClick}/>}

        <div className='flex flex-wrap'>
            {searchedProducts.length>0 && searchedProducts.map((serial, index) => (
            <SearchedProduct key={index} serial={serial} onDelete={handleDelete} />
            ))}
        </div>
        </form>
    );
};

export default AddProductToTask;
