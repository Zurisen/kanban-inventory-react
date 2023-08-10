import React from "react";
import { useState } from "react";
import { firestore } from '../../lib/firebase';
import firebase from "firebase";
import { getRandomInt } from "../../lib/utils";
import toast from 'react-hot-toast';

export default function AddProductModal({setSearchQuery, setSnapshotsUpdate}) {
  const [showModal, setShowModal] = useState(false);

  const currentUTCDate = new Date();
  const utcTimestamp = currentUTCDate.toISOString(); // Convert to UTC string

  /* Handle new product creation in DB*/
  const [newProduct, setNewProduct] = useState({
    name: '',
    serial: '',
    category: '',
    location: '',
    lastModified: utcTimestamp,
    state: 'In Stock',
  });

  async function handleInsertProductDB(event) {
    event.preventDefault();
    try {
      // Create a reference to the "products" collection
      const productsRef = firestore.collection('products');

      // Check if a document with the same serial already exists
      const existingProductSnapshot = await productsRef.doc(newProduct.serial).get();

      if (existingProductSnapshot.exists) {
        toast.error('Error: Serial number is already in use.');
        console.log('damn');
        return; // Exit the function without adding the product
      }

      // Prepare the new product data to be added to Firestore
      const newProductData = {
        name: newProduct.name,
        serial: newProduct.serial,
        category: newProduct.category,
        location: newProduct.location,
        lastModified: firebase.firestore.Timestamp.now(), // Use Firestore timestamp
        project: "",
      };

      // Set the new product data with the "serial" as the document ID
      await productsRef.doc(newProduct.serial).set(newProductData);

      // Clear the form fields and reset the newProduct state
      setNewProduct({
        name: '',
        serial: '',
        category: '',
        location: '',
        lastModified: utcTimestamp,
        project: "",
      });

      toast.success('New product added: ' + `[${newProductData.serial}] ` + newProduct.name);
    } catch (error) {
      toast.error('Error adding product: ' + error.message);
    }

    setSnapshotsUpdate(getRandomInt());
    setSearchQuery('');

  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };
  
  return (
    <>
      <button
        className=" focus:outline-none focus:ring-4  font-medium rounded-lg text-sm px-5 py-4 mb-2 mr-3 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
        type="button"
        onClick={() => {
            setNewProduct({
                name: '',
                serial: '',
                category: '',
                location: '',
                lastModified: utcTimestamp,
                project: "",
              });
              setShowModal(true);
        }}
      >
        Add Product
      </button>
      {showModal ? (
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
                    Create Product
                  </h3>

                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
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
                            <input type="serial" pattern="[0-9]{12}" name="serial" id="floating_serial" value={newProduct.serial} onChange={handleInputChange} class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="serial" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Serial Number</label>
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
                    >Add</button>

                    <button
                        dir="rtl"
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                        type="button"
                        onClick={() => setShowModal(false)}
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
      ) : null}
    </>
  );
}