import { useState } from "react";
import EditProductModal from "./EditProductModal";

export default function DefaultTable({products, stateColors, searchQuery, setSearchQuery, setSnapshotsUpdate}) {
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [productIndex, setProductIndex] = useState(0);

    return (
    <div className="relative overflow-x-auto rounded-lg">
        {showEditProductModal && <EditProductModal products={products} productIndex={productIndex} setShowEditProductModal={setShowEditProductModal} setSearchQuery={setSearchQuery} searchQuery={searchQuery} setSnapshotsUpdate={setSnapshotsUpdate}/>}
        <table className="w-full text-sm text-left    text-gray-400">
            <thead className="text-xs uppercase    bg-gray-700   text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Product name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Serial Number
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Location
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Last Modified
                    </th>
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
                        className="   bg-gray-800   border-gray-700    hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap   text-white">
                                {product.name}                       
                            </th>
                            <td className="px-6 py-4">
                                {product.serial}
                            </td>
                            <td className="px-6 py-4">
                                {product.category}
                            </td>
                            <td className="px-6 py-4">
                                {product.location}
                            </td>
                            <td className="px-6 py-4">
                                {product.lastModified}
                            </td>
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


