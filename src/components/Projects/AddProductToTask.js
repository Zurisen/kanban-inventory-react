import React, { useEffect, useState } from 'react';
import { SearchedProduct } from './SearchedProduct';
import { firestore } from '../../lib/firebase';
import { debounce } from 'lodash';
import { SUGGEST_TO_CONTAIN_EQUAL } from 'jest-matcher-utils';

export const AddProductToTask = () => {
    const [searchedProducts, setSearchedProducts] = useState([]);
    //const [snapshot, setSnapshot] = useState();
    const [searchResults, setSearchResults] = useState([]);

    // useEffect(() => {
    //     const fetchProductsSnapshot = async () => {
    //         const productsRef = firestore.collection('products');
    //         const snapshot = await productsRef.get();
    //         setSnapshot(snapshot);
    //     }
    // }, [])


    const handleSearch = debounce(async (event) => {
        const searchQuery = event.target.value;
        // Extract the data from the snapshot
        const productsRef = firestore.collection('products');
        const snapshot = await productsRef.get();
        const data = snapshot.docs.map((doc) => doc.data());
        console.log(data);

        // Filter the products based on the user's search query
        const filteredProducts = data.filter((product) => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();

        return (
            product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
            product.serial.toString().toLowerCase().includes(lowerCaseSearchQuery)
        );
        });
        // Convert the lastModified strings to Date objects
        filteredProducts.forEach((product) => {
        product.lastModified = new Date(product.lastModified).toLocaleString(); // Convert to a string in the desired format
        });
    
        // Sort the filtered products by lastModified in descending order
        filteredProducts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
        setSearchResults(filteredProducts);

    }, 500);

    const handleEnter = (event) => {
        event.preventDefault();
        const serial = event.target.value.trim();
        if (serial !== '') {
        setSearchedProducts([...searchedProducts, serial]);
        event.target.value = '';
        setSearchResults('');
        }
    };

    const handleDelete = (serialToDelete) => {
        const updatedProducts = searchedProducts.filter((serial) => serial !== serialToDelete);
        setSearchedProducts(updatedProducts);
    };

    return (
        <form>
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
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search products by Serial Number..."
            required
            onChange={handleSearch}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                handleEnter(event);
                }
            }}
            />
        </div>
        <div className='flex flex-wrap'>
            {searchedProducts.map((serial, index) => (
            <SearchedProduct key={index} serial={serial} onDelete={handleDelete} />
            ))}
        </div>
        <div className='text-sm'>{ searchResults!='' && `[${searchResults[0].serial}] ${searchResults[0].name}`}</div>
        </form>
    );
};

export default AddProductToTask;