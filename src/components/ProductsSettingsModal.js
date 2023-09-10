import React from "react";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import "./ColorPicker.css"
import { fetchOptionalProductsCategories } from "../cloud/reader";
import ProductExtraField from "./ProductExtraField";
import { firestore } from "../cloud/firebase";

export default function ProductsSettingsModal({isProductsSettingsVisible, setIsProductsSettingsVisible}) {
    const [extraFields, setExtraFields] = useState([]);
    const [deletedExtraFields, setDeletedExtraFields] = useState([]);
    const [newField, setNewField] = useState('');

    useEffect(() => {
        const unsubscribeFetchOptionalProductsCategories = fetchOptionalProductsCategories((data) => {
        setExtraFields(data);
        });
    
        return () => {
          unsubscribeFetchOptionalProductsCategories();
        };
      }, []);

    async function handleAddExtraField(event)  {
        event.preventDefault();
        if (newField.split(" ").join("") != "") {
            setExtraFields([...extraFields, newField])
        }
        setNewField('');
    }

    const handleDeleteExtraField = async (event, fieldToDelete) => {
        event.preventDefault();
        // Check if there are no documents in the collection
        const updatedFields = extraFields.filter((field) => field !== fieldToDelete);
        setExtraFields(updatedFields);
        if (deletedExtraFields) {
            setDeletedExtraFields([
                ...deletedExtraFields,
                fieldToDelete
            ]);
        }

    }
    const handleSubmitProductSettings = async (event) => {
        event.preventDefault();
        try {
            const deletionBatch = firestore.batch();

            deletedExtraFields.forEach((category) => {
                const docRef = firestore.collection("optionalProductsFields").doc(category);
                deletionBatch.delete(docRef);
            });
            await deletionBatch.commit();
            console.log("Extra fields succesfully deleted");
        } catch (error) {
            console.error("Error deleting batch", error);
        }

        try {
            const additionBatch = firestore.batch();

            extraFields.forEach((field) => {
                const docRef = firestore.collection("optionalProductsFields").doc(field);
                additionBatch.set(docRef, {});
            });

            await additionBatch.commit();
            console.log("Product fields succesfully added");
            
        } catch (error) {
            console.error("Error adding batch", error);
        }
        window.location.reload();

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
                        Products Settings
                    </h3>

                    </div>
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <form >
                            <div class="mb-12">
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Extra fields: </label>
                                <div className="flex flex-wrap">
                                    {extraFields.length>0 && extraFields.map((field, index) => (
                                        <ProductExtraField key={index} field={field} handleDeleteExtraField={handleDeleteExtraField}/>
                                    ))}
                                </div>

                                    <div className="flex">
                                    <input type="" onChange={(event)=>{setNewField(event.target.value)}} value={newField} id="" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Some extra field"/>

    
                                    <button onClick={handleAddExtraField} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add</button>
                                </div>
                            </div>

                            <button dir="ltr" type="submit" onClick={handleSubmitProductSettings} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >Update</button>

                            <button
                                dir="rtl"
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                                type="button"
                                onClick={() => {
                                    window.location.reload();
                                    setIsProductsSettingsVisible(false)}}
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