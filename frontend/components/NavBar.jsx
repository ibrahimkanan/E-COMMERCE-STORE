import { Link } from "react-router-dom";
import { ShoppingCart, LockIcon } from "lucide-react";

const NavBar = () => {
    const user = true;
    const isAdmin = true;
    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] h-24 z-50 flex justify-between items-center px-8 neumorphism">
            <Link to="/" className="text-xl font-bold text-gray-800">
                E-COMMERCE
            </Link>

            <nav className="flex items-center gap-6">
                <Link to="/" className="nav-link">
                    Home
                </Link>
                {user && (
                    <Link
                        to="/cart"
                        className="nav-link relative"
                    >
                        <ShoppingCart size={20} />
                        <span className="hidden sm:inline">Cart</span>
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">3</span>
                    </Link>
                )}
                {user && isAdmin && (
                    <Link
                        to="/admin"
                        className="nav-link"
                    >
                        <LockIcon size={20} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                )}
                {user ? (
                    <button className="nav-link">
                        Logout
                    </button>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="nav-link"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="nav-link"
                        >
                            Signup
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default NavBar;
