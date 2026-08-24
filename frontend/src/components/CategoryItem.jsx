import { useState } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";

const CategoryItem = ({ category }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="neumorphism relative overflow-hidden h-96 w-full group ">
            <Link to={"/category" + category.href}>
                <div className="w-full h-full cursor-pointer relative">
                    {/* Skeleton Loader */}
                    {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#e0e0e0] animate-pulse z-0">
                            <ImageIcon className="w-12 h-12 text-gray-400 opacity-50" />
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10" />
                    
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 relative z-0 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                    />
                    
                    <div className={`absolute bottom-0 left-0 right-0 p-4 z-20 transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
                        <h3 className="text-white text-2xl font-bold mb-2">
                            {category.name}
                        </h3>
                        <p className="text-gray-200 text-sm">
                            Explore {category.name}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CategoryItem;
