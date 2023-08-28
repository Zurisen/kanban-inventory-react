import { useState } from "react";
import EditProductModal from "./EditProductModal";

export default function DefaultTable({products, columns, stateColors, searchQuery, setSearchQuery}) {
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [productIndex, setProductIndex] = useState(0);
    const excludedKeys = ['name', 'serial', 'lastModified', 'state'];

    const filteredColumns = Object.keys(columns).reduce((filteredObj, key) => {
      if (!excludedKeys.includes(key)) {
        filteredObj[key] = columns[key];
      }
      return filteredObj;
    }, {});

    return (
    <div className="relative overflow-x-auto rounded-lg">
        {showEditProductModal && <EditProductModal products={products} productIndex={productIndex} setShowEditProductModal={setShowEditProductModal} setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Product name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Serial Number
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Last Modified
                    </th>

                    {Object.values(filteredColumns).map((columnValue) => (
                    <th key={columnValue} scope="col" className="px-6 py-3">
                        {columnValue}
                    </th>
                    ))}
                    <th scope="col" className="px-6 py-3">
                        State
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <>
                        <tr onClick={()=>{
                            setProductIndex(index)
                            setShowEditProductModal(true)}
                        } 
                        style={{ cursor: 'pointer' }}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {product.name}                       
                            </th>
                            <td className="px-6 py-4">
                                {product.serial}
                            </td>
                            <td className="px-6 py-4">
                                {product.lastModified}
                            </td>
                            {Object.keys(filteredColumns).map((columnKey) => (
                            <td key={columnKey} scope="col" className="px-6 py-3">
                                {product[columnKey]}
                            </td>
                            ))}

                            <td className={`px-6 py-4`} style={{color:stateColors[product.state]}}> 
                                {product.state}
                            </td>
                        </tr>
                    </>
                ))}
            </tbody>
        </table>
    </div>

  )
}


