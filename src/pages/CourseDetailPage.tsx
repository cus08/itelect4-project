import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, getSessions, getSubmissions } from '../api/client';
import { SubmissionBadge } from '../components/SubmissionBadge';

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Each courseId gets its own cache entry: ['course', 'CSSWENG'] vs ['course', 'ITELECT4']
  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
  });

  const relatedSessions = sessions.filter((s) => s.courseCode === courseId);
  const relatedSubmissions = submissions.filter((s) => s.courseId === courseId);

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Fetching course <code className="font-mono text-sky-600 dark:text-sky-400">{courseId}</code> …
        </p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="text-5xl">🚫</div>
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">Course Not Found</h2>
        <p className="text-sm text-amber-700 dark:text-amber-300 font-mono leading-relaxed">
          {error instanceof Error
            ? error.message
            : `No course matched the code: ${courseId}`}
        </p>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors"
        >
          ← Back to All Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back + cache key indicator */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5 shadow-2xs"
        >
          <span>← Back to All Courses</span>
        </button>

        <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Cache key: {JSON.stringify(['course', courseId])}
        </span>
      </div>

      {/* Hero card */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 mb-3 uppercase tracking-wider">
            {course.id}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            {course.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold">
            {relatedSessions.length} tutoring session{relatedSessions.length !== 1 ? 's' : ''}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-semibold">
            {relatedSubmissions.length} submission{relatedSubmissions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Related sessions */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            📚 Tutoring Sessions
          </h3>
          {relatedSessions.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4">
              No tutoring sessions for this course yet.
            </p>
          ) : (
            <div className="space-y-3">
              {relatedSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/sessions/${s.id}`)}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-sky-400 dark:hover:border-sky-600 transition-colors"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {s.topic}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {s.schedule} · {s.maxTutees} max students
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related submissions */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            📝 Submissions
          </h3>
          {relatedSubmissions.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4">
              No submissions for this course yet.
            </p>
          ) : (
            <div className="space-y-3">
              {relatedSubmissions.map((sub) => (
                <SubmissionBadge
                  key={sub.id}
                  title={`Submission #${sub.id}`}
                  grade={sub.grade}
                  status={sub.grade !== undefined && sub.grade >= 75 ? 'passed' : 'failed'}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CourseDetailPage;
