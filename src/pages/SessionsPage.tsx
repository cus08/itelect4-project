import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTutoringStore } from '../store/tutoringStore';
import { CourseCard } from '../components/CourseCard';
import { usePrevious } from '../hooks/useCustomHooks';

export const SessionsPage = () => {
  const {
    sessions,
    bookings,
    loading,
    error,
    searchQuery,
    showOnlyAvailable,
    isCompactVariant,
    setSearchQuery,
    toggleAvailableOnly,
    triggerSimulatedError,
    fetchMockData,
  } = useTutoringStore();

  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearchQuery = usePrevious<string>(searchQuery);

  const focusSearchInput = (): void => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSelectSession = (sessionId: string): void => {
    navigate(`/sessions/${sessionId}`);
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (showOnlyAvailable) {
      const activeBookingsCount = bookings.filter((b) => b.sessionId === session.id).length;
      return matchesSearch && activeBookingsCount < session.maxTutees;
    }
    return matchesSearch;
  });

  const activeVariant = isCompactVariant ? 'compact' : 'default';

  return (
    <div className="space-y-8">
      <section className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="Search by course code, topic, or description (e.g. ITELECT4, Generics)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={focusSearchInput}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <span>🎯 Focus Input</span>
            </button>

            <button
              type="button"
              onClick={triggerSimulatedError}
              className="px-3 py-2.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60 hover:bg-rose-100 transition-colors"
              title="Test styled error state component"
            >
              ⚠️ Sim Error
            </button>

            <button
              type="button"
              onClick={fetchMockData}
              className="px-3 py-2.5 text-xs font-semibold rounded-xl bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60 hover:bg-sky-100 transition-colors"
              title="Reload mock data"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleAvailableOnly}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                showOnlyAvailable
                  ? 'bg-sky-500 text-white border-sky-600 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {showOnlyAvailable ? '✓ Filter: Open Seats Only' : 'Filter: Show All Seats'}
            </button>
          </div>

          {previousSearchQuery !== undefined && previousSearchQuery !== '' && (
            <span className="text-slate-500 dark:text-slate-400 italic">
              Previous search query: <strong className="not-italic text-slate-700 dark:text-slate-300">"{previousSearchQuery}"</strong>
            </span>
          )}
        </div>
      </section>

      {loading ? (
        <section className="space-y-6">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 rounded-full border-4 border-sky-200 dark:border-sky-900 animate-spin border-t-sky-600 dark:border-t-sky-400"></div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                Loading Peer Tutoring Data...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fetching tutoring sessions from Zustand store...
              </p>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-sm text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center mx-auto text-2xl shadow-inner">
            ⚠️
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
              Tutoring Session Loading Error
            </h3>
            <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
              {error}
            </p>
          </div>
          <button
            onClick={fetchMockData}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 transition-colors shadow-md inline-flex items-center space-x-2"
          >
            <span>🔄 Retry Loading Data</span>
          </button>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span>📚 Tutoring Sessions</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {filteredSessions.length}
              </span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click any session to view details & book
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                No tutoring sessions found
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Try clearing your search query or toggling seat filters.
              </p>
            </div>
          ) : (
            <div
              className={
                isCompactVariant
                  ? 'flex flex-col space-y-2.5'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {filteredSessions.map((session) => {
                const sessionBookings = bookings.filter((b) => b.sessionId === session.id);
                return (
                  <CourseCard
                    key={session.id}
                    session={session}
                    variant={activeVariant}
                    isSelected={false}
                    onSelect={(s) => handleSelectSession(s.id)}
                    bookedCount={sessionBookings.length}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SessionsPage;
