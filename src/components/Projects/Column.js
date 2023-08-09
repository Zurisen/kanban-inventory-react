import React, { useEffect, useState } from "react";
import Task from "./Task";
import AddTaskModal from "./AddTaskModal";
import { firestore } from "../../lib/firebase";
import { shuffle } from "lodash";
import toast from 'react-hot-toast';

function Column({ colIndex, col, columnColor }) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);


  async function findTasksInColumn(col) {
    try {
      const colRef = firestore.collection("projects");
  
      // Use onSnapshot for real-time updates
      colRef.onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        const assignedProjects = data.filter((project) => {
          return (
            project.state.includes(col)
          )}
        );
        // Check if there are no documents in the collection
        if (assignedProjects.length === 0) {
          setTasks([]);
        } else {
          setTasks(assignedProjects);
        }
      });
    } catch (error) {
      toast.error('Error fetching data:', error);
      setTasks([]);
    }
  }

  useEffect(() => {
    findTasksInColumn(col); // Fetch all products initially
  }, []);  
  
  const handleOnDrop = async (e) => {
    const {taskIndex, prevColIndex, prevCol, prevColprojectcode } = JSON.parse(
      e.dataTransfer.getData("text")
    );
    if (colIndex !== prevColIndex) {
      const projectsRef = firestore.collection("projects");
      const newProjectData = {
          state: col
      }
      await projectsRef.doc(prevColprojectcode).update(newProjectData);
      toast.success(`${prevColprojectcode} moved from "${prevCol}" to "${col}"`);
    }
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  return (

    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className={`scrollbar-hid mx-2 pt-[50px] min-w-[280px]`}
    >
      <p className=" font-semibold flex items-center  gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
        <div className={`rounded-full w-4 h-4`} style={{backgroundColor:columnColor}}/>
        {col} ({tasks.length})
        <button         
        onClick={() => {
          setIsAddTaskModalOpen(true);
        }}
         dir="rtl" className={`bg-white  dark:bg-gray-700 shadow-[#364e7e1a] hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-white  font-semibold py-0 px-2 rounded shadow ml-2`}>
        +
        </button>
      </p>
      {isAddTaskModalOpen && (
        <AddTaskModal colIndex={colIndex} col={col} setIsAddTaskModalOpen={setIsAddTaskModalOpen} findTasksInColumn={findTasksInColumn}/>
      )}

      {tasks.map((task, index) => (
        <Task key={index} taskIndex={index} task={task} colIndex={colIndex} col={col} findTasksInColumn={findTasksInColumn} columnColor={columnColor}/>
      ))}
      {
        <div>
        <div
            className={`w-[280px] first:my-5 border border-gray-600 rounded-lg  bg-transparent dark:bg-transparent shadow-[#364e7e1a] py-3 px-3 shadow-lg hover:bg-gray-300 hover:dark:bg-gray-800`}
            onClick={() => {setIsAddTaskModalOpen(true)}}
            style={{ cursor: 'pointer' }}
          >
            <p className=" text-center font-bold tracking-wide mt-6 mb-6 text-gray-600"> Add or Drag a Project</p>
          </div>
          
        </div>
    }
    </div>
  );
}

export default Column;