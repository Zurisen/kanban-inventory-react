import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { firestore } from "../../cloud/firebase";
import AddProductToTask from "./AddProductToTask";
import firebase from "firebase";
import toast from 'react-hot-toast';
import { handleDeleteProjectDB, handleEditProjectDB, handleFinishProjectDB } from "../../cloud/writer";
import { fetchProductsInProject } from "../../cloud/reader";

function EditTaskModal({colIndex, col, task, setIsEditTaskModalOpen, findTasksInColumn}) {

    /* form elements */
    const [projectInfo, setProjectInfo] = useState({
        ...task,
        startDate:task.startDate.toDate(),
        endDate:task.endDate.toDate()
    });

    const [searchedProducts, setSearchedProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);

    const [showDeleteTaskConfirmationModal, setShowDeleteTaskConfirmationModal] = useState(false);

    useEffect(() => {
        const callback = (data) => {
          setSearchedProducts(data);
        };
      
        const unsubscribefetchProductsInProject = fetchProductsInProject({ callback, projectInfo });
      
        return () => {
            unsubscribefetchProductsInProject();
        };
      }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProjectInfo({
          ...projectInfo,
          [name]: value,
        });
      };

    const onChangeDate = (range) => {
        const [startDate, endDate] = range;
        setProjectInfo({
            ...projectInfo,
            startDate: startDate,
            endDate: endDate
        });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        try{
            await handleEditProjectDB({projectInfo, searchedProducts, deletedProducts});
            toast.success(`Project ${projectInfo.title} updated!` );
        } catch (error){
            toast.error(`Error updating project ${projectInfo.title}: ${error}`);
        }

        setIsEditTaskModalOpen(false)
    }
    
    const handleFinish = async (event) => {
        event.preventDefault();

        try{
            await handleFinishProjectDB({projectInfo, searchedProducts});
            toast.success(`Project ${projectInfo.title} finished.`);
        } catch (error){
            toast.error(`Error finishing project ${projectInfo.title}: ${error}`);
        }

        setIsEditTaskModalOpen(false)
    }

    const handleDelete = async (event) => {
        event.preventDefault();

        try{
            await handleDeleteProjectDB({projectInfo, searchedProducts});
            toast.success(`Project ${projectInfo.title} deleted.`);
        } catch (error){
            toast.error(`Error deleting project ${projectInfo.title}: ${error}`);
        }

        setIsEditTaskModalOpen(false)
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
                    Edit Project ({col})
                </h3>

                <div className="flex flex-wrap">
                    <button
                            dir="rtl"
                            className="text-blue-500 background-transparent font-bold uppercase  px-4 text-sm outline-none focus:outline-none mt-2 mr-1 ease-linear transition-all duration-150  right-0"
                            type="button"
                            onClick={handleFinish}
                            >
                            Finish
                    </button>  
                    <button
                            dir="rtl"
                            className="text-red-500 background-transparent font-bold uppercase px-2 text-sm outline-none focus:outline-none mt-2 mr-1 ease-linear transition-all duration-150  right-0"
                            type="button"
                            onClick={() => setShowDeleteTaskConfirmationModal(true)}
                            >
                            Delete
                    </button>  
                    {/* Delete Confimation Modal*/} 
                    {showDeleteTaskConfirmationModal && 
                        <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none "
                        >
                            <div className="relative w-3/12 my-6 mx-auto max-w-5xl">
                            {/*content*/}
                                <div className="border rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-50 dark:bg-gray-800 dark:text-gray-200">
                                    <div className="p-3 text-4xl text-center">
                                    ⚠️
                                    </div>
                                    <div className="flex items-start justify-between p-5 mt-[-10px] border-slate-200 rounded-t">
                                        Are you sure you want to delete the project? This process is irreversible and will delete all history of the project.
                                    </div>

                                    <div className="flex flex-wrap justify-between">
                                        <button
                                            dir="ltl"
                                            className="text-blue-500 background-transparent font-bold uppercase px-2 text-sm outline-none focus:outline-none mt-2 mb-6 w-28"
                                            type="button"
                                            onClick={() => setShowDeleteTaskConfirmationModal(false)}
                                        >
                                            Return
                                        </button>  
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-2 text-sm outline-none focus:outline-none mt-2 mb-6 w-28"
                                            type="button"
                                            onClick={(event) => {
                                                handleDelete(event);
                                                setShowDeleteTaskConfirmationModal(true);
                                                }
                                            }
                                        >
                                            Confirm
                                        </button>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>




                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto text-slate-800 dark:text-gray-200">

                <form onSubmit={handleUpdate}>

                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="title" name="title" id="title" value={projectInfo.title} className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 focus:outline-none focus:ring-0 peer dark:text-gray-400 text-gray-400" readOnly />
                            <label for="title" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Project Code</label>
                        </div>
                        <div className="relative z-10 w-full mb-6 group">
                        <DatePicker name="date" id="date"  placeholder="08/01/2023 - 08/24/2023"
                                selected={projectInfo.startDate}
                                onChange={onChangeDate}
                                startDate={projectInfo.startDate}
                                endDate={projectInfo.endDate}
                                selectsRange
                                type="text"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label for="date" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Start Date - End Date</label>
                        </div>
                    </div>




                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input onChange={handleInputChange} type="company" name="company" id="company" value={projectInfo.company} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company</label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                            <input onChange={handleInputChange} type="text" name="location" id="location" value={projectInfo.location} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="location" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Location</label>
                        </div>

                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                            <input onChange={handleInputChange} type="text" name="description" id="description" value={projectInfo.description} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                    </div>
                    <AddProductToTask col={col} searchedProducts={searchedProducts} setSearchedProducts={setSearchedProducts} 
                        deletedProducts={deletedProducts} setDeletedProducts={setDeletedProducts}/>


                    <button dir="ltr" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >Update</button>

                    <button
                        dir="rtl"
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                        type="button"
                        onClick={() => setIsEditTaskModalOpen(false)}
                        >
                        Cancel
                    </button>                        

                    </form>

                </div>

            </div>
            </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default EditTaskModal;