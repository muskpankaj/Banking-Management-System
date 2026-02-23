import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function Account() {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Account Summary</h2>
        <p>Email: {user.email}</p>
        <p>Balance: ${user.balance}</p>
        <p>Account No: {user.accountNo}</p>
        <p>IFSC Code: {user.ifsc}</p>
        <p>User ID: {user.userId}</p>
      </div>
    </div>
  );
}

export default Account;