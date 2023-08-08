import React from 'react'
import DefaultTable from '../../components/Inventory/DefaultTable';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/Inventory/SearchBar';
import AddProduct from '../../components/Inventory/AddProduct';
import { firestore } from '../../lib/firebase';
import debounce from 'lodash.debounce';

export const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [itemsFound, setItemsFound] = useState(0);
  const [snapshotData, setSnapshotData] = useState([]);
  const [statesData, setStatesData] = useState([]);

  const fetchProductsSnapshot = async () => {
    const productsRef = firestore.collection('products');
    const snapshot = await productsRef.get();
    // Extract the data from the snapshot
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
  }
  const fetchProjectsStatesSnapshot = async () => {
    // Fetch projects to create a dictionary of project IDs and states
    const projectsSnapshot = await firestore.collection('projects').get();
    const projectsData = projectsSnapshot.docs.reduce((acc, doc) => {
      const projectId = doc.id;
      const projectData = doc.data();
      acc[projectId] = projectData.state;
      return acc;
    }, {});
    return projectsData;
  }

  useEffect(() => {
    fetchProductsSnapshot().then((data) => {
      setSnapshotData(data);
    }).catch((error) => {
      console.error("Error fetching products:", error);
    });

    fetchProjectsStatesSnapshot().then((data) => {
      setStatesData(data);
    }).catch((error) => {
      console.error("Error fetching projects states:", error);
    });
  }, []);
  

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
          return (
            product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
            product.serial.toString().includes(lowerCaseSearchQuery) ||
            product.category.toLowerCase().includes(lowerCaseSearchQuery) ||
            product.location.toLowerCase().includes(lowerCaseSearchQuery) ||
            product.state.toLowerCase().includes(lowerCaseSearchQuery) 
          );
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

    <div className="p-4 sm:ml-64 bg-slate-200 dark:bg-slate-900">
      <div className="p-7 py-16 bg-slate-200 dark:bg-slate-900">

        {/* Add product Button & Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
          <AddProduct filterProducts={filterProducts}/>
          <SearchBar itemsFound={itemsFound} setSearchQuery={setSearchQuery}/>
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