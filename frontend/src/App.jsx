import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import LoadingSpinner from "./components/loadingSpinner.jsx";
import NavBar from "./components/NavBar.jsx";
import { Toaster } from "react-hot-toast";
import useUserStore from "./store/useUserStore";

import "./index.css";
import { useEffect } from "react";

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

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
                        element={user ? <HomePage /> : <LoginPage />}
                    />
                    <Route
                        path="/signup"
                        element={user ? <HomePage /> : <SignupPage />}
                    />
                </Routes>
            </div>
            <Toaster />
        </div>
    );
}

export default App;
