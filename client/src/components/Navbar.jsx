import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-colors">
      <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white text-sm">
          📄
        </span>
        <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
          Resume
        </span>
        <span className="text-gray-800 dark:text-gray-100">AI</span>
      </Link>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 w-9 h-9 rounded-full transition flex items-center justify-center"
        >
          {dark ? "☀️" : "🌙"}
        </button>
        {user ? (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3.5 py-1.5 rounded-full transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-1.5 rounded-full hover:opacity-90 transition font-medium shadow-soft"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
