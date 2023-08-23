import { AllRoutes } from './routes/AllRoutes';
import {Navbar} from './components/Navbar'
import {Sidebar} from './components/Sidebar'
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { fetchInventoryProductsSnapshot, fetchStateColorsSnapshot, fetchProjectsStatesSnapshot, fetchProjectHistoriesSnapshot, fetchProductHistoriesSnapshot} from './cloud/reader';

function App() {
  const [darkMode, setDarkMode] = useState( JSON.parse(localStorage.getItem("darkMode")) || false);

  // Snapshots an other global data that we need for all the pages to prevent unnecesary reads to DB
  const [snapshotData, setSnapshotData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [stateColors, setStateColors] = useState([]);

  useEffect(() => {

    const unsubscribeFetchStateColorsSnapshot = fetchStateColorsSnapshot((data) => {
      setStateColors(data);
    });

    const unsubscribeFetchInventoryProductsSnapshot = fetchInventoryProductsSnapshot((data) => {
      setSnapshotData(data);
    });

    const unsubscribeFetchProjectsStatesSnapshot = fetchProjectsStatesSnapshot((data) => {
      setStatesData(data);
    });

    return () => {
      unsubscribeFetchStateColorsSnapshot();
      unsubscribeFetchInventoryProductsSnapshot();
      unsubscribeFetchProjectsStatesSnapshot();
    };
  }, []);

  // theme change
  useEffect(() => {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
  
      if(darkMode){
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
    }, [darkMode]);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="App h-screen">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <Toaster/>
        <AllRoutes snapshotData={snapshotData} statesData={statesData} stateColors={stateColors}/>
      </div>
    </div>


  );
}

export default App;