import React, { useState } from "react";

function Task({ colIndex, taskIndex }) {

  return (
    <div>
      <div

        className=" w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer "
      >
        <p className=" font-bold tracking-wide ">{"Zurich"}</p>
        <p className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
          Precure Back 12
        </p>
      </div>

    </div>
  );
}

export default Task;