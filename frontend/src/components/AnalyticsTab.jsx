import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../components/LoadingSpinner";
const AnalyticsTab = () => {
    const [analyticsData, setAnalyticsData] = useState({
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dailySalesData, setDailySalesData] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get("/analytics");
                setAnalyticsData(response.data.analyticsData);
                setDailySalesData(response.data.dailySalesData);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalyticsCard
                    title="Total Users"
                    value={analyticsData.users.toLocaleString()}
                    icon={Users}
                    color="text-teal-600"
                />
                <AnalyticsCard
                    title="Total Products"
                    value={analyticsData.products.toLocaleString()}
                    icon={Package}
                    color="text-green-600"
                />
                <AnalyticsCard
                    title="Total Sales"
                    value={analyticsData.totalSales.toLocaleString()}
                    icon={ShoppingCart}
                    color="text-cyan-600"
                />
                <AnalyticsCard
                    title="Total Revenue"
                    value={`$${analyticsData.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="text-emerald-600"
                />
            </div>
            <motion.div
                className="neumorphism p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                        <XAxis dataKey="name" stroke="#4b5563" />
                        <YAxis yAxisId="left" stroke="#4b5563" />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#4b5563"
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="sales"
                            stroke="#10B981"
                            activeDot={{ r: 8 }}
                            name="Sales"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            activeDot={{ r: 8 }}
                            name="Revenue"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        className={`neumorphism p-6 overflow-hidden relative h-full flex flex-col justify-between`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex justify-between items-start z-10 relative mb-4">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider w-2/3 text-left">
                {title}
            </p>
            <div className={`neumorphism-badge p-3 ${color}`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
        <div className="z-10 relative text-left">
            <h3 className="text-gray-800 text-3xl font-bold">{value}</h3>
        </div>
        <div className="absolute -bottom-6 -right-6 text-gray-300 opacity-40 pointer-events-none">
            <Icon className="h-32 w-32" />
        </div>
    </motion.div>
);
