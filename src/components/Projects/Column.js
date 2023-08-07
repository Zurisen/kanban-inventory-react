import React, { useEffect, useState } from "react";
import Task from "./Task";
import AddTaskModal from "./AddTaskModal";
import { firestore } from "../../lib/firebase";

function Column({ colIndex, col }) {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ];

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  async function findTasksInColumn(col) {
    try {
      const colRef = firestore.collection(col);
  
      // Use onSnapshot for real-time updates
      colRef.onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        console.log(data);
  
        // Check if there are no documents in the collection
        if (data.length === 0) {
          setTasks([]);
        } else {
          setTasks(data);
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setTasks([]);
    }
  }

  //findTasksInColumn(col);
  useEffect(() => {
    findTasksInColumn(col); // Fetch all products initially
  }, []);  
  
  // const handleOnDrop = (e) => {
  //   const { prevColIndex, taskIndex } = JSON.parse(
  //     e.dataTransfer.getData("text")
  //   );

  //   if (col !== prevCol) {
  //     dispatch(
  //       boardsSlice.actions.dragTask({ colIndex, prevColIndex, taskIndex })
  //     );
  //   }
  // };

  // const handleOnDragOver = (e) => {
  //   e.preventDefault();
  // };

  return (

    <div
      className="scrollbar-hide   mx-2 pt-[50px] min-w-[280px] "
    >
      <p className=" font-semibold flex items-center  gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
        <div className={`rounded-full w-4 h-4 ${colors[1]} `} />
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
        <Task key={index} taskIndex={index} task={task} col={col} findTasksInColumn={findTasksInColumn}/>
      ))}
    </div>
  );
}

export default Column;