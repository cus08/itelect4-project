import { useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSessionById, getUsers, getBookings, createBooking } from '../api/client';
import { useUIStore } from '../store/uiStore';
import { SubmissionBadge } from '../components/SubmissionBadge';
import { UserCard } from '../components/UserCard';
import { BookingStatus } from '../types';

export const SessionDetailPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bookingNotes, setBookingNotes] = useState<string>('');

  const { isCompactVariant } = useUIStore();

  // 1. URL-keyed useQuery call
  const {
    data: session,
    isLoading: isSessionLoading,
    isError: isSessionError,
    error: sessionError,
  } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSessionById(sessionId!),
    enabled: !!sessionId,
  });

  // 2. Auxiliary useQuery calls
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  // 3. useMutation with invalidateQueries in onSuccess
  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setBookingNotes('');
    },
  });

  const tutor = session ? users.find((u) => u.id === session.tutorId) : undefined;
  const sessionBookings = bookings.filter((b) => b.sessionId === sessionId);

  const activeVariant = isCompactVariant ? 'compact' : 'default';

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!session) return;

    bookingMutation.mutate({
      sessionId: session.id,
      tuteeId: 103,
      tutorId: session.tutorId,
      status: BookingStatus.REQUESTED,
      requestedAt: new Date().toISOString(),
      notes: bookingNotes.trim() || 'No additional notes provided.',
    });
  };

  const handleBackNavigation = () => {
    navigate('/sessions');
  };

  if (isSessionLoading) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500">Loading session details via URL param query...</p>
      </div>
    );
  }

  if (isSessionError || !session) {
    return (
      <div className="p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="text-4xl">🔎</div>
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">Session Not Found</h2>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          {sessionError instanceof Error
            ? sessionError.message
            : `No tutoring session matched the URL parameter: ${sessionId}`}
        </p>
        <button
          onClick={handleBackNavigation}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors"
        >
          ← Return to Tutoring Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBackNavigation}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5 shadow-2xs"
        >
          <span>← Back to All Sessions</span>
        </button>

        <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          useParams Key: {sessionId}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 mb-2">
                {session.courseCode}
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {session.topic}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {session.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                  Schedule
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {session.schedule}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                  Capacity & Active Bookings
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {sessionBookings.length} / {session.maxTutees} Max Students
                </span>
              </div>
            </div>

            {tutor && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Session Mentor / Tutor
                </h3>
                <UserCard user={tutor} variant={activeVariant} isSelected={true} />
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Request Peer Booking (POST Mutation)
            </h3>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <label className="text-xs text-slate-600 dark:text-slate-400 block font-medium">
                Add notes for your tutor:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100"
                placeholder="Topic review requests, questions..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
              />
              <button
                type="submit"
                disabled={bookingMutation.isPending}
                className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                {bookingMutation.isPending ? (
                  <span>Saving Booking...</span>
                ) : (
                  <span>Book This Session (useMutation)</span>
                )}
              </button>
              {bookingMutation.isSuccess && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center">
                  ✓ Booking posted successfully! Query cache invalidated.
                </p>
              )}
            </form>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Bookings for this Session ({sessionBookings.length})
            </h3>

            {sessionBookings.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No active bookings for this session yet.</p>
            ) : (
              <div className="space-y-3">
                {sessionBookings.map((b) => (
                  <SubmissionBadge
                    key={b.id}
                    title={`Booking #${b.id}`}
                    status={b.status}
                    notes={b.notes}
                    date={b.requestedAt}
                    variant={activeVariant}
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

export default SessionDetailPage;
