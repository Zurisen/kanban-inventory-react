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
    