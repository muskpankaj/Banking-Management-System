import React from "react";
import { jsPDF } from "jspdf";
import { useAuth } from "../context/AuthContext";

export default function BankStatement() {
  const { transactions, user } = useAuth();

  if (!user) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <p>Please log in to view your bank statement.</p>
      </div>
    );
  }

  // Function to download PDF
  const downloadPdf = () => {
    if (!user) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bank Statement", 105, 20, null, null, "center");
    doc.setFontSize(12);
    let startY = 32;
    doc.text(`Name: ${user.email || ''}`, 20, startY);
    startY += 7;
    doc.text(`Account Number: ${user.accountNo || ''}`, 20, startY);
    startY += 7;
    doc.text(`IFSC Code: ${user.ifsc || ''}`, 20, startY);
    startY += 7;
    doc.text(`User ID: ${user.userId || ''}`, 20, startY);
    startY += 7;
    doc.text(`Balance: $${user.balance || 0}`, 20, startY);
    startY += 10;
    doc.text("Date", 20, startY);
    doc.text("Type", 60, startY);
    doc.text("Amount", 100, startY);
    doc.text("Receiver", 140, startY);
    doc.text("Balance", 170, startY);
    startY += 10;
    let runningBalance = user.balance || 0;
    // Show transactions in reverse order for correct running balance
    [...transactions].reverse().forEach((tx) => {
      doc.text(tx.date, 20, startY);
      doc.text(tx.type, 60, startY);
      doc.text(tx.amount.toString(), 100, startY);
      doc.text(tx.receiver ? tx.receiver.toString() : "-", 140, startY);
      doc.text(runningBalance.toString(), 170, startY);
      runningBalance += tx.amount; // Add back for previous balance
      startY += 10;
    });
    doc.save("BankStatement.pdf");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Bank Statement</h2>
      <div style={{ marginBottom: "16px", textAlign: "left", fontSize: "16px" }}>
        <strong>Name:</strong> {user.email}<br />
        <strong>Account Number:</strong> {user.accountNo}<br />
        <strong>IFSC Code:</strong> {user.ifsc}<br />
        <strong>User ID:</strong> {user.userId}<br />
        <strong>Balance:</strong> ${user.balance || 0}
      </div>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Receiver</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td colSpan={5}>No transactions found.</td></tr>
          ) : (
            (() => {
              let runningBalance = user.balance || 0;
              return [...transactions].reverse().map((tx, index) => {
                const row = (
                  <tr key={tx.id || index}>
                    <td>{tx.date}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.receiver || '-'}</td>
                    <td>{runningBalance}</td>
                  </tr>
                );
                runningBalance += tx.amount;
                return row;
              });
            })()
          )}
        </tbody>
      </table>
      <button 
        onClick={downloadPdf} 
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Download PDF
      </button>
    </div>
  );
}
