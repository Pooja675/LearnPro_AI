import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import authService from '../../services/authService'
import { Layers, Mail, Lock, ArrowRight, User } from "lucide-react"
import toast from "react-hot-toast"

const RegisterPage = () => {
  const [username, setUsername] = useState("")       // ✅ fixed: was useState(second)
  const [email, setEmail] = useState("")             // ✅ fixed: was useState(" ")
  const [password, setPassword] = useState("")       // ✅ fixed: was useState(" ")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Username is required.")
      return
    }
    if (!email.trim()) {
      setError("Email is required.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setError("")
    setLoading(true)

    try {
      await authService.register(username, email, password)  // ✅ fixed: added username
      toast.success("Registered successfully! Please login.")
      navigate("/login")
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.")
      toast.error(err.message || "Failed to register.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-indigo-100">

      {/* Dot grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#c4b5fd_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md px-6 flex flex-col items-center">

        {/* Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-indigo-100/60 px-8 py-10">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-300/40 mb-5">
              <Layers className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
              Create Account
            </h1>
            <p className="text-sm text-slate-400">
              Sign up to get started
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">

            {/* Username Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Username
              </label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all duration-200 ${
                focusedField === "username"
                  ? "border-violet-400 ring-2 ring-violet-100 bg-white"
                  : "border-slate-200 bg-slate-50"
              }`}>
                <div className={`transition-colors duration-200 ${
                  focusedField === "username" ? "text-violet-500" : "text-slate-400"
                }`}>
                  <User className="w-4 h-4" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  placeholder="Enter your Username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all duration-200 ${
                focusedField === "email"
                  ? "border-violet-400 ring-2 ring-violet-100 bg-white"
                  : "border-slate-200 bg-slate-50"
              }`}>
                <div className={`transition-colors duration-200 ${
                  focusedField === "email" ? "text-violet-500" : "text-slate-400"
                }`}>
                  <Mail className="w-4 h-4" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  placeholder="Enter your Email ID"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all duration-200 ${
                focusedField === "password"
                  ? "border-violet-400 ring-2 ring-violet-100 bg-white"
                  : "border-slate-200 bg-slate-50"
              }`}>
                <div className={`transition-colors duration-200 ${
                  focusedField === "password" ? "text-violet-500" : "text-slate-400"
                }`}>
                  <Lock className="w-4 h-4" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md shadow-indigo-200/60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}
            </button>

          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>

        </div>

        {/* Legal text */}
        <p className="text-center text-xs text-slate-400 mt-4">
          By continuing, you agree to our Terms and Privacy Policy
        </p>

      </div>
    </div>
  )
}

export default RegisterPage