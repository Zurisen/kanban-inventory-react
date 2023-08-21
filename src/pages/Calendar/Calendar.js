import {React, useEffect, useState} from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import styles
import moment from 'moment'; // Use 'moment', 'date-fns', or 'luxon'
import { firestore } from '../../lib/firebase';
import { fetchStateColors } from '../../lib/utils';
import './Calendar.css';

const localizer = momentLocalizer(moment); // Use the appropriate localizer

export const Calendar = () => {
  const [viewState, setViewState] = useState('projects');
  const [stateColors, setStateColors] = useState([]);
  const [productsEvents, setProductsEvents] = useState([]);
  const [projectsEvents, setProjectsEvents] = useState([]);

  const fetchProjectHistories = async () => {
    try {
      const projectHistories = [];
      const projectsSnapshot = await firestore.collection('projects').get();
  
      for (const projectDoc of projectsSnapshot.docs) {
        const projectData = projectDoc.data();
        const projectCode = projectData.projectcode;
  
        // Fetch the history subcollection for each project
        const projectHistorySnapshot = await projectDoc.ref.collection('history').get();
  
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
      }
  
      setProjectsEvents(projectHistories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchStateColors().then((data) => {
      setStateColors(data);
    }).catch((error) => {
      console.error("Error fetching colors:", error);
    });
    
    fetchProjectHistories().catch((error) => {
      console.error("Error fetching histories:", error);
    });
  }, []);

  const fetchProductHistories = async () => {
    try {
      const productsHistories = [];
      const productsSnapshot = await firestore.collection('products').get();
  
      for (const productsDoc of productsSnapshot.docs) {
        const productsData = productsDoc.data();
        const serial = productsData.serial;
        const name = productsData.name;
  
        // Fetch the history subcollection for each project
        const productsHistorySnapshot = await productsDoc.ref.collection('history').get();
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
      }
  
      setProductsEvents(productsHistories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchStateColors().then((data) => {
      setStateColors(data);
    }).catch((error) => {
      console.error("Error fetching colors:", error);
    });
    
    fetchProjectHistories().catch((error) => {
      console.error("Error fetching project histories:", error);
    });

    fetchProductHistories().catch((error) => {
      console.error("Error fetching product histories:", error);
    });
  }, []);

  // Define a function to customize event styles
  const eventStyleGetter = (event, start, end, isSelected) => {
      const backgroundColor = stateColors[event.state];
      return {
      style: {
        backgroundColor,
      },
    };
  };


  return (
    <div className="p-4 sm:ml-18 bg-slate-200 dark:bg-slate-900 dark:text-white">
      <div className="p-4 m-8 py-10 h-24 bg-slate-200 dark:bg-slate-900 dark:text-white">

        <div>
          <BigCalendar
            localizer={localizer}
            events={viewState === 'products' ? productsEvents : projectsEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }} // Adjust the height as needed
            eventPropGetter={eventStyleGetter} // Apply custom event styles
          />
        </div>
        <div className="flex justify-center mt-5">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" onClick={() => {setViewState('projects')}} className={`px-4 py-2 text-sm font-medium text-gray-900 ${viewState==='projects' ? 'bg-gray-700': 'bg-transparent'} border border-gray-900 rounded-l-md hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700`}>
              Projects View
            </button>
            <button type="button" onClick={() => {setViewState('products')}} className={`px-4 py-2 text-sm font-medium text-gray-900 ${viewState==='products' ? 'bg-gray-700': 'bg-transparent'} border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700`}>
              Products View
            </button>
          </div>
        </div>

      </div>  
    </div>  

    )
}



export default Calendar;