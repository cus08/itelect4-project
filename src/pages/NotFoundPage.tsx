import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/sessions');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto text-3xl font-extrabold font-mono">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested page route does not exist or has been moved. No blank pages here!
          </p>
        </div>

        <button
          type="button"
          onClick={handleReturnHome}
          className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md flex items-center justify-center space-x-2"
        >
          <span>🏠 Return to Peer Tutoring Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
