import {React, useEffect, useState} from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import styles
import moment from 'moment'; // Use 'moment', 'date-fns', or 'luxon'
import { firestore } from '../../lib/firebase';
import { fetchStateColors } from '../../lib/utils';
import './Calendar.css';

const localizer = momentLocalizer(moment); // Use the appropriate localizer

export const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [stateColors, setStateColors] = useState([]);

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
  
      setEvents(projectHistories);
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
    <div className="p-4 sm:ml-60 bg-slate-200 dark:bg-slate-900 dark:text-white">
      <div className="p-7 m-8 py-16 bg-slate-200 dark:bg-slate-900 dark:text-white">
        <div>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }} // Adjust the height as needed
            eventPropGetter={eventStyleGetter} // Apply custom event styles
          />
        </div>
      </div>  
    </div>  

    )
}



export default Calendar;