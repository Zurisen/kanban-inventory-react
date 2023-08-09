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
    const { taskIndex, prevColIndex, prevCol, prevColprojectcode } = JSON.parse(
      e.dataTransfer.getData("text")
    );
    console.log(taskIndex, prevColIndex, prevCol, prevColprojectcode);
    if (colIndex !== prevColIndex) {
      const projectsRef = firestore.collection("projects");
      const newProjectData = {
          state: col
      }
      await projectsRef.doc(prevColprojectcode).update(newProjectData);
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
        <div className={`rounded-full w-4 h-4 bg-${columnColor} `} />
        {col} ({tasks.length})
        <button         
        onClick={() => {
          setIsAddTaskModalOpen(true);
        }}
         dir="rtl" class="bg-white  dark:bg-gray-700 shadow-[#364e7e1a] dark:hover:bg-[#635fc7] dark:text-white  font-semibold py-0 px-2 rounded shadow ml-2">
        +
        </button>
      </p>
      {isAddTaskModalOpen && (
        <AddTaskModal colIndex={colIndex} col={col} setIsAddTaskModalOpen={setIsAddTaskModalOpen} findTasksInColumn={findTasksInColumn}/>
      )}

      {tasks.map((task, index) => (
        <Task key={index} taskIndex={index} task={task} colIndex={colIndex} col={col} findTasksInColumn={findTasksInColumn}/>
      ))}
    </div>
  );
}

export default Column;