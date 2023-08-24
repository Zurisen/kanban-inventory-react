import { firestore } from "./firebase";
import { productsRef, projectsRef, categoriesRef } from "./firebase";

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
      const projectCode = projectDoc.data().title;
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

export const fetchProductsToMoveSnapshot = ({newMovingTaskData, callback}) => {

  return productsRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data());
    const projectData = data.filter((product) => product.project.includes(newMovingTaskData.title));
    const serials = projectData.map((product) => product.serial);
    callback(serials);
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

export const fetchProjectsInState = ({callback, col}) => {
    // Use onSnapshot for real-time updates
    return projectsRef.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      const assignedProjects = data.filter((project) => {
        return (
          project.state.includes(col)
        )}
      );

      callback(assignedProjects);
    });
}


export const checkSearchResultsInDB = ({callback, searchedProducts, searchQuery}) => {
  return productsRef.onSnapshot((snapshot) => {
    const productsData = snapshot.docs.map((doc) => doc.data());
    // Filter the products based on the user's search query
    const filteredProducts = productsData.filter((product) => {
      const lowerCaseSearchQuery = searchQuery.toLowerCase().trim();

      // Check if the product has already been searched
      const isAlreadySearched = searchedProducts.includes(product.serial);
      
      // Check if the search query matches the product name or serial and if it's not already searched
      return (
      (!isAlreadySearched && lowerCaseSearchQuery!=='' && product.project==="") &&
      (product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
          product.serial.toString().toLowerCase().includes(lowerCaseSearchQuery))
      );
    });

    // Convert the lastModified  strings to Date objects
    filteredProducts.forEach((product) => {
    product.lastModified = new Date(product.lastModified).toLocaleString(); // Convert to a string in the desired format
    });

    // Sort the filtered products by lastModified in descending order
    filteredProducts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    callback(filteredProducts);
  });
}


export const fetchProductsInProject = ({callback, projectInfo}) => {

  return productsRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data());
    const projectData = data.filter( (product) => {
        return product.project.includes(projectInfo.title)}
    );
    const serials = projectData.map((product) => product.serial);

    callback(serials);
  });

}