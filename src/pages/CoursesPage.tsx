import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourses, API_URL } from '../api/client';
import { useUIStore } from '../store/uiStore';
import type { Course } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
const CourseCard = ({ course, onClick }: { course: Course; onClick: () => void }) => {
  const code = course.code || course.id || "";
  const description = course.description || (course.units ? `${course.units} units · ${course.semester || ''}` : course.semester || '');

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 dark:border dark:border-sky-800/60 uppercase tracking-wider">
            {code}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            → details
          </span>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-2">
          {course.title}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center space-x-1">
          <span>🎓</span>
          <span>View Course Details</span>
        </span>
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          Code: {code}
        </span>
      </div>
    </div>
  );
};

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

  // ===== SESSION 10: name the host it actually tried ===================
  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} -- tried {API_URL}/api/courses
      </div>
    );
  }

  const filtered = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    const code = (c.code || c.id || "").toLowerCase();
    const title = (c.title || "").toLowerCase();
    const desc = (c.description || c.semester || "").toLowerCase();
    return code.includes(q) || title.includes(q) || desc.includes(q);
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
            <Input
              id="courses-search"
              type="text"
              className="pl-10 h-10"
              placeholder="Search by course code or title (e.g. ITELECT, Web Dev)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="h-10"
            title="Refetch from API"
          >
            🔄 Refetch
          </Button>
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
              {filtered.map((course) => {
                const code = course.code || course.id || "";
                return (
                  <CourseCard
                    key={code}
                    course={course}
                    onClick={() => navigate(`/courses/${code}`)}
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

export default CoursesPage;
