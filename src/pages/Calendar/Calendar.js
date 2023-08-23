import {React, useEffect, useState} from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import styles
import moment from 'moment'; // Use 'moment', 'date-fns', or 'luxon'
import { firestore } from '../../cloud/firebase';
import { fetchProductHistoriesSnapshot,  fetchProjectHistoriesSnapshot} from '../../cloud/reader';
import './Calendar.css';

const localizer = momentLocalizer(moment); // Use the appropriate localizer

export const Calendar = ({stateColors}) => {
  const [viewState, setViewState] = useState('projects');
  const [projectsEvents, setProjectsEvents] = useState([]); // For the calendar
  const [productsEvents, setProductsEvents] = useState([]); // For the calendar

  useEffect(() => {
    const unsubscribeFetchProjectHistoriesSnapshot = fetchProjectHistoriesSnapshot((data) => {
      setProjectsEvents(data);
    });

    const unsubscribeFetchProductHistoriesSnapshot = fetchProductHistoriesSnapshot((data) => {
      setProductsEvents(data);
    });

    return () => {
      unsubscribeFetchProjectHistoriesSnapshot();
      unsubscribeFetchProductHistoriesSnapshot();
    };
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