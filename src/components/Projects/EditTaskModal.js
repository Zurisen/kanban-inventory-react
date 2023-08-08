import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { firestore } from "../../lib/firebase";
import AddProductToTask from "./AddProductToTask";
import firebase from "firebase";

function EditTaskModal({colIndex, col, task, setIsEditTaskModalOpen, findTasksInColumn}) {

    /* form elements */
    const [title, setTitle] = useState(task.projectcode);
    const [company, setCompany] = useState(task.company);
    const [description, setDescription] = useState(task.description);
    const [location, setLocation] = useState(task.location);

    //const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState(task.startDate.toDate());
    const [endDate, setEndDate] = useState(task.endDate.toDate());
    const [responseLog, setResponseLog] = useState('')

    const [snapshot, setSnapshot] = useState();
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);

    // Fetch snapshot of db for quick search of items
    const fetchProductsSnapshot = async () => {
        const productsRef = firestore.collection('products');
        const snapshot = await productsRef.get();
        setSnapshot(snapshot);
        const data = snapshot.docs.map((doc) => doc.data());
        const projectData = data.filter( (product) => {
            return product.project.includes(title)}
        );
        const serials = projectData.map((product) => product.serial);
        setSearchedProducts(serials);
    }
    useEffect(() => {
        fetchProductsSnapshot();
    }, []);

    const onChangeDate = (range) => {
        const [startDate, endDate] = range;
        setStartDate(startDate);
        setEndDate(endDate);
    };


    async function handleInsertProjectDB(event)  {
        event.preventDefault();
        try {
            const projectsRef = firestore.collection("projects");

            const newProjectData = {
                projectcode: title,
                company: company,
                description: description,
                location: location,
                startDate: startDate,
                endDate: endDate
            }

            // Batch write the state of the products deleted from the project to the db
            const batch = firestore.batch();
            const collectionRef = firestore.collection('products');
            // Loop through the searchResults and create update operations for each document
            if (deletedProducts.length>0) {
                deletedProducts.forEach((serial) => {
                    const docRef = collectionRef.doc(serial);
                    batch.update(docRef, {project: "", lastModified: firebase.firestore.Timestamp.now()});
                });
            }

            // Batch write the state of the products added to the db
            // Loop through the searchResults and create update operations for each document
            if (searchedProducts.length>0) {
                searchedProducts.forEach((serial) => {
                    const docRef = collectionRef.doc(serial);
                    batch.update(docRef, {project: title, lastModified: firebase.firestore.Timestamp.now()});
                });
            }
      
            // Commit the batch write to update all product documents in a single batch operation
            await batch.commit();
            // Commit the new project to the projects doc db
            await projectsRef.doc(title).update(newProjectData);

            // Refresh the projects
            await findTasksInColumn(col);
            setResponseLog('✅ Project Updated');

            fetchProductsSnapshot();

        } catch (error) {
            setResponseLog('❌ Error adding prooject: ' + error.message);
        }

    }

    async function handleDeleteProject (event) {
        event.preventDefault();
        try {
            // Construct the reference to the document to delete
            const docRef = firestore.collection("projects").doc(title);

            // Delete the document and fetch the items linked to that document
            docRef.delete();
            fetchProductsSnapshot();

            const batch = firestore.batch();
            const collectionRef = firestore.collection('products');
            if (searchedProducts.length>0) {
                searchedProducts.forEach((serial) => {
                    const docRef = collectionRef.doc(serial);
                    batch.update(docRef, { state: "In Stock" , project: ""});
                });
            }
            await batch.commit();
            await findTasksInColumn(col);
            setIsEditTaskModalOpen(false);
        } catch (error) {
            console.log('Error deleting project' + error.message);
        }
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
                    Edit Project
                </h3>
                <button
                        dir="rtl"
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                        type="button"
                        onClick={handleDeleteProject}
                        >
                        Delete
                </button>  



                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto text-slate-800 dark:text-gray-200">

                <form onSubmit={handleInsertProjectDB}>

                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="projectcode" name="projectcode" id="projectcode" value={title} className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 focus:outline-none focus:ring-0 peer dark:text-gray-400 text-gray-400" readOnly />
                            <label for="projectcode" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Project Code</label>
                        </div>
                        <div className="relative z-10 w-full mb-6 group">
                        <DatePicker name="date" id="date"  placeholder="08/01/2023 - 08/24/2023"
                                selected={startDate}
                                onChange={onChangeDate}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                type="text"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label for="date" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Start Date - End Date</label>
                        </div>
                    </div>




                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input onChange={(e) => setCompany(e.target.value)} type="company" name="company" id="company" value={company} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company</label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                            <input onChange={(e) => setLocation(e.target.value)} type="text" name="location" id="location" value={location} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="location" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Location</label>
                        </div>

                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                            <input onChange={(e) => setDescription(e.target.value)} type="text" name="description" id="description" value={description} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                    </div>
                    <AddProductToTask col={col} searchedProducts={searchedProducts} setSearchedProducts={setSearchedProducts} 
                        deletedProducts={deletedProducts} setDeletedProducts={setDeletedProducts} snapshot={snapshot}/>
                    <div className="p-2 mb-3">
                    {responseLog}
                    </div>

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