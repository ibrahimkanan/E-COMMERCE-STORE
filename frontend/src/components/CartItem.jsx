import { Minus, Plus, Trash, Loader } from "lucide-react";
import { useCartStore } from "../store/useCartStore.js";
import { useState } from "react";

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCartStore();
    const [updatingAction, setUpdatingAction] = useState(null);

    const handleUpdateQuantity = async (newQuantity, action) => {
        setUpdatingAction(action);
        await updateQuantity(item._id, newQuantity);
        setUpdatingAction(null);
    };

    const handleRemove = async () => {
        setUpdatingAction('remove');
        await removeFromCart(item._id);
        setUpdatingAction(null);
    };

    return (
        <div className="rounded-lg p-4 md:p-6 neumorphism">
            <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                <div className="shrink-0 md:order-1">
                    <img
                        className="h-20 md:h-32 rounded object-cover shadow-md"
                        src={item.image}
                    />
                </div>
                <label className="sr-only">Choose quantity:</label>

                <div className="flex items-center justify-between md:order-3 md:justify-end">
                    <div className="flex items-center gap-3">
                        <button
                            className="neumorphism-icon-button !w-8 !h-8"
                            onClick={() =>
                                handleUpdateQuantity(item.quantity - 1, 'minus')
                            }
                            disabled={updatingAction !== null}
                        >
                            {updatingAction === 'minus' ? (
                                <Loader className="text-gray-600 animate-spin" size={16} />
                            ) : (
                                <Minus className="text-gray-600" size={16} />
                            )}
                        </button>
                        <p className="text-gray-800 font-medium">{item.quantity}</p>
                        <button
                            className="neumorphism-icon-button !w-8 !h-8"
                            onClick={() =>
                                handleUpdateQuantity(item.quantity + 1, 'plus')
                            }
                            disabled={updatingAction !== null}
                        >
                            {updatingAction === 'plus' ? (
                                <Loader className="text-gray-600 animate-spin" size={16} />
                            ) : (
                                <Plus className="text-gray-600" size={16} />
                            )}
                        </button>
                    </div>

                    <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-emerald-600">
                            ${item.price}
                        </p>
                    </div>
                </div>

                <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <p className="text-base font-medium text-gray-800 hover:text-emerald-600 hover:underline">
                        {item.name}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>

                    <div className="flex items-center gap-4">
                        <button
                            className="neumorphism-icon-button !w-8 !h-8 text-red-500 hover:text-red-600"
                            onClick={handleRemove}
                            title="Remove item"
                            disabled={updatingAction !== null}
                        >
                            {updatingAction === 'remove' ? (
                                <Loader size={16} className="animate-spin" />
                            ) : (
                                <Trash size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CartItem;
