import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";

function Task({ col, colIndex, taskIndex, task, findTasksInColumn}) {

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => {
          setIsEditTaskModalOpen(true);
        }}
        draggable
        className=" w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-3 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer "
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
