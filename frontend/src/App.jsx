import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";

import LoadingSpinner from "./components/LoadingSpinner.jsx";
import NavBar from "./components/NavBar.jsx";

import "./index.css";

import { useEffect } from "react";

import useUserStore from "./store/useUserStore";

import { useCartStore } from "./store/useCartStore";

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();
    const { getCartItems } = useCartStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!user) return;
        getCartItems();
    }, [user, getCartItems]);

    if (checkingAuth) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-[#e0e0e0] text-gray-800 overflow-hidden">
            <NavBar />
            <div className="relative pt-20">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/" /> : <LoginPage />}
                    />
                    <Route
                        path="/signup"
                        element={user ? <Navigate to="/" /> : <SignupPage />}
                    />
                    <Route
                        path="/secret-dashboard"
                        element={
                            user ? <AdminPage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/category/:category"
                        element={<CategoryPage />}
                    />
                    <Route
                        path="/cart"
                        element={user ? <CartPage /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
            <Toaster />
        </div>
    );
}

export default App;
