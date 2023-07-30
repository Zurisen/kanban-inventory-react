import React from 'react'
import DefaultTable from '../../components/Inventory/DefaultTable';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/Inventory/SearchBar';

export const Inventory = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts(){
            const response = await fetch("http://localhost:3000/products");
            const data  = await response.json();
            setProducts(data);
        }
        fetchProducts();
    }, []);

    return (

      <div className="p-4 sm:ml-64 bg-slate-200 dark:bg-slate-900">
        <div className="p-7 py-16 bg-slate-200 dark:bg-slate-900">

          {/* Add product Button & Search Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
            <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Add Product</button>
            <SearchBar products={products, setProducts}/>
          </div>

          {/* Products Table */}
          <div className='py-2'>
          <DefaultTable products={products}/>
          </div>
        </div>


      </div>

      


     )
}

export default Inventory;