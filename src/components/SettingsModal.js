import React from 'react'
import { firestore } from '../lib/firebase';


export const SettingsModal = () => {

    
    async function handleAddColumn(event)  {
        event.preventDefault();
        try {
            const newcol = "New Column"
            const projectsRef = firestore.collection('projectsCategories');
    
            await projectsRef.doc(newcol).set({color:""});
    
            // Refresh the projects
            await handleFindProjectCategories();
            toast.success('New Column added: ' + newcol );
    
        } catch (error) {
            toast.error('Error adding column: ' + error.message);
        }
    
    }
  return (
    <div>SettingsModal</div>
  )
}
