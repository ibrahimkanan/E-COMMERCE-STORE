import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import NavBar from "../components/NavBar.jsx";

import "./index.css";

function App() {
    return (
        <div className="min-h-screen bg-[#e0e0e0] text-gray-800 overflow-hidden">
            <NavBar />
            <div className="relative z-50 pt-20">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
