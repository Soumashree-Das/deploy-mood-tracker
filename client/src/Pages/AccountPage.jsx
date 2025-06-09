import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../Context/AuthContext.jsx";

const COLORS = [
  "#00C49F",
  "#0088FE",
  "#FFBB28",
  "#FF8042",
  "#FF6666",
  "#8884d8",
  "#82ca9d",
];

const moodCategories = () => [
  "joyful",
  "happy",
  "calmAndContent",
  "angry",
  "anxious",
  "sad",
  "depressed",
];

const AccountsPage = () => {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, setAuthState, token } = useAuth();

  // Initialize auth state and fetch mood data
  useEffect(() => {
    const initializeAndFetchData = async () => {
      // First, ensure auth state is properly set
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setAuthState({
            token: storedToken,
            user: parsedUser,
            isAuthenticated: true,
          });

          // Now fetch mood data with the token and user ID
          await fetchMoodData(storedToken, parsedUser._id);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAndFetchData();
  }, [setAuthState]);

  // Separate function to fetch mood data
  const fetchMoodData = async (authToken, userId) => {
    if (!authToken || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Configure axios with authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(
        `http://localhost:8080/journal/mood-data/${userId}`,
        config
      );

      console.log("Mood data response:", response.data);
      setMoodData(response.data.moodCounts);
    } catch (error) {
      console.error("Error fetching mood data:", error);
      if (error.response?.status === 401) {
        console.error("Authentication failed - token may be expired");
        // Optionally redirect to login or refresh token
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">Please log in to view this page</div>
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Loading mood data...</div>;
  }

  if (!moodData) {
    return <div className="p-4 text-center">No mood data available</div>;
  }

  const formatChartData = (data) =>
    Object.entries(data).map(([mood, count]) => ({
      name: mood,
      value: count,
    }));

  const barChartData = moodCategories().map((mood) => ({
    name: mood,
    "Last 30 Days": moodData.last30Days?.[mood] || 0,
    "Last 7 Days": moodData.last7Days?.[mood] || 0,
  }));

  const fetchUserProfile = async (authToken) => {
    if (!authToken) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(
        `http://localhost:8080/user/profile`,
        config
      );

      // Update the user in auth context or state
      setAuthState((prev) => ({
        ...prev,
        user: { ...prev.user, ...response.data },
      }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Mood Distribution</h2>

      {/* User Profile Section */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              Username:{" "}
              <span className="font-medium text-gray-800">
                {user?.name || "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              Email:{" "}
              <span className="font-medium text-gray-800">
                {user?.email || "N/A"}
              </span>
            </p>
            {user?.createdAt && (
              <p className="text-gray-600">
                Member since:{" "}
                <span className="font-medium text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
          {/* Add more profile fields as needed */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-medium mb-2">Mood Trend (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Last 30 Days" fill="#8884d8" />
              <Bar dataKey="Last 7 Days" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-medium mb-2">Last 7 Days (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatChartData(moodData.last7Days || {})}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {formatChartData(moodData.last7Days || {}).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
