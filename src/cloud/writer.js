import { projectsRef, productsRef, categoriesRef } from "./firebase";
import firebase from "firebase";
import { firestore } from "./firebase";

const { v4: uuidv4 } = require('uuid');

export const handleInsertProjectDB = async ({projectInfo, searchedProducts}) => {

    const existingProjectSnapshot = await projectsRef.doc(searchedProducts.title).get();
    if (existingProjectSnapshot.exists) {
        throw new Error('Error: Project Code is already in use.');
    }

    // Set the new project data to the elements filled by the form + a random Id for the firestore "history" collection
    const randomId = uuidv4();
    const newProjectData = {
        ...projectInfo, 
        historyId: randomId
    }

    // Batch write the state of the products added to the db
    const batch = firestore.batch();

    searchedProducts.forEach((serial) => {
        const docRef = productsRef.doc(serial);
        const docHistoryRef = docRef.collection('history').doc(randomId);
        batch.set(docHistoryRef, {project: newProjectData.title, startDate:newProjectData.startDate, endDate:newProjectData.endDate, state:newProjectData.state});
        batch.update(docRef,  {project: newProjectData.title, historyId:randomId, lastModified: firebase.firestore.Timestamp.now()})
    });

    // Commit the batch write to update all product documents in a single batch operation
    await batch.commit();
    // Commit the new project to the projects doc db
    await projectsRef.doc(newProjectData.title).set(newProjectData);
    // Commit the new history document in the project collection
    await projectsRef.doc(newProjectData.title).collection('history').doc(randomId).set(projectInfo);
}


export const handleEditProjectDB = async ({projectInfo, searchedProducts, deletedProducts}) => {

        // Get the historyId
        const projectDocRef = await projectsRef.doc(projectInfo.title).get();
        const projectData = projectDocRef.data();
        const historyId = projectData.historyId;


        // Batch write the state of the products deleted from the project to the db
        const deletionBatch = firestore.batch();
        const collectionRef = firestore.collection('products');
        // Loop through the searchResults and create update operations for each document
        if (deletedProducts.length>0) {
            deletedProducts.forEach((serial) => {
                const docRef = collectionRef.doc(serial);
                const docHistoryRef = collectionRef.doc(serial).collection('history').doc(historyId);
                //deletionBatch.update(docHistoryRef, {endDate:firebase.firestore.Timestamp.now()});
                docHistoryRef.delete();
                deletionBatch.update(docRef, {project: "", historyId:"", lastModified: firebase.firestore.Timestamp.now()});
            });
        }

        // Batch write the state of the products added to the db
        const batch = firestore.batch();
        // Loop through the searchResults and create update operations for each document
        if (searchedProducts.length>0) {
            searchedProducts.forEach((serial) => {
                const docRef = collectionRef.doc(serial);
                const docHistoryRef = collectionRef.doc(serial).collection('history').doc(historyId);
                batch.set(docHistoryRef, {project: projectInfo.title, startDate: projectInfo.startDate, endDate:projectInfo.endDate, state: projectInfo.state});
                batch.update(docRef, {project: projectInfo.title, historyId:historyId, lastModified: firebase.firestore.Timestamp.now()});
            });
        }
  
        // Commit the batch write to update all product documents in a single batch operation
        await deletionBatch.commit();
        await batch.commit();
        // Commit the new project to the projects doc db
        await projectsRef.doc(projectInfo.title).update(projectInfo);
        await projectsRef.doc(projectInfo.title).collection('history').doc(historyId).update(projectInfo);
}


export const handleFinishProjectDB = async ({projectInfo, searchedProducts}) => {
    // Construct the reference to the document to delete
    const projectDocRef = await firestore.collection("projects").doc(projectInfo.title).get();
    const projectData = projectDocRef.data();
    // Delete the document and fetch the items linked to that document
    const projectsRef = firestore.collection("projects");

    const batch = firestore.batch();
    const collectionRef = firestore.collection('products');
    if (searchedProducts.length>0) {
        searchedProducts.forEach((serial) => {
            const docRef = collectionRef.doc(serial);
            batch.update(docRef, {project: "", historyId:"", lastModified: firebase.firestore.Timestamp.now()});
        });
    }
    await batch.commit();
    await projectsRef.doc(projectInfo.title).update({state:"Finished"});
}


export const handleDeleteProjectDB = async ({projectInfo, searchedProducts}) => {
        // Construct the reference to the document to delete
        const docRef = firestore.collection("projects").doc(projectInfo.title);
        const documentIdsSnapshot = await firestore.collection("projects").doc(projectInfo.title).collection('history').get()
        const documentIds = documentIdsSnapshot.docs.map((doc) => doc.id);

        // Delete the document and fetch the items linked to that document
        const batch = firestore.batch();
        const collectionRef = firestore.collection('products');
        if (searchedProducts.length>0) {
            searchedProducts.forEach((serial) => {
                const docRef = collectionRef.doc(serial);
                documentIds.forEach((id) => {
                    const docHistoryRef = collectionRef.doc(serial).collection('history').doc(id);
                    docHistoryRef.delete();
                })
                batch.update(docRef, {project: "", historyId:"", lastModified: firebase.firestore.Timestamp.now()});
            });
        }
        docRef.delete();
        await batch.commit();
}


export const handleMoveProjectDB = async({newMovingTaskData, deletedProducts, searchedProducts}) => {

        // Get the historyId
        const projectDocRef = await projectsRef.doc(newMovingTaskData.title).get();
        const projectData = projectDocRef.data();
        const historyId = projectData.historyId;

        // Batch write the state of the products deleted from the project to the db
        const deletionBatch = firestore.batch();
        const collectionRef = firestore.collection('products');
        // Loop through the searchResults and create update operations for each document
        if (deletedProducts.length>0) {
            deletedProducts.forEach((serial) => {
                const docRef = collectionRef.doc(serial);
                const docHistoryRef = collectionRef.doc(serial).collection('history').doc(historyId);
                deletionBatch.update(docHistoryRef, {endDate:firebase.firestore.Timestamp.now()});
                deletionBatch.update(docRef, {project: "", historyId:"", lastModified: firebase.firestore.Timestamp.now()});
            });
        }

        // Batch write the state of the products added to the db
        const batch = firestore.batch();
        // Loop through the searchResults and create update operations for each document
        if (searchedProducts.length>0) {
            searchedProducts.forEach((serial) => {
                const docRef = collectionRef.doc(serial);
                const docHistoryRef = collectionRef.doc(serial).collection('history').doc(newMovingTaskData.historyId);
                batch.set(docHistoryRef, {project: newMovingTaskData.title, startDate: newMovingTaskData.startDate, endDate:newMovingTaskData.endDate, state: newMovingTaskData.state});
                batch.update(docRef, {project: newMovingTaskData.title, historyId:newMovingTaskData.historyId, lastModified: firebase.firestore.Timestamp.now()});
            });
        }
  
        // Commit the new project to the projects doc db
        await projectsRef.doc(newMovingTaskData.title).update(newMovingTaskData);
        await projectsRef.doc(newMovingTaskData.title).collection('history').doc(newMovingTaskData.historyId).set(newMovingTaskData);

        // Commit the batch write to update all product documents in a single batch operation
        await deletionBatch.commit();
        await batch.commit();


}