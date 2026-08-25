import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore.js";

const FeaturedProducts = ({ featuredProducts = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const { addToCart } = useCartStore();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else if (window.innerWidth < 1280) setItemsPerPage(3);
            else setItemsPerPage(4);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
    };

    const isStartDisabled = currentIndex === 0;
    const isEndDisabled =
        currentIndex >= featuredProducts.length - itemsPerPage;

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-5xl sm:text-6xl font-bold text-gray-800 mb-8">
                    Featured
                </h2>
                <div className="relative">
                    <div className="overflow-hidden py-8 px-4 -mx-4">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                            }}
                        >
                            {featuredProducts?.map((product) => (
                                <div
                                    key={product._id}
                                    className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-4"
                                >
                                    <div className="flex w-full aspect-square min-h-[440px] relative flex-col rounded-3xl neumorphism p-4 bg-[#e6e6e6]">
                                        <div className="relative flex-1 min-h-0 rounded-2xl p-2 bg-[#e0e0e0] shadow-[inset_4px_4px_8px_#b8b8b8,inset_-4px_-4px_8px_#ffffff] overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="object-cover w-full h-full rounded-xl transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                        <div className="mt-4 flex flex-col flex-none">
                                            <h5 className="text-xl font-semibold tracking-tight text-gray-800 line-clamp-1 text-left">
                                                {product.name}
                                            </h5>
                                            <div className="mt-1 mb-3 flex items-center justify-between">
                                                <p>
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="flex items-center justify-center w-full neumorphism-button font-medium py-2.5 text-gray-800"
                                                >
                                                    <ShoppingCart className="w-5 h-5 mr-2 text-gray-800" />
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={prevSlide}
                        disabled={isStartDisabled}
                        className={`absolute top-1/2 -left-4 transform -translate-y-1/2 neumorphism-icon-button ${
                            isStartDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "text-gray-800"
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEndDisabled}
                        className={`absolute top-1/2 -right-4 transform -translate-y-1/2 neumorphism-icon-button ${
                            isEndDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "text-gray-800"
                        }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default FeaturedProducts;
