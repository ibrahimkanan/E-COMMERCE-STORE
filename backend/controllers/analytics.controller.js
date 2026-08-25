import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const getAnalytics = async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySalesData,
        });
    } catch (error) {
        console.log("Error fetching analytics:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};

export const getDailySalesData = async (startDate, endDate) => {
    try {
        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        const dateArray = getDatesInRange(startDate, endDate);

        return dateArray.map((date) => {
            const foundData = salesData.find((item) => item._id === date);

            return {
                name: date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            };
        });
    } catch (error) {
        console.log("Error fetching daily sales data:", error);
        throw error;
    }
};

const getAnalyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
        totalSales: 0,
        totalRevenue: 0,
    };

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue,
    };
}; 

const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = startDate;

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};
