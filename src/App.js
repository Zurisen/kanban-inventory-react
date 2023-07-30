import { AllRoutes } from './routes/AllRoutes';
import {Navbar} from './components/Navbar'
import {Sidebar} from './components/Sidebar'

function App() {
  return (
    <div className="App h-screen bg-slate-200 dark:bg-slate-900">
      <Navbar/>
      <Sidebar/>
      <AllRoutes/>
    </div>
  );
}

export default App;