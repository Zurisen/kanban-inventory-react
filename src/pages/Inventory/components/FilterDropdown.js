import React, { useState, useEffect } from 'react';
import { fetchOptionalProductsCategories } from '../../../cloud/reader';
import { Dropdown } from 'flowbite-react';

export const FilterDropdown = ({ columns, setColumns }) => {

  const [availableColumns, setAvailableColumns] = useState({"category":"Category", "location":"Location", "project":"Project"});
  const [selectedColumns, setSelectedColumns] = useState({});
  useEffect(() => {
    const unsubscribeFetchOptionalProductsCategories = fetchOptionalProductsCategories((data) => {
      // Convert the array to a dictionary with the same key:value
      const dataDictionary = data.reduce((acc, element) => {
        acc[element] = element;
        return acc;
      }, {});

      // Set both availableColumns and selectedColumns with the data
      const available = {...availableColumns,
        ...dataDictionary};
      setAvailableColumns(available);

      const dataDictionaryAvailable = Object.keys(columns).reduce((acc, element) => {
        if (available[element] !== undefined) {
          acc[element] = columns[element];
        }
        return acc; // Make sure to return the accumulator in each iteration
      }, {});
      setSelectedColumns(dataDictionaryAvailable);
    });

    return () => {
      unsubscribeFetchOptionalProductsCategories();
    };
  }, [columns]);


  function filterObjectByKey(obj, keyToExclude) {
    const filteredObject = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== keyToExclude) {
        filteredObject[key] = value;
      }
    }
    return filteredObject;
  }


  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setColumns((prevSelectedColumns) => {
      if (checked) {
        // If the checkbox is checked, add the key:value pair to the selectedColumns state
        return { ...prevSelectedColumns, [name]: availableColumns[name] };
      } else {
        // If the checkbox is unchecked, remove the key from the selectedColumns state
        const filteredArray = filterObjectByKey(prevSelectedColumns, name);
        return filteredArray;
      }
    });
  };


  return (
    <div id="dropdownHover" className="z-10 absolute right-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-600">
      <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
        {Object.keys(availableColumns).map((key) => (
          <li key={key}>
            <div className="flex items-center">
              <input
                id={`checkbox-item-${key}`}
                name={key}
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                // Bind checked status to the selectedColumns state
                checked={selectedColumns[key] != undefined}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor={`checkbox-item-${key}`}
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {availableColumns[key]}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterDropdown;
