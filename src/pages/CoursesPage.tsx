import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../api/client';
import { useUIStore } from '../store/uiStore';
import type { Course } from '../types';

// ── tiny skeleton card ──────────────────────────────────────────────────────
const CourseSkeletonCard = () => (
  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-pulse space-y-3">
    <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
    <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
    <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
    <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
  </div>
);

// ── single course card ──────────────────────────────────────────────────────
const CourseCard = ({ course, onClick }: { course: Course; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group relative flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-200"
  >
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 dark:border dark:border-sky-800/60 uppercase tracking-wider">
          {course.id}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          → details
        </span>
      </div>

      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-2">
        {course.title}
      </h3>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
        {course.description}
      </p>
    </div>

    <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <span className="flex items-center space-x-1">
        <span>🎓</span>
        <span>View Course Details</span>
      </span>
      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
        ID: {course.id}
      </span>
    </div>
  </div>
);

// ── page ────────────────────────────────────────────────────────────────────
export const CoursesPage = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useUIStore();

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const filtered = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <section className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input
              id="courses-search"
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="Search by course code or title (e.g. ITELECT, Web Dev)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-2.5 text-xs font-semibold rounded-xl bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60 hover:bg-sky-100 transition-colors"
            title="Refetch from JSON server"
          >
            🔄 Refetch
          </button>
        </div>
      </section>

      {/* States */}
      {isLoading ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span>📖 Courses</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => <CourseSkeletonCard key={n} />)}
          </div>
        </section>
      ) : isError ? (
        <section className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-sm text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center mx-auto text-2xl shadow-inner">
            ⚠️
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
              API Connection Failure
            </h3>
            <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed font-mono">
              {error instanceof Error ? error.message : 'Failed to fetch courses from server.'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 transition-colors shadow-md inline-flex items-center space-x-2"
          >
            <span>🔄 Retry</span>
          </button>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span>📖 Courses</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {filtered.length}
              </span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click a course to view details
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                No courses matched "{searchQuery}"
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Try clearing the search box above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/courses/${course.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default CoursesPage;
