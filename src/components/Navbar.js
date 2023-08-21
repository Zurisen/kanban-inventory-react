import React from 'react'
import { useEffect } from "react";
import { useState } from "react";
import { SettingsDropdown } from './SettingsDropwdown';
import { Link } from 'react-router-dom';

export const Navbar = ({darkMode, setDarkMode}) => {
    const [page, setPage] = useState("Projects");


  return (
    <>
        <nav className="flex flex-grow fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 justify-between">
        <div className="flex items-center justify-start ml-5">

        <img src="/logo.svg" className="h-8 mr-3" alt="" />
        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Kanban Inventory</span>
        </div>
       
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center mr-32 text-gray-500 dark:text-gray-400">
        <li className="mr-2">
            <Link to="/Projects" onClick={() => setPage("Projects")} className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg  group ${page==="Projects" ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"}`}>
            <svg className={`bi bi-calendar-week-fill w-4 h-4  ${page==="Projects" ? "text-blue-600 dark:text-blue-500" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Projects</span>
            </Link>
        </li>
        <li className="mr-2">
            <Link to="/Calendar" onClick={() => setPage("Calendar")} className={`inline-flex items-center justify-center p-4 ${page==="Calendar" ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} group`} aria-current="page">
                <i className={`bi bi-calendar-week-fill w-4 h-4 mb-1 -mr-1 ${page==="Calendar" ? "text-blue-600 dark:text-blue-500" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"}`}></i>
                <span className="flex-1 ml-3.5 whitespace-nowrap">Calendar</span>
            </Link>
        </li>
        <li className="mr-2">
            <Link to="/Inventory" onClick={() => setPage("Inventory")} className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${page==="Inventory" ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} group`}>
                <i className={`ml-0.5 bi bi-box2-fill ${page==="Inventory" ? "text-blue-600 dark:text-blue-500" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"}`}></i>
                <span className="flex-1 ml-3.5 whitespace-nowrap">Inventory</span>
            </Link>
        </li>
        <li className="mr-2">
            <Link to="/Dashboard" onClick={() => setPage("Dashboard")} className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${page==="Dashboard" ? "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"} group`}>
                <svg className={`w-5 h-5 ${page==="Dashboard" ? "text-blue-600 dark:text-blue-500" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
                <span className="ml-3">Dashboard</span>
            </Link>
        </li>

    </ul>
       
            <div className="flex items-center justify-between">
                <div className='flex'>
                    <SettingsDropdown darkMode={darkMode} setDarkMode={setDarkMode}/>
                </div>
            </div>
        </nav>
    </>
    )
}

export default Navbar;