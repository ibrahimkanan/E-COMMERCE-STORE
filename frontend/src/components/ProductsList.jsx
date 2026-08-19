import { useState } from "react";
import { motion } from "framer-motion";
import { Trash, Star, Loader } from "lucide-react";
import { useProductStore } from "../store/useProductStore";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } =
        useProductStore();
    const [loadingAction, setLoadingAction] = useState({ id: null, action: null });

    const handleToggleFeature = async (id) => {
        setLoadingAction({ id, action: 'feature' });
        await toggleFeaturedProduct(id);
        setLoadingAction({ id: null, action: null });
    };

    const handleDelete = async (id) => {
        setLoadingAction({ id, action: 'delete' });
        await deleteProduct(id);
        setLoadingAction({ id: null, action: null });
    };

    console.log("products", products);

    return (
        <motion.div
            className="neumorphism overflow-hidden max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-[#d5d5d5]">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            Product
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            Price
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            Category
                        </th>

                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            Featured
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-300">
                    {products?.map((product) => (
                        <tr
                            key={product._id}
                            className="hover:bg-[#d5d5d5] transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img
                                            className="h-10 w-10 rounded-md object-cover shadow-sm"
                                            src={product.image}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-semibold text-gray-800">
                                            {product.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-700 font-medium">
                                    ${product.price.toFixed(2)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-700 font-medium">
                                    {product.category}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => handleToggleFeature(product._id)}
                                    disabled={loadingAction.id === product._id && loadingAction.action === 'feature'}
                                    className={`neumorphism-icon-button disabled:opacity-50 disabled:cursor-not-allowed ${
                                        product.isFeatured
                                            ? "active text-yellow-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {loadingAction.id === product._id && loadingAction.action === 'feature' ? (
                                        <Loader className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Star className="h-5 w-5" />
                                    )}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    disabled={loadingAction.id === product._id && loadingAction.action === 'delete'}
                                    className="neumorphism-icon-button text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingAction.id === product._id && loadingAction.action === 'delete' ? (
                                        <Loader className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Trash className="h-5 w-5" />
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
};
export default ProductsList;
