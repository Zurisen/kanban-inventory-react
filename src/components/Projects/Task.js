import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";

function Task({ col, colIndex, taskIndex, task, findTasksInColumn, columnColor}) {
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);


  const handleOnDrag = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex:taskIndex, prevColIndex: colIndex, prevCol: col, prevColprojectcode:task.projectcode })
    );
  };

  const handleOnDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <div
        onClick={() => {
          setIsEditTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        onDragEnd={handleOnDragEnd}
        className={`w-[280px] first:my-5 rounded-lg bg-white  dark:bg-gray-800 shadow-[#364e7e1a] py-3 px-3 shadow-lg hover:text-indigo-600 hover:dark:text-indigo-400 dark:text-white cursor-pointer border border-transparent hover:border-indigo-600 hover:dark:border-indigo-500 hover:bg-indigo-100 ${isDragging ? 'opacity-60' : ''}`}
      >
        <p className=" text-sm dark:text-gray-500">{task.company}</p>
        <p className=" font-bold tracking-wide ">{task.projectcode}</p>
        <p className=" font-light text-sm pt-2">
          {task.description}
        </p>

      </div>
      {isEditTaskModalOpen && (
        <EditTaskModal
          col={col}
          task={task}
          setIsEditTaskModalOpen={setIsEditTaskModalOpen}
          findTasksInColumn={findTasksInColumn}
        />
      )}
        
    </div>
  );
}

export default Task;
