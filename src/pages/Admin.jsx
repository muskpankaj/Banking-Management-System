import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaUserLock, FaUserCheck, FaUserSlash, FaUserPlus, FaUserTimes, FaLock, FaUnlock, FaPlusCircle, FaMinusCircle } from "react-icons/fa";

function Admin() {
  const { accounts, blockAccountTemporary, blockAccountPermanent, unblockAccount, openAccount, closeAccount, adminPassword: correctAdminPassword } = useAuth();
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const [newAccountEmail, setNewAccountEmail] = useState("");

  // Helper function to validate admin password
  const isAdminAuthenticated = () => {
    if (adminPassword !== correctAdminPassword) {
      setMessage("Invalid admin authentication");
      return false;
    }
    return true;
  };

  // Handler wrappers
  const handleTempBlock = (email) => {
    if (!isAdminAuthenticated()) return;
    const result = blockAccountTemporary(email);
    setMessage(result.message);
  };

  const handlePermBlock = (email) => {
    if (!isAdminAuthenticated()) return;
    const result = blockAccountPermanent(email);
    setMessage(result.message);
  };

  const handleUnblock = (email) => {
    if (!isAdminAuthenticated()) return;
    const result = unblockAccount(email);
    setMessage(result.message);
  };

  const handleClose = (email) => {
    if (!isAdminAuthenticated()) return;
    const result = closeAccount(email);
    setMessage(result.message);
  };

  const handleOpen = () => {
    if (!isAdminAuthenticated()) return;
    if (!newAccountEmail) {
      setMessage("Please enter a valid email to create account");
      return;
    }
    const result = openAccount(newAccountEmail);
    setMessage(result.message);
    setNewAccountEmail("");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6"><FaUserLock className="text-indigo-600" /> Admin Panel</h1>
      
      {/* Open New Account */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaUserPlus className="text-green-600" /> Open New Account</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="email"
            placeholder="User Email"
            className="border p-2 rounded w-full md:w-1/2"
            value={newAccountEmail}
            onChange={e => setNewAccountEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Admin Password"
            className="border p-2 rounded w-full md:w-1/2"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
          />
          <button onClick={handleOpen} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"><FaPlusCircle /> Open</button>
        </div>
      </div>

      {/* Manage Accounts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaUserCheck className="text-blue-600" /> Manage Accounts</h2>
        {accounts.length === 0 ? (
          <p className="text-gray-500">No user accounts found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Email</th>
                <th className="p-2">Account No</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.email} className="border-b hover:bg-gray-50">
                  <td className="p-2">{acc.email}</td>
                  <td className="p-2">{acc.accountNo}</td>
                  <td className="p-2">
                    {acc.status === "active" && <span className="text-green-600 flex items-center gap-1"><FaUnlock /> Active</span>}
                    {acc.status === "temp_blocked" && <span className="text-yellow-600 flex items-center gap-1"><FaLock /> Temp Blocked</span>}
                    {acc.status === "perm_blocked" && <span className="text-red-600 flex items-center gap-1"><FaUserSlash /> Perm Blocked</span>}
                  </td>
                  <td className="p-2 flex flex-wrap gap-2">
                    <button onClick={() => handleTempBlock(acc.email)} className="bg-yellow-400 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-yellow-500" title="Temp Block"><FaLock /></button>
                    <button onClick={() => handlePermBlock(acc.email)} className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-red-600" title="Perm Block"><FaUserSlash /></button>
                    <button onClick={() => handleUnblock(acc.email)} className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-600" title="Unblock"><FaUnlock /></button>
                    <button onClick={() => handleClose(acc.email)} className="bg-gray-700 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-800" title="Close Account"><FaMinusCircle /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Message */}
      {message && <div className="mt-6 p-4 bg-indigo-100 text-indigo-800 rounded shadow flex items-center gap-2"><FaUserLock /> {message}</div>}
    </div>
  );
}

export default Admin;