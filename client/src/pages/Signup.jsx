import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-center items-start px-16 bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold mb-4 leading-tight">
            Your resume,<br />optimized by AI.
          </h2>
          <p className="text-white/80 text-base max-w-sm">
            Create a free account and get instant, personalized feedback on every
            resume you send out.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
              Instant ATS match score
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
              AI-rewritten bullet points
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
              Compare multiple resumes
            </li>
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-16 bg-gray-50 dark:bg-gray-950">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-softLg p-8"
        >
          <h1 className="font-display text-2xl font-bold mb-1 text-gray-800 dark:text-gray-100">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Free forever. No credit card needed.
          </p>

          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            Full name
          </label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            required
          />

          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            required
          />

          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            Password
          </label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            required
            minLength={6}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:opacity-90 disabled:opacity-60 text-white py-2.5 rounded-lg font-semibold text-sm transition shadow-soft"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
