import { firestore } from "./firebase";

export function getRandomInt() {
  const max = 10000;
  const min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


// Fetch snapshot of db for quick search of items
export const fetchProductsSnapshot = async (title, setSnapshot, setSearchedProducts) => {
  const productsRef = firestore.collection('products');
  const snapshot = await productsRef.get();
  setSnapshot(snapshot);
  
  const data = snapshot.docs.map((doc) => doc.data());
  const projectData = data.filter((product) => product.project.includes(title));
  const serials = projectData.map((product) => product.serial);
  
  setSearchedProducts(serials);
};
  

export const fetchStateColorsSnapshot = (callback) => {
  const categoriesRef = firestore.collection("projectsCategories");

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
  const productsRef = firestore.collection('products');
  return productsRef.onSnapshot((snapshot) => {
    // Extract the data from the snapshot
    const data = snapshot.docs.map((doc) => doc.data());
    callback(data);
  });
}


export const fetchProjectsStatesSnapshot = (callback) => {
  // Fetch projects to create a dictionary of project IDs and states
  const projectsRef = firestore.collection('projects');
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