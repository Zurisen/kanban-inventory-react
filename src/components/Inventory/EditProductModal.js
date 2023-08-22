import React from "react";
import { useState } from "react";
import { firestore } from '../../lib/firebase';
import firebase from "firebase";
import { getRandomInt } from "../../lib/reader";
import toast from 'react-hot-toast';

export default function EditProductModal({products, productIndex, searchQuery, setSearchQuery, setShowEditProductModal}) {

  /* Handle new product creation in DB*/
  const [newProduct, setNewProduct] = useState({
    name: products[productIndex].name,
    serial: products[productIndex].serial,
    category: products[productIndex].category,
    location: products[productIndex].location,
  });

  async function handleInsertProductDB(event) {
    event.preventDefault();
    try {
      // Create a reference to the "products" collection
      const productsRef = firestore.collection('products');

      // Prepare the new product data to be added to Firestore
      const newProductData = {
        name: newProduct.name,
        category: newProduct.category,
        location: newProduct.location,
        lastModified: firebase.firestore.Timestamp.now(), // Use Firestore timestamp
      };

      // Set the new product data with the "serial" as the document ID
      await productsRef.doc(products[productIndex].serial).update(newProductData);

      toast.success('Product updated: ' + `[${products[productIndex].serial}] ` + newProduct.name);
    } catch (error) {
      toast.error('Error updating product: ' + error.message);
    }

    setSearchQuery(searchQuery);
    setShowEditProductModal(false);

  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleDeleteProduct = (event) => {
    event.preventDefault();
    try {
        // Construct the reference to the document to delete
        const docRef = firestore.collection("products").doc(products[productIndex].serial);

        // Delete the document and fetch the items linked to that document
        docRef.delete();
        toast.success(`Deleted product: ${products[productIndex].serial}`)
    } catch (error) {
        toast.error('Error deleting product' + error.message);
    }
    setSearchQuery(searchQuery);
    setShowEditProductModal(false);
  }
  
  return (
    <>

          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none "
          >
            <div className="relative w-5/12 my-6 mx-auto max-w-5xl">
              {/*content*/}
              <div className="border rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-50 dark:bg-gray-800 dark:text-gray-200">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl font-semibold">
                    Edit Product
                  </h3>
                  <button
                        dir="rtl"
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                        type="button"
                        onClick={handleDeleteProduct}
                        >
                        Delete
                </button> 

                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto text-slate-800 dark:text-gray-200">

                <form onSubmit={handleInsertProductDB}>
                    <div class="relative z-0 w-full mb-6 group">
                        <input name="name" id="name" value={newProduct.name} onChange={handleInputChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label for="name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Product Name</label>
                    </div>
                    <div class="grid md:grid-cols-2 md:gap-6">
                        <div class="relative z-0 w-full mb-6 group">
                            <input type="serial" pattern="[0-9]{12}" name="serial" id="floating_serial" value={newProduct.serial} onChange={handleInputChange} class="block py-2.5 px-0 w-full text-sm text-gray-600 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-300 dark:border-gray-600 focus:outline-none peer" readOnly/>
                            <label for="serial" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Serial Number</label>
                        </div>
                        <div class="relative z-0 w-full mb-6 group">
                            <input type="text" name="category" id="category" value={newProduct.category} onChange={handleInputChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="category" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Category</label>
                        </div>
                    </div>

                    <div class="relative z-0 w-full mb-6 group">
                        <input type="text" name="location" id="location" value={newProduct.location} onChange={handleInputChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label for="location" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Location</label>
                    </div>

                    <button dir="ltr" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >Update</button>

                    <button
                        dir="rtl"
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                        type="button"
                        onClick={() => setShowEditProductModal(false)}
                        >
                            Close
                    </button>                        

                    </form>

                </div>

              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
  );
}