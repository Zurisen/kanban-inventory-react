import React, { useEffect, useState } from "react";
import Task from "./Task";
import AddTaskModal from "./AddTaskModal";
import MoveTaskModal from "./MoveTaskModal";
import { fetchProjectsInState } from "../../../cloud/reader";

function Column({ colIndex, col, columnColor }) {
  const { v4: uuidv4 } = require('uuid');

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [isMoveTaskModalOpen, setIsMoveTaskModalOpen] = useState(false);
  const [newMovingTaskData, setNewMovingTaskData] = useState({
    company: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    projectcode: '',
    state: '',
    historyId: ''
  });

  const [oldColMovingTask, setOldColMovingTask] = useState('');

  useEffect(() => {
    const callback = (data) => {
      setTasks(data);
    };
  
    const unsubscribeFetchProjectsInState = fetchProjectsInState({ callback, col });
  
    return () => {
      unsubscribeFetchProjectsInState();
    };
  }, [col]);
  
  const handleOnDrop = (e) => {
    const {company, description, startDate, endDate, title, location, state, historyId} = JSON.parse(
      e.dataTransfer.getData("text")
    );
    
    const randomId = uuidv4();
    setOldColMovingTask(state);
    setNewMovingTaskData({
      company: company,
      description: description,
      location: location,
      title: title,
      state: col,
      historyId: randomId
    })

    setIsMoveTaskModalOpen(true);
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
        <AddTaskModal colIndex={colIndex} col={col} setIsAddTaskModalOpen={setIsAddTaskModalOpen}/>
      )}
      {isMoveTaskModalOpen && (
        <MoveTaskModal setIsMoveTaskModalOpen={setIsMoveTaskModalOpen} newMovingTaskData={newMovingTaskData} setNewMovingTaskData={setNewMovingTaskData} oldColMovingTask={oldColMovingTask}/>
      )}

      {tasks.map((task, index) => (
        <Task key={index} taskIndex={index} task={task} colIndex={colIndex} col={col} columnColor={columnColor}/>
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