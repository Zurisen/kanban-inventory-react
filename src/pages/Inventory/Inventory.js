import React from 'react'
import DefaultTable from '../../components/Inventory/DefaultTable';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/Inventory/SearchBar';
import AddProduct from '../../components/Inventory/AddProduct';
import { firestore } from '../../lib/firebase';
import { debounce } from 'lodash';

export const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [itemsFound, setItemsFound] = useState(0);

  // Move the filterProducts function and useEffect to the Inventory component
    const filterProducts = debounce(async (searchQuery) => {
        try {
          const productsRef = firestore.collection('products');

          // Fetch all documents from the 'products' collection
          const snapshot = await productsRef.get();
      
          // Extract the data from the snapshot
          const data = snapshot.docs.map((doc) => doc.data());
          console.log(data);

          // Filter the products based on the user's search query
          const filteredProducts = data.filter((product) => {
            const lowerCaseSearchQuery = searchQuery.toLowerCase();
      
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
            product.lastModified = new Date(product.lastModified).toLocaleString(); // Convert to a string in the desired format
          });
      
          // Sort the filtered products by lastModified in descending order
          filteredProducts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      
          setProducts(filteredProducts);
          setItemsFound(filteredProducts.length);
        } catch (error) {
          console.error("Error filtering products:", error);
        }
    }, 500);



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