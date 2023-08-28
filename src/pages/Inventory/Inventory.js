import React from 'react'
import DefaultTable from './components/DefaultTable';
import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import AddProductModal from './components/AddProductModal';

export const Inventory = ({snapshotData, statesData, stateColors}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [itemsFound, setItemsFound] = useState(0);
  const [columns, setColumns] = useState({
    'name': 'Product Name',
    'serial': 'Serial Number',
    'category': 'Category',
    'location': 'Location',
    'state': 'State',
  });
  // Move the filterProducts function and useEffect to the Inventory component
  const filterProducts = async (searchQuery) => {
      try {
        // Write the state of the products
        const unfilteredProducts = snapshotData.map((product) => ({
          ...product,
          state: statesData[product.project] !== undefined ? statesData[product.project] : "In Stock"
        }));

        // Filter the products based on the user's search query
        const filteredProducts = unfilteredProducts.filter((product) => {
          const lowerCaseSearchQuery = searchQuery.toLowerCase();
          
          // Get the keys of the product object
          const productKeys = Object.keys(product);
          
          // Filter the columns object to include only keys that exist in the product
          const filteredColumns = Object.keys(columns)
            .filter((columnKey) => productKeys.includes(columnKey))
            .reduce((filteredObj, columnKey) => {
              filteredObj[columnKey] = columns[columnKey];
              return filteredObj;
            }, {});
        
          // Define an array of criteria based on the selected columns
          const searchCriteria = Object.keys(filteredColumns).map((columnKey) => {
            const columnName = product[columnKey].toLowerCase();
            return columnName.includes(lowerCaseSearchQuery);
          });
        
          // Check if any of the search criteria is true
          const isMatch = searchCriteria.some((criteria) => criteria);
        
          return isMatch;
        });
    
        // Convert the lastModified strings to Date objects
        filteredProducts.forEach((product) => {
          product.lastModified = new Date(product.lastModified.seconds * 1000).toLocaleString(); // Convert to a string in the desired format
        });
    
        // Sort the filtered products by lastModified in descending order
        filteredProducts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
        setProducts(filteredProducts);
        setItemsFound(filteredProducts.length);
      } catch (error) {
        console.error("Error filtering products:", error);
      }
    }

    useEffect(() => {
      filterProducts(searchQuery);
    }, [searchQuery, snapshotData]); // Include snapshot as a dependency

  return (

    <div className="p-4 sm:ml-10 sm:mr-10 bg-slate-200 dark:bg-slate-900">
      <div className="p-2 py-16 bg-slate-200 dark:bg-slate-900">

        {/* Add product Button & Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
          <AddProductModal setSearchQuery={setSearchQuery} />
          <SearchBar itemsFound={itemsFound} setSearchQuery={setSearchQuery}/>
        </div>

        {/* Products Table */}
        <div className='py-3'>
        <DefaultTable products={products} columns={columns} stateColors={stateColors} setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
        </div>

      </div>


    </div>

    


    )
}

export default Inventory;