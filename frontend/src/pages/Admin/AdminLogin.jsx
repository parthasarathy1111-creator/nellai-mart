import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function AdminLogin() {
  const [email, setEmail] = useState("admin@nellaimart.com");
  const [password, setPassword] = useState("Admin@123456");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      showToast("Signed in successfully as Admin", "success");
      navigate("/admin");
    } catch (err) {
      showToast(err.message || "Invalid credentials. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl space-y-6 border border-gray-100">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-md">
            N
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Nellai<span className="text-green-600">Mart</span> Admin Console
          </h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Merchant & Platform Management Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Admin / Merchant Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nellaimart.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded-xs text-green-600 focus:ring-green-500" />
              Remember credentials
            </label>
            <span className="text-green-600 font-semibold cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" className="mt-2" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In to Dashboard"}
          </Button>
        </form>

        {/* Quick Demo Sign In Prompt */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-2">Want to explore the admin console?</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            fullWidth
            disabled={submitting}
            onClick={() => handleLogin()}
          >
            ⚡ Quick Super Admin Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
