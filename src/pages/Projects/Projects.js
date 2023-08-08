import React, { useState, useEffect } from 'react'
import Column from '../../components/Projects/Column';
import { firestore } from '../../lib/firebase';

export const Projects = () => {
  const [projectsCategories, setProjectsCategories] = useState([]);

  const handleFindProjectCategories = async () => {
    const categoriesRef = firestore.collection("projectsCategories");
    categoriesRef.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.id);
      setProjectsCategories(data);
    });
  }

  useEffect(() => {
    handleFindProjectCategories();
  }, []);

  return (
      <div className=" flex p-4 sm:ml-64 bg-slate-200 dark:bg-slate-900">

        {projectsCategories.map((category, index) => (
          <div className="p-7 py-5 bg-slate-200 dark:bg-slate-900">
            <Column col={category} colIndex={index}/>
          </div>
        ))}

      </div> 
)
}

export default Projects;