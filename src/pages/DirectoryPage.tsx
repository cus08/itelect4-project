import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, getBookings, getSubmissions } from '../api/client';
import { useUIStore } from '../store/uiStore';
import { UserCard } from '../components/UserCard';
import { SubmissionBadge } from '../components/SubmissionBadge';
import type { User } from '../types';

export const DirectoryPage = () => {
  const { isCompactVariant } = useUIStore();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(users.length > 0 ? users[0] : null);

  const activeVariant = isCompactVariant ? 'compact' : 'default';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span>👥 Peer Tutor & Student Directory</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {users.length}
              </span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {activeVariant} mode
            </span>
          </div>

          <div
            className={
              isCompactVariant
                ? 'flex flex-col space-y-2.5'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            }
          >
            {users.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                variant={activeVariant}
                isSelected={selectedUser?.id === u.id}
                onSelect={(usr) => setSelectedUser(usr)}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Active Session Bookings ({bookings.length})
            </h3>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <SubmissionBadge
                key={b.id}
                title={`Booking #${b.id} (${b.sessionId})`}
                status={b.status}
                notes={b.notes}
                date={b.requestedAt}
                variant={activeVariant}
              />
            ))}
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Academic Submissions & Grades
            </h3>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <SubmissionBadge
                key={sub.id}
                title={`Submission #${sub.id} - ${sub.courseId}`}
                grade={sub.grade}
                status={sub.grade && sub.grade >= 75 ? 'passed' : 'failed'}
                variant={activeVariant}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DirectoryPage;
