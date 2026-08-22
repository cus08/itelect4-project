import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubmissions, getCourses, createSubmission } from '../api/client';
import { SubmissionBadge } from '../components/SubmissionBadge';

export const SubmissionsPage = () => {
  const queryClient = useQueryClient();

  // Form state
  const [courseId, setCourseId] = useState('ITELECT4');
  const [grade, setGrade] = useState<number | ''>('');

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      // Invalidate so the list re-fetches and shows the new card
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setGrade('');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!courseId || grade === '') return;
    mutation.mutate({
      courseId,
      studentId: 103,         // logged-in demo user
      grade: Number(grade),
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Add Submission form ──────────────────────────────────── */}
        <div className="lg:col-span-5">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              ➕ Add Submission <span className="text-xs font-normal text-slate-400">(POST mutation)</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                  Course
                </label>
                <select
                  id="submission-course"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} – {c.title}
                    </option>
                  ))}
                  {courses.length === 0 && (
                    <option value="ITELECT4">ITELECT4</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                  Grade (0 – 100)
                </label>
                <input
                  id="submission-grade"
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g. 92"
                />
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || grade === ''}
                className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Submit Grade (useMutation)</span>
                )}
              </button>

              {mutation.isSuccess && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center animate-pulse">
                  ✓ Submission saved! Cache invalidated — list updated below.
                </p>
              )}
              {mutation.isError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold text-center">
                  ✗ {mutation.error instanceof Error ? mutation.error.message : 'Failed to save.'}
                </p>
              )}
            </form>
          </section>
        </div>

        {/* ── Submissions list ────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>📝 All Submissions</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                  {submissions.length}
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                  />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">
                No submissions yet. Add one using the form.
              </p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <SubmissionBadge
                    key={sub.id}
                    title={`Submission #${sub.id} – ${sub.courseId}`}
                    grade={sub.grade}
                    status={
                      sub.grade !== undefined && sub.grade >= 75 ? 'passed' : 'failed'
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
};

export default SubmissionsPage;
