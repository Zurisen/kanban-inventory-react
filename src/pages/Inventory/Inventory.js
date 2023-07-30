import React from 'react'
import DefaultTable from '../../components/Inventory/DefaultTable';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/Inventory/SearchBar';

export const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [itemsFound, setItemsFound] = useState(0);

  // Move the filterProducts function and useEffect to the Inventory component
    async function filterProducts(searchQuery, sortby) {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();

      // Filter the products based on the user's search query
      const filteredProducts = data.filter((product) => {
          // Implement your filtering logic here
          const lowerCaseSearchQuery = searchQuery.toLowerCase();

          // Check if the search query matches any part of the attributes
          return (
            product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
            product.serial.toString().toLowerCase().includes(lowerCaseSearchQuery) ||
            product.category.toLowerCase().includes(lowerCaseSearchQuery) ||
            product.location.toLowerCase().includes(lowerCaseSearchQuery) ||
            product.state.toLowerCase().includes(lowerCaseSearchQuery)
          );
      });

      setProducts(filteredProducts);
      setItemsFound(filteredProducts.length);
    }



    useEffect(() => {
      filterProducts(''); // Fetch all products initially
    }, []);

  
    const handleSearchInputChange = (input) => {
      filterProducts(input); // Call filterProducts with the user's search input
    };

    return (

      <div className="p-4 sm:ml-64 bg-slate-200 dark:bg-slate-900">
        <div className="p-7 py-16 bg-slate-200 dark:bg-slate-900">

          {/* Add product Button & Search Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
            <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-4 mb-2 mr-3 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ">Add Product</button>
            <SearchBar onChangeCallback={handleSearchInputChange} itemsFound={itemsFound}/>
          </div>

          {/* Products Table */}
          <div className='py-5'>
          <DefaultTable products={products}/>
          </div>

        </div>


      </div>

      


     )
}

export default Inventory;