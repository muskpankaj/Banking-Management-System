import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const ADMIN_PASSWORD = "adminpass";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]); // Admin: all accounts
  const [passwords, setPasswords] = useState({}); // Store passwords by email

  // Helper: find account by email
  const findAccount = (email) => accounts.find(acc => acc.email === email);

// Login: admin or user
  const login = (email, password) => {
    if (email === "admin@bank.com") {
      // Check admin password
      if (password && password !== ADMIN_PASSWORD) {
        return { success: false, message: "Invalid admin password" };
      }
      setUser({ email, role: "admin" });
      setTransactions([]);
      return { success: true };
    }
    
    // Check if password is set and matches for user
    if (passwords[email] && passwords[email] !== password) {
      return { success: false, message: "Invalid password" };
    }
    
    let acc = findAccount(email);
    if (!acc) {
      // Auto-create for demo
      acc = {
        email,
        role: "user",
        balance: 10000,
        accountNo: String(Math.floor(100000000000000 + Math.random() * 900000000000000)),
        ifsc: "BANK0001234",
        userId: "USER" + Date.now(),
        status: "active",
      };
      setAccounts(prev => [...prev, acc]);
    }
    setUser(acc);
    setTransactions([]);
    return { success: true };
  };

  // Admin: validate password
  const isAdminAuthenticated = (password) => {
    if (password !== ADMIN_PASSWORD) return false;
    return true;
  };

  // Admin actions
  const blockAccountTemporary = (email, password) => {
    if (!isAdminAuthenticated(password)) return { success: false, message: "Invalid admin authentication" };
    setAccounts(prev => prev.map(acc => acc.email === email ? { ...acc, status: "temp_blocked" } : acc));
    return { success: true, message: "Account temporarily blocked" };
  };

  const blockAccountPermanent = (email, password) => {
    if (!isAdminAuthenticated(password)) return { success: false, message: "Invalid admin authentication" };
    setAccounts(prev => prev.map(acc => acc.email === email ? { ...acc, status: "perm_blocked" } : acc));
    return { success: true, message: "Account permanently blocked" };
  };

  const unblockAccount = (email, password) => {
    if (!isAdminAuthenticated(password)) return { success: false, message: "Invalid admin authentication" };
    setAccounts(prev => prev.map(acc => acc.email === email ? { ...acc, status: "active" } : acc));
    return { success: true, message: "Account unblocked" };
  };

  const openAccount = (email, password) => {
    if (!isAdminAuthenticated(password)) return { success: false, message: "Invalid admin authentication" };
    if (findAccount(email)) return { success: false, message: "Account already exists" };
    const acc = {
      email,
      role: "user",
      balance: 10000,
      accountNo: String(Math.floor(100000000000000 + Math.random() * 900000000000000)),
      ifsc: "BANK0001234",
      userId: "USER" + Date.now(),
      status: "active",
    };
    setAccounts(prev => [...prev, acc]);
    return { success: true, message: "Account opened successfully" };
  };

  const closeAccount = (email, password) => {
    if (!isAdminAuthenticated(password)) return { success: false, message: "Invalid admin authentication" };
    setAccounts(prev => prev.filter(acc => acc.email !== email));
    return { success: true, message: "Account closed successfully" };
  };

// User logout
  const logout = () => {
    setUser(null);
    setTransactions([]);
  };

  // Forgot Password - Reset password with verification
  const resetPassword = (email, accountNo, newPassword) => {
    const acc = findAccount(email);
    if (!acc) {
      return { success: false, message: "Account not found" };
    }
    if (acc.accountNo !== accountNo) {
      return { success: false, message: "Account number does not match" };
    }
    
    // Update password
    setPasswords(prev => ({ ...prev, [email]: newPassword }));
    return { success: true, message: "Password reset successfully! You can now login with your new password." };
  };

  // Money transfer
  const transferMoney = (amount, receiverEmail) => {
    if (!user) return { success: false, message: "User not logged in" };
    let receiver = findAccount(receiverEmail);
    
    // Auto-create receiver account if not found (for demo purposes)
    if (!receiver) {
      receiver = {
        email: receiverEmail,
        role: "user",
        balance: 0,
        accountNo: String(Math.floor(100000000000000 + Math.random() * 900000000000000)),
        ifsc: "BANK0001234",
        userId: "USER" + Date.now(),
        status: "active",
      };
      setAccounts(prev => [...prev, receiver]);
    }
    if (amount <= 0) return { success: false, message: "Enter valid amount" };
    if (amount > user.balance) return { success: false, message: "Insufficient balance" };

    // Update balances
    setAccounts(prev => prev.map(acc => {
      if (acc.email === user.email) return { ...acc, balance: acc.balance - amount };
      if (acc.email === receiverEmail) return { ...acc, balance: acc.balance + amount };
      return acc;
    }));

    setUser(prev => ({ ...prev, balance: prev.balance - amount }));

    const newTransaction = {
      id: Date.now(),
      type: "Transfer",
      amount,
      receiver: receiverEmail,
      date: new Date().toLocaleString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    return { success: true, message: "Money transferred successfully" };
  };

return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        transactions,
        transferMoney,
        accounts,
        blockAccountTemporary,
        blockAccountPermanent,
        unblockAccount,
        openAccount,
        closeAccount,
        resetPassword,
        adminPassword: ADMIN_PASSWORD, // for Admin panel reference
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);