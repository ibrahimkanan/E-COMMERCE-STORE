import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const cart = useCartStore((state) => state.cart.length);

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-3.5">
            <div className="neumorphism w-[90%] max-w-6xl px-6 py-3">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <Link
                        to="/"
                        className="text-2xl font-extrabold text-gray-800 tracking-tight"
                    >
                        E-Commerce
                    </Link>

                    <nav className="flex flex-wrap items-center gap-3">
                        <Link to={"/"} className="nav-link cursor-pointer">
                            Home
                        </Link>

                        {user && (
                            <Link
                                to={"/cart"}
                                className="nav-link relative cursor-pointer"
                            >
                                <ShoppingCart size={18} />
                                <span className="hidden sm:inline">Cart</span>
                                {cart > 0 && (
                                    <span className="cart-badge">{cart}</span>
                                )}
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                to={"/secret-dashboard"}
                                className="neumorphism-button flex items-center gap-1"
                            >
                                <Lock size={16} />
                                <span className="hidden sm:inline">
                                    Dashboard
                                </span>
                            </Link>
                        )}

                        {user ? (
                            <button
                                className="neumorphism-button flex items-center gap-1"
                                onClick={logout}
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">
                                    Log Out
                                </span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className="neumorphism-button flex items-center gap-1"
                                >
                                    <UserPlus size={16} />
                                    Sign Up
                                </Link>
                                <Link
                                    to={"/login"}
                                    className="neumorphism-button flex items-center gap-1"
                                >
                                    <LogIn size={16} />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};
export default Navbar;
