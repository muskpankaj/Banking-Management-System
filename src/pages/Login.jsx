import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    accountNo: "",
    userId: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [forgotData, setForgotData] = useState({
    email: "",
    accountNo: "",
    newPassword: ""
  });
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    const result = login(email, password);
    if (result && result.success) {
      navigate("/dashboard");
    } else if (result && result.message) {
      setLoginError(result.message);
    } else {
      navigate("/dashboard");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.accountNo || !registerData.userId) {
      setRegisterError("All fields are required.");
      return;
    }
    if (!registerData.email.match(/^\S+@\S+\.\S+$/)) {
      setRegisterError("Invalid email format.");
      return;
    }
    if (registerData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters.");
      return;
    }
    if (!registerData.accountNo.match(/^\d{15}$/)) {
      setRegisterError("Account number must be 15 digits.");
      return;
    }
    if (!registerData.userId.match(/^USER\d+$/)) {
      setRegisterError("User ID must start with USER and be unique.");
      return;
    }
    setRegisterError("");
    setShowRegister(false);
    alert("Registration successful! You can now login.");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    
    if (!forgotData.email || !forgotData.accountNo || !forgotData.newPassword) {
      setForgotError("All fields are required");
      return;
    }
    
    if (!forgotData.email.match(/^\S+@\S+\.\S+$/)) {
      setForgotError("Invalid email format");
      return;
    }
    
    if (forgotData.newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }
    
    if (!forgotData.accountNo.match(/^\d{15}$/)) {
      setForgotError("Account number must be 15 digits");
      return;
    }
    
    const result = resetPassword(forgotData.email, forgotData.accountNo, forgotData.newPassword);
    if (result.success) {
      setForgotSuccess(result.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotData({ email: "", accountNo: "", newPassword: "" });
        setForgotSuccess("");
      }, 2000);
    } else {
      setForgotError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center overflow-hidden">
        <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-10 -left-10"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full bottom-0 right-0"></div>
        <div className="relative z-10 text-white text-center">
          <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-80 border border-white/30">
            <h1 className="text-3xl font-bold mb-4">🏦 MyBank</h1>
            <p className="text-sm opacity-90 mb-6">
              Secure Digital Banking Platform
            </p>
            <div className="bg-indigo-900 p-5 rounded-xl shadow-inner space-y-3 text-green-400 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span>Balance</span>
                <span className="blur-sm select-none">$10,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status</span>
                <span>🔒 Encrypted</span>
              </div>
            </div>
          </div>
          <div className="absolute -left-10 top-20 text-5xl animate-bounce">
            💵
          </div>
          <div className="absolute right-0 bottom-10 text-4xl animate-pulse">
            💳
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-center text-3xl font-bold mb-2 text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Login to your banking account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}

            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition transform duration-200 shadow-lg">
              Secure Login
            </button>

            <div className="flex justify-center mt-4 space-x-4">
              <button type="button" className="text-indigo-600 hover:text-indigo-800 font-semibold" onClick={() => setShowRegister(true)}>
                Register
              </button>
              <button type="button" className="text-gray-600 hover:text-gray-800 font-semibold" onClick={() => setShowForgotPassword(true)}>
                Forgot Password
              </button>
            </div>
          </form>
          
          {showRegister && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl" onClick={() => setShowRegister(false)}>&times;</button>
                <h3 className="text-2xl font-bold mb-4 text-center">Register New User</h3>
                <form onSubmit={handleRegister} className="space-y-4">
                  <input type="text" placeholder="Name" className="w-full border p-3 rounded-lg" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required />
                  <input type="email" placeholder="Email" className="w-full border p-3 rounded-lg" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required />
                  <input type="password" placeholder="New Password" className="w-full border p-3 rounded-lg" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
                  <input type="text" placeholder="Account Number (15 digits)" className="w-full border p-3 rounded-lg" value={registerData.accountNo} onChange={e => setRegisterData({ ...registerData, accountNo: e.target.value })} required />
                  <input type="text" placeholder="User ID (e.g. USER123456)" className="w-full border p-3 rounded-lg" value={registerData.userId} onChange={e => setRegisterData({ ...registerData, userId: e.target.value })} required />
                  {registerError && <p className="text-red-500 text-sm">{registerError}</p>}
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Register</button>
                </form>
              </div>
            </div>
          )}

          {showForgotPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl" onClick={() => setShowForgotPassword(false)}>&times;</button>
                <h3 className="text-2xl font-bold mb-4 text-center">Reset Password</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">Enter your username and account number to reset password</p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Username (Email)" 
                    className="w-full border p-3 rounded-lg" 
                    value={forgotData.email} 
                    onChange={e => setForgotData({ ...forgotData, email: e.target.value })} 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Account Number (15 digits)" 
                    className="w-full border p-3 rounded-lg" 
                    value={forgotData.accountNo} 
                    onChange={e => setForgotData({ ...forgotData, accountNo: e.target.value })} 
                    required 
                  />
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    className="w-full border p-3 rounded-lg" 
                    value={forgotData.newPassword} 
                    onChange={e => setForgotData({ ...forgotData, newPassword: e.target.value })} 
                    required 
                  />
                  {forgotError && <p className="text-red-500 text-sm">{forgotError}</p>}
                  {forgotSuccess && <p className="text-green-500 text-sm">{forgotSuccess}</p>}
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Reset Password</button>
                </form>
              </div>
            </div>
          )}

          <p className="text-sm text-center mt-6 text-gray-500">
            Admin Access: <span className="font-semibold">admin@bank.com</span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
