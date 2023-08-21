import { AllRoutes } from './routes/AllRoutes';
import {Navbar} from './components/Navbar'
import {Sidebar} from './components/Sidebar'
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState( JSON.parse(localStorage.getItem("darkMode")) || false);
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
        <AllRoutes/>
      </div>
    </div>


  );
}

export default App;