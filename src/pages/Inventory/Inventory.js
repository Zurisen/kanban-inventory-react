import React from 'react'
import DefaultTable from '../../components/Inventory/DefaultTable';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/Inventory/SearchBar';
import AddProduct from '../../components/Inventory/AddProduct';
import { filter } from 'lodash';

export const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [itemsFound, setItemsFound] = useState(0);

  // Move the filterProducts function and useEffect to the Inventory component
    async function filterProducts(searchQuery) {
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
      
      // Convert the lastModified strings to Date objects
      filteredProducts.forEach((product) => {
        product.lastModified = new Date(product.lastModified).toLocaleString(); // Convert to a string in desired format
      });

      // Sort the filtered products by lastModified in descending order
      filteredProducts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

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
            <AddProduct filterProducts={filterProducts}/>
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