import React from 'react'
import Column from '../../components/Projects/Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const Projects = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className=" flex p-4 sm:ml-64 bg-slate-200 dark:bg-slate-900">
        <div className="p-7 py-5 bg-slate-200 dark:bg-slate-900">
          <Column col={"Rented"} colIndex={0}/>
        </div>

        <div className="p-7 py-5 bg-slate-200 dark:bg-slate-900">
          <Column col={"To be Washed"} colIndex={1}/>
        </div>
      </div> 
    </DndProvider>
)
}

export default Projects;