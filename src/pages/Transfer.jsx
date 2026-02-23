import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function Transfer() {
  const { user, transferMoney } = useAuth();

  const [amount, setAmount] = useState("");
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [transferType, setTransferType] = useState("IMPS");
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    name: "",
    accountNumber: "",
    ifsc: "",
    bankName: ""
  });

  // Add a beneficiary
  const addBeneficiary = () => {
    const { name, accountNumber, ifsc, bankName } = beneficiaryForm;
    if (!name || !accountNumber || !ifsc || !bankName) {
      alert("Please fill all beneficiary details");
      return;
    }
    // Account Name validation
    if (name.length < 6) {
      alert("Account name must be at least 6 characters.");
      return;
    }
    // Account Number validation
    if (!accountNumber.match(/^\d{15}$/)) {
      alert("Account number must be exactly 15 digits.");
      return;
    }
    // IFSC validation: 10 alphanumeric
    if (!ifsc.match(/^[A-Za-z0-9]{10}$/)) {
      alert("IFSC code must be exactly 10 characters (letters and numbers). ");
      return;
    }
    // Bank Name validation
    if (bankName.length < 11) {
      alert("Bank name must be greater than 10 characters.");
      return;
    }
    setBeneficiaries([...beneficiaries, { ...beneficiaryForm, id: Date.now() }]);
    setBeneficiaryForm({ name: "", accountNumber: "", ifsc: "", bankName: "" });
  };

  // Handle transfer using context function
  const handleTransfer = (e) => {
    e.preventDefault();
    if (!selectedBeneficiary) {
      alert("Please select a beneficiary");
      return;
    }
    const transferAmount = Number(amount);
    const result = transferMoney(transferAmount, selectedBeneficiary.name);
    if (result.success) {
      alert(result.message);
      setAmount("");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Transfer Money</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mb-6">
          <p className="mb-4 font-semibold">
            Current Balance: <span className="text-green-600">{" $"}{user.balance}</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mb-6">
          <h3 className="text-xl font-bold mb-4">Add Beneficiary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded"
              value={beneficiaryForm.name}
              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Account Number"
              className="border p-2 rounded"
              value={beneficiaryForm.accountNumber}
              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, accountNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="IFSC"
              className="border p-2 rounded"
              value={beneficiaryForm.ifsc}
              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, ifsc: e.target.value })}
            />
            <input
              type="text"
              placeholder="Bank Name"
              className="border p-2 rounded"
              value={beneficiaryForm.bankName}
              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, bankName: e.target.value })}
            />
          </div>
          <button
            onClick={addBeneficiary}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Beneficiary
          </button>
        </div>
        {beneficiaries.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mb-6">
            <h3 className="text-xl font-semibold mb-2">Select Beneficiary</h3>
            <select
              className="border p-2 rounded w-full md:w-1/2"
              value={selectedBeneficiary?.id || ""}
              onChange={(e) => {
                const ben = beneficiaries.find(b => b.id === Number(e.target.value));
                setSelectedBeneficiary(ben);
              }}
            >
              <option value="">-- Select Beneficiary --</option>
              {beneficiaries.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} - {b.accountNumber} ({b.bankName})
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedBeneficiary && (
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
            <h3 className="text-xl font-semibold mb-4">Transfer Money</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="mr-4 font-semibold">Transfer Type:</label>
                <select
                  className="border p-2 rounded"
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value)}
                >
                  <option value="IMPS">IMPS</option>
                  <option value="NEFT">NEFT</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Enter Amount"
                className="w-full border p-3 rounded-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Transfer Now
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transfer;