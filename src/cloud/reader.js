import { firestore } from "./firebase";

const productsRef = firestore.collection('products');
const projectsRef = firestore.collection('projects');
const categoriesRef = firestore.collection("projectsCategories");

// Fetch snapshot of db for quick search of items
export const fetchProductsSnapshot = async (title, setSnapshot, setSearchedProducts) => {
  const snapshot = await productsRef.get();
  setSnapshot(snapshot);
  
  const data = snapshot.docs.map((doc) => doc.data());
  const projectData = data.filter((product) => product.project.includes(title));
  const serials = projectData.map((product) => product.serial);
  
  setSearchedProducts(serials);
};
  

export const fetchStateColorsSnapshot = (callback) => {

  return categoriesRef.onSnapshot((snapshot) => {
    const categoriesData = snapshot.docs.reduce((acc, doc) => {
      const categoryId = doc.id;
      const categoryData = doc.data();
      acc[categoryId] = categoryData.color;
      return acc;
    }, {});
    callback(categoriesData);
  });
}


export const fetchInventoryProductsSnapshot = (callback) => {
  return productsRef.onSnapshot((snapshot) => {
    // Extract the data from the snapshot
    const data = snapshot.docs.map((doc) => doc.data());
    callback(data);
  });
}


export const fetchProjectsStatesSnapshot = (callback) => {
  // Fetch projects to create a dictionary of project IDs and states
  return projectsRef.onSnapshot((snapshot) => {
    const projectsData = snapshot.docs.reduce((acc, doc) => {
      const projectId = doc.id;
      const projectData = doc.data();
      acc[projectId] = projectData.state;
      return acc;      
    }, {});
    callback(projectsData);
  });
}


export const fetchProjectHistoriesSnapshot = (callback) => {
  const projectHistories = [];

  return projectsRef.onSnapshot((snapshot) => {
    snapshot.forEach((projectDoc) => {
      const projectCode = projectDoc.data().projectcode;
      const projectDocRef = firestore.doc(`projects/${projectDoc.id}`);

      // Fetch the history subcollection for each project
      projectDocRef.collection('history').get().then((projectHistorySnapshot) => {
        projectHistorySnapshot.forEach((historyDoc) => {
          const historyItem = historyDoc.data();
          const { startDate, endDate } = historyItem;

          const event = {
            title: projectCode,
            start: new Date(startDate.seconds * 1000), // Convert Firestore timestamp to JS Date
            end: new Date(endDate.seconds * 1000),     // Convert Firestore timestamp to JS Date
            state: historyItem.state
          };

          projectHistories.push(event);
        });

        // Call the callback with the data
        callback(projectHistories);
      });
    });
  });
}


export const fetchProductHistoriesSnapshot = (callback) => {
  const productsHistories = [];

  return productsRef.onSnapshot((snapshot) => {
    snapshot.forEach((productsDoc) => {
      const productsData = productsDoc.data();
      const serial = productsData.serial;
      const name = productsData.name;

      // Fetch the history subcollection for each project
      productsDoc.ref.collection('history').get().then((productsHistorySnapshot) => {
        productsHistorySnapshot.forEach((historyDoc) => {
          const historyItem = historyDoc.data();
          const { startDate, endDate } = historyItem;

          const event = {
            title: `[${serial}]${name} 📂${historyItem.project}`,
            start: new Date(startDate.seconds * 1000), // Convert Firestore timestamp to JS Date
            end: new Date(endDate.seconds * 1000),     // Convert Firestore timestamp to JS Date
            state: historyItem.state
          };

          productsHistories.push(event);
        });

        // Call the callback with the data
        callback(productsHistories);
      });
    });
  });
}
