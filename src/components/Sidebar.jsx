import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="w-64 bg-indigo-700 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">🏦 MyBank</h2>

      <nav className="space-y-4">
        <Link to="/dashboard" className="block hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="/account" className="block hover:text-gray-300">
          Account Summary
        </Link>
        <Link to="/transfer" className="block hover:text-gray-300">
          Transfer
        </Link>
        <Link to="/transactions" className="block hover:text-gray-300">
          Transactions
        </Link>

        {user?.role === "admin" && (
          <Link to="/admin" className="block hover:text-gray-300">
            Admin Panel
          </Link>
        )}

        <button
          onClick={logout}
          className="mt-6 bg-red-500 px-3 py-2 rounded w-full"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;