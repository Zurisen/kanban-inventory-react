'use client';

export default function DefaultTable({products}) {
  
    return (
    <div class="relative overflow-x-auto rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Product name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Serial Number
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Category
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Location
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Last Modified
                    </th>
                    <th scope="col" class="px-6 py-3">
                        State
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {product.name}                       
                            </th>
                            <td class="px-6 py-4">
                                {product.serial}
                            </td>
                            <td class="px-6 py-4">
                                {product.category}
                            </td>
                            <td class="px-6 py-4">
                                {product.location}
                            </td>
                            <td class="px-6 py-4">
                                {product.lastModified}
                            </td>
                            <td class="px-6 py-4">
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


