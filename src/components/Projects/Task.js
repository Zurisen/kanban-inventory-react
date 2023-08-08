import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import { useDrag } from "react-dnd";

function Task({ col, colIndex, taskIndex, task, findTasksInColumn}) {

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Task', // Specify the type of item (should match the type specified in the drop target)
    item: { projectcode: task.projectcode, prevCol: col}, // Data that will be passed to the drop target when item is dropped
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div>
      <div
        onClick={() => {
          setIsEditTaskModalOpen(true);
        }}
        ref={drag}
        style={{ cursor: 'grab' }}
        className=" w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-3 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer ${isDragging ? 'opacity-50' : 'opacity-100'}"
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
