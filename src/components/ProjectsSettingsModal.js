import React from "react";
import { useState, useEffect } from "react";
import { firestore } from "../cloud/firebase";
import firebase from "firebase";
import toast from 'react-hot-toast';
import { ProjectType } from "./ProjectType";
import { SketchPicker } from "react-color";
import "./ColorPicker.css"

export default function ProjectsSettingsModal({isProjectsSettingsVisible, setIsProjectsSettingsVisible}) {
    
    const [projectsCategories, setProjectsCategories] = useState([]);
    const [deletedProjectsCategories, setDeletedProjectsCategories] = useState([]);
    const [newProjectId, setNewProjectId] = useState("");

    const handleFindProjectCategories = async () => {
        const categoriesRef = firestore.collection("projectsCategories");
        categoriesRef.onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.id);
          const colors = snapshot.docs.map((doc) => doc.data().color);
          
          const updatedCategories = data.map((category, index) => ({
            category: category,
            color: colors[index]
          }));
      
          setProjectsCategories(updatedCategories);
        });
      }
    
      useEffect(() => {
        handleFindProjectCategories();
      }, []);

    const handleInputChange = (event) => {
        setNewProjectId(event.target.value);
    }
    async function handleAddProjectCategory(event)  {
        event.preventDefault();
        if (newProjectId.split(" ").join("") != "") {
            setProjectsCategories([...projectsCategories, {category:newProjectId, color:colorPicker}])
        }
        setNewProjectId('');
    }

    const handleDeleteProjectCategory = async (event, categoryToDelete) => {
        event.preventDefault();
        const colRef = firestore.collection("projects");
        colRef.onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            const assignedProjects = data.filter((project) => {
              return (
                project.state.includes(categoryToDelete)
              )}
            );
            // Check if there are no documents in the collection
            if (assignedProjects.length === 0) {
                    const updatedCategories = projectsCategories.filter((project) => project.category !== categoryToDelete);
                    setProjectsCategories(updatedCategories);
                    if (deletedProjectsCategories) {
                        setDeletedProjectsCategories([
                            ...deletedProjectsCategories,
                            categoryToDelete
                        ]);
                    }
            } else {
                toast.error("That Project Type has projects assigned to it!");
            }
        });
    }


    const handleSubmitProjectSettings = async (event) => {
        event.preventDefault();
        try {
            const deletionBatch = firestore.batch();

            deletedProjectsCategories.forEach((category) => {
                const docRef = firestore.collection("projectsCategories").doc(category);
                deletionBatch.delete(docRef);
            });
            await deletionBatch.commit();
            console.log("Categories succesfully deleted");
        } catch (error) {
            console.error("Error deleting batch", error);
        }

        try {
            const additionBatch = firestore.batch();

            projectsCategories.forEach((project) => {
                const docRef = firestore.collection("projectsCategories").doc(project.category);
                additionBatch.set(docRef, {color:project.color});
            });

            await additionBatch.commit();
            console.log("Categories succesfully added");
            
        } catch (error) {
            console.error("Error adding batch", error);
        }
        window.location.reload();

    }


    /* Color Picker Style */
    const [colorPicker, setColorPicker] = useState("#44EE96");

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
                        Projects Settings
                    </h3>

                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto text-slate-800 dark:text-gray-200">

                    <form onSubmit={handleSubmitProjectSettings}>
                        <div class="mb-12">
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Projects Types: </label>
                            <div className="flex flex-wrap">
                                {projectsCategories.length>0 && projectsCategories.map((project, index) => (
                                    <ProjectType key={index} project={project} handleDeleteProjectCategory={handleDeleteProjectCategory}/>
                                ))}
                            </div>

                                <div className="flex">
                                <input type="" id="" onChange={handleInputChange} value={newProjectId} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Some project type"/>
                                <input
                                        type="color"
                                        id="style1"
                                        value={colorPicker}
                                        onChange={(event) => {
                                            setColorPicker(event.target.value);
                                        }}
                                        className="h-10 absolute right-28 mr-[-5px]"
                                    />   
 
                                <button onClick={handleAddProjectCategory} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add</button>
                            </div>
                        </div>

                        <button dir="ltr" type="submit" onClick={handleSubmitProjectSettings} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >Update</button>

                        <button
                            dir="rtl"
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 absolute right-0"
                            type="button"
                            onClick={() => {
                                window.location.reload();
                                setIsProjectsSettingsVisible(false)}}
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