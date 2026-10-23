import {
  UserRole,
  BookingStatus,
  getById,
  getFirst,
  type User,
  type Course,
  type Submission,
  type TutoringSession,
  type Booking,
  type ApiResponse,
  type UpdateUserDto,
  type CreateBookingDto,
  type UserSummaryDto,
  type BookingDictionary,
} from '../types';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Marcus Rodillo',
    email: 'marcus@dlsl.edu.ph',
    role: UserRole.TUTOR,
    subjectSpecialization: ['Computer Science', 'TypeScript', 'React'],
    bio: 'Senior CS student specializing in Web Development.',
  },
  {
    id: 2,
    name: 'Alex Santos',
    email: 'alex@dlsl.edu.ph',
    role: UserRole.TUTEE,
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@dlsl.edu.ph',
    role: UserRole.ADMIN,
  },
];

const mockCourses: Course[] = [
  {
    id: 'ITELECT4',
    title: 'IT Elective 4: Advanced Web Development',
    description: '3 units - 1st Semester 2026-2027',
  },
];

const mockSubmissions: Submission[] = [
  {
    id: 101,
    courseId: 'ITELECT4',
    courseCode: 'ITELECT4',
    studentId: 2,
    grade: 95,
    repoUrl: 'https://github.com/example/itelect4',
  },
];

const mockSessions: TutoringSession[] = [
  {
    id: 'SESS-001',
    tutorId: 1,
    courseCode: 'ITELECT4',
    topic: 'TypeScript Generics & Utility Types',
    description: 'Comprehensive review of TypeScript type system basics and advanced generics.',
    schedule: '2026-08-01 14:00 - 16:00',
    maxTutees: 5,
  },
];

const mockBookings: Booking[] = [
  {
    id: 501,
    sessionId: 'SESS-001',
    tuteeId: 2,
    tutorId: 1,
    status: BookingStatus.CONFIRMED,
    requestedAt: '2026-07-25T07:50:00Z',
    notes: 'Need help understanding Partial<T> and Omit<T, K>.',
  },
];

console.log('Mock Courses:', mockCourses);
console.log('Mock Submissions:', mockSubmissions);

const foundUser = getById(mockUsers, 1);
console.log('Found User (getById):', foundUser);

const firstSession = getFirst(mockSessions);
console.log('First Session (getFirst):', firstSession);

const userApiResponse: ApiResponse<User> = {
  status: 'success',
  data: mockUsers[0],
  message: 'User retrieved successfully',
};
console.log('API Response:', userApiResponse);

const bookingsApiResponse: ApiResponse<Booking[]> = {
  status: 'success',
  data: mockBookings,
};
console.log('Bookings API Response:', bookingsApiResponse);

const userUpdate: UpdateUserDto = {
  bio: 'Updated bio: Peer tutor for CS & IT courses.',
};
console.log('UpdateUserDto (Partial<User>):', userUpdate);

const newBooking: CreateBookingDto = {
  sessionId: 'SESS-001',
  tuteeId: 2,
  tutorId: 1,
  status: BookingStatus.REQUESTED,
  requestedAt: new Date().toISOString(),
  notes: 'Requesting confirmation for upcoming session.',
};
console.log('CreateBookingDto (Omit<Booking, "id">):', newBooking);

const userSummary: UserSummaryDto = {
  id: mockUsers[0].id,
  name: mockUsers[0].name,
  role: mockUsers[0].role,
};
console.log('UserSummaryDto (Pick<User, ...>):', userSummary);

const bookingMap: BookingDictionary = {
  501: mockBookings[0],
};
console.log('BookingDictionary (Record<number, Booking>):', bookingMap);

console.log('All entities, enums, generics, and utility types initialized successfully!');
