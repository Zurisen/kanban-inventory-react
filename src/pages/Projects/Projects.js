import React, { useState, useEffect } from 'react'
import Column from '../../components/Projects/Column';
import { firestore } from '../../lib/firebase';
import toast from 'react-hot-toast';

export const Projects = () => {
  const [projectsCategories, setProjectsCategories] = useState([]);

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

  return (
      <div className=" flex p-4 sm:ml-[210px] bg-slate-200 dark:bg-slate-900">

        {projectsCategories.map((project, index) => (
          <div className="p-2 py-5 bg-slate-200 dark:bg-slate-900">
            <Column col={project.category} colIndex={index} columnColor={project.color}/>
          </div>
        ))}


      </div> 
)
}

export default Projects;