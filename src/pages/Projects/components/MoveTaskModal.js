import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddProductToTask from "./AddProductToTask";
import toast from 'react-hot-toast';
import { fetchProductsToMoveSnapshot } from "../../../cloud/reader";
import { handleMoveProjectDB } from "../../../cloud/writer";


function MoveTaskModal({setIsMoveTaskModalOpen, newMovingTaskData, setNewMovingTaskData, oldColMovingTask}) {

    const [searchedProducts, setSearchedProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);


    useEffect(() => {
        const callback = (data) => {
          setSearchedProducts(data);
        };
      
        const unsubscribeFetchProductsToMoveSnapshot = fetchProductsToMoveSnapshot({newMovingTaskData, callback});
      
        return () => {
            unsubscribeFetchProductsToMoveSnapshot();
        };
      }, []);

    const handleSubmitMove = async (event) => {
        event.preventDefault();

        try{
            await handleMoveProjectDB({newMovingTaskData, searchedProducts, deletedProducts});
            toast.success(`Project ${newMovingTaskData.title} moved from ${oldColMovingTask} to ${newMovingTaskData.state}` );
        } catch (error){
            toast.error(`Error moving project ${newMovingTaskData.title}: ${error}`);
        }

        setIsMoveTaskModalOpen(false);
    }

    const onChangeDate = (range) => {
        const [startDate, endDate] = range;
        setNewMovingTaskData({
            ...newMovingTaskData,
            startDate: startDate,
            endDate: endDate
          });
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewMovingTaskData({
          ...newMovingTaskData,
          [name]: value,
        });
      };

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
                    Move Project 
                </h3>


                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto text-slate-800 dark:text-gray-200">

                <form onSubmit={handleSubmitMove} autoComplete="off">

                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="title" name="title" id="title" value={newMovingTaskData.title} className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 focus:outline-none focus:ring-0 peer dark:text-gray-400 text-gray-400" readOnly />
                            <label for="title" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Project Code</label>
                        </div>
                        <div className="relative z-10 w-full mb-6 group">
                        <DatePicker name="date" id="date"  placeholder="08/01/2023 - 08/24/2023"
                                selected={newMovingTaskData.startDate}
                                onChange={onChangeDate}
                                startDate={newMovingTaskData.startDate}
                                endDate={newMovingTaskData.endDate}
                                selectsRange
                                required
                                type="text"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label for="date" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Start Date - End Date</label>
                        </div>
                    </div>




                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input onChange={handleInputChange} type="company" name="company" id="company" value={newMovingTaskData.company} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company</label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                            <input onChange={handleInputChange} type="text" name="location" id="location" value={newMovingTaskData.location} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="location" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Location</label>
                        </div>

                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                            <input onChange={handleInputChange} type="text" name="description" id="description" value={newMovingTaskData.description} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                    </div>
                    <AddProductToTask col={newMovingTaskData.projectcode} searchedProducts={searchedProducts} setSearchedProducts={setSearchedProducts} 
                        deletedProducts={deletedProducts} setDeletedProducts={setDeletedProducts}/>


                    <button dir="ltr" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >Update</button>

                    <button
                        dir="rtl"
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                        type="button"
                        onClick={() => {
                            setNewMovingTaskData(
                                {
                                    company: '',
                                    description: '',
                                    location: '',
                                    startDate: '',
                                    endDate: '',
                                    projectcode: '',
                                    state: '',
                                    historyId: ''
                                    }
                                )
                            setIsMoveTaskModalOpen(false);
                            toast.error('Project state update was canceled.')}
                        }
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

export default MoveTaskModal;