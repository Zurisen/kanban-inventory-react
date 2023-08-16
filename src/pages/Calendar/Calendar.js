import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!


export const Calendar = () => {
  const events = [
    { title: 'Meeting', start: new Date() }
  ]


  return (
    <div className="p-4 sm:ml-64 bg-slate-200 dark:bg-slate-900">
    <div className="p-7 py-16 bg-slate-200 dark:bg-slate-900">
    <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
        weekends={false}
      />
    </div>  
    </div>  

    )
}



export default Calendar;