import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export const Layout = () => {
  const { logout, userName } = useAuthStore();
  const { isDarkMode, toggleDarkMode, isCompactVariant, toggleCompactVariant } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeVariant = isCompactVariant ? 'compact' : 'default';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-lg font-medium transition-all ${
      isActive
        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <NavLink to="/courses" className="flex items-center space-x-3 group">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Submission Tracker & Portal
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    Full-Stack Vercel
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Course tracking, real API authentication & MongoDB Atlas
                </p>
              </div>
            </NavLink>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <NavLink to="/courses" className={linkClass}>
              🎓 Courses
            </NavLink>
            <NavLink to="/submissions" className={linkClass}>
              📝 Submissions
            </NavLink>
            <NavLink to="/sessions" className={linkClass}>
              📚 Sessions
            </NavLink>
            <NavLink to="/directory" className={linkClass}>
              👥 Directory
            </NavLink>
            {userName === null ? (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>
              </>
            ) : null}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={toggleCompactVariant}
              className="px-3 py-2 text-xs font-medium rounded-lg border bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-all flex items-center space-x-1.5 shadow-2xs"
              title="Toggle Component Variant (Compact / Default)"
            >
              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Variant: <strong className="capitalize">{activeVariant}</strong></span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all flex items-center space-x-2 shadow-2xs"
              title="Toggle Class-Based Dark Mode"
            >
              <span>{isDarkMode ? '☀️ Light' : '🌙 Dark'}</span>
            </button>

            {userName !== null && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Sign out of application"
              >
                Logout ({userName})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            Submission Tracker & Peer Tutoring Platform • Built with React 19, TypeScript, React Router 7, Zustand, React Query & Express API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
