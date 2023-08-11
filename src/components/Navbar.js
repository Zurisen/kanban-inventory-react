import React from 'react'
import { useEffect } from "react";
import { useState } from "react";
import { SettingsDropdown } from './SettingsDropwdown';

export const Navbar = ({darkMode, setDarkMode}) => {

  return (
    <>
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">

                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="" />
                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Kanban Inventory</span>
                </div>

      
                <div className='flex'>
                    <SettingsDropdown darkMode={darkMode} setDarkMode={setDarkMode}/>
                </div>
            </div>
        </div>
        </nav>
    </>
    )
}

export default Navbar;