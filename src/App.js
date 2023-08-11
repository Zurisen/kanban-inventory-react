import { AllRoutes } from './routes/AllRoutes';
import {Navbar} from './components/Navbar'
import {Sidebar} from './components/Sidebar'
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
function App() {
  return (
    <div className="app"> 
      <div className="App h-screen bg-slate-900 dark:bg-slate-900">
        <Navbar/>
        <Sidebar/>
        <Toaster/>
        <AllRoutes/>
      </div>
    </div>


  );
}

export default App;