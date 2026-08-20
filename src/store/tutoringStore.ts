import { create } from 'zustand';
import type { TutoringSession, User, Submission, Booking, CreateBookingDto } from '../types';
import { BookingStatus, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 101,
    name: 'Marcus Rodillo',
    email: 'marcus@dlsl.edu.ph',
    role: UserRole.TUTOR,
    subjectSpecialization: ['TypeScript', 'React', 'Tailwind CSS'],
    bio: 'Senior CS student specializing in modern web architecture & UI engineering.',
  },
  {
    id: 102,
    name: 'Sophia Chen',
    email: 'sophia.c@dlsl.edu.ph',
    role: UserRole.TUTOR,
    subjectSpecialization: ['Data Structures', 'Algorithms', 'C++'],
    bio: 'Competitive programmer and algorithm mentor for lower-year students.',
  },
  {
    id: 103,
    name: 'Alex Santos',
    email: 'alex.s@dlsl.edu.ph',
    role: UserRole.TUTEE,
    subjectSpecialization: ['Web Basics', 'HTML/CSS'],
    bio: '2nd year IT student aiming to master frontend frameworks.',
  },
  {
    id: 104,
    name: 'Dr. Robert Vance',
    email: 'rvance@dlsl.edu.ph',
    role: UserRole.ADMIN,
    bio: 'Academic Program Chair & Peer Tutoring Coordinator.',
  },
];

export const MOCK_TUTORING_SESSIONS: TutoringSession[] = [
  {
    id: 'SESS-001',
    tutorId: 101,
    courseCode: 'ITELECT4',
    topic: 'TypeScript Generics & Tailwind CSS',
    description: 'Master generic interfaces, utility types, and strongly typed state styled with Tailwind CSS.',
    schedule: 'Mon & Wed 14:00 - 16:00',
    maxTutees: 5,
  },
  {
    id: 'SESS-002',
    tutorId: 102,
    courseCode: 'CS102',
    topic: 'Data Structures & Algorithms in TS',
    description: 'In-depth study of stacks, queues, binary search trees, and time complexity analysis.',
    schedule: 'Tue & Thu 10:00 - 12:00',
    maxTutees: 8,
  },
  {
    id: 'SESS-003',
    tutorId: 101,
    courseCode: 'WEB201',
    topic: 'CSS Grid, Flexbox & Responsive Layouts',
    description: 'Learn modern layout techniques, CSS custom properties, and responsive Tailwind design.',
    schedule: 'Fri 13:00 - 15:00',
    maxTutees: 6,
  },
  {
    id: 'SESS-004',
    tutorId: 102,
    courseCode: 'ITELECT4',
    topic: 'Custom React Hooks & Dark Mode Integration',
    description: 'Building custom reusable hooks with class-based dark mode and state synchronization.',
    schedule: 'Sat 09:00 - 11:00',
    maxTutees: 4,
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 301, courseId: 'ITELECT4', studentId: 103, grade: 96 },
  { id: 302, courseId: 'CS102', studentId: 103, grade: 88 },
  { id: 303, courseId: 'WEB201', studentId: 103, grade: 92 },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 501,
    sessionId: 'SESS-001',
    tuteeId: 103,
    tutorId: 101,
    status: BookingStatus.CONFIRMED,
    requestedAt: '2026-08-01T10:00:00Z',
    notes: 'Looking forward to reviewing generics and Tailwind CSS utility classes.',
  },
  {
    id: 502,
    sessionId: 'SESS-002',
    tuteeId: 103,
    tutorId: 102,
    status: BookingStatus.REQUESTED,
    requestedAt: '2026-08-05T14:30:00Z',
    notes: 'Need assistance with binary search tree balancing.',
  },
];

export interface TutoringState {
  sessions: TutoringSession[];
  users: User[];
  submissions: Submission[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  showOnlyAvailable: boolean;
  isDarkMode: boolean;
  isCompactVariant: boolean;

  setSearchQuery: (query: string) => void;
  toggleAvailableOnly: () => void;
  toggleDarkMode: () => void;
  toggleCompactVariant: () => void;
  createBooking: (session: TutoringSession, notes: string) => void;
  triggerSimulatedError: () => void;
  fetchMockData: () => void;
}

export const useTutoringStore = create<TutoringState>((set, get) => ({
  sessions: MOCK_TUTORING_SESSIONS,
  users: MOCK_USERS,
  submissions: MOCK_SUBMISSIONS,
  bookings: INITIAL_BOOKINGS,
  loading: false,
  error: null,
  searchQuery: '',
  showOnlyAvailable: false,
  isDarkMode: false,
  isCompactVariant: false,

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  toggleAvailableOnly: () => set((state) => ({ showOnlyAvailable: !state.showOnlyAvailable })),
  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    set({ isDarkMode: next });
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  toggleCompactVariant: () => set((state) => ({ isCompactVariant: !state.isCompactVariant })),
  createBooking: (session: TutoringSession, notes: string) => {
    const newBookingDto: CreateBookingDto = {
      sessionId: session.id,
      tuteeId: 103,
      tutorId: session.tutorId,
      status: BookingStatus.REQUESTED,
      requestedAt: new Date().toISOString(),
      notes: notes.trim() || 'No additional notes provided.',
    };
    const newBooking: Booking = {
      id: Date.now(),
      ...newBookingDto,
    };
    set((state) => ({ bookings: [newBooking, ...state.bookings] }));
  },
  triggerSimulatedError: () => {
    set({ loading: true, error: null });
    setTimeout(() => {
      set({ loading: false, error: 'Failed to fetch tutoring sessions from backend. Network error 503.' });
    }, 500);
  },
  fetchMockData: () => {
    set({ loading: true, error: null });
    setTimeout(() => {
      set({
        sessions: MOCK_TUTORING_SESSIONS,
        users: MOCK_USERS,
        submissions: MOCK_SUBMISSIONS,
        loading: false,
      });
    }, 500);
  },
}));
