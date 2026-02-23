// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToStatement = () => {
    navigate("/statement");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          Welcome, {user.email}
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg">Current Balance</h3>
            <p className="text-3xl font-bold mt-2">
              ${user.balance}
            </p>
          </div>

          <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg">Account Type</h3>
            <p className="text-2xl font-bold mt-2 capitalize">
              {user.role}
            </p>
          </div>

          <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg">Bank Status</h3>
            <p className="text-2xl font-bold mt-2">
              Active
            </p>
          </div>
        </div>

        {/* New Button to View Bank Statement */}
        <div className="mt-8">
          <button
            onClick={goToStatement}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
          >
            View Bank Statement
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;