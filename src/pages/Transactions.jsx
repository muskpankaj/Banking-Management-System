import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function Transactions() {
  const { transactions } = useAuth();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No transactions available
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
              >
                {/* Left Side */}
                <div>
                  <p className="font-semibold text-lg">
                    {tx.type} to {tx.receiver}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tx.date}
                  </p>
                </div>

                {/* Right Side Amount */}
                <div className="text-right">
                  <p className="text-red-500 font-bold text-lg">
                    -${tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;