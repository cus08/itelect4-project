export const UserRole = {
  TUTOR: "tutor",
  TUTEE: "tutee",
  ADMIN: "admin",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const BookingStatus = {
  REQUESTED: "requested",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  subjectSpecialization?: string[];
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
}

export interface TutoringSession {
  id: string;
  tutorId: number;
  courseCode: string;
  topic: string;
  description: string;
  schedule: string;
  maxTutees: number;
}

export interface Submission {
  id: number;
  courseId?: string;
  courseCode: string;
  studentId: number;
  grade?: number;
  repoUrl: string;
  submittedAt?: string;
}

export interface Booking {
  id: number;
  sessionId: string;
  tuteeId: number;
  tutorId: number;
  status: BookingStatus;
  requestedAt: string;
  notes?: string;
}

export type StringOrNumber = string | number;

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export function getById<T extends { id: StringOrNumber }>(items: T[], id: StringOrNumber): T | undefined {
  return items.find((item) => item.id === id);
}

export function getFirst<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}

export type UpdateUserDto = Partial<User>;
export type CreateBookingDto = Omit<Booking, "id">;
export type UserSummaryDto = Pick<User, "id" | "name" | "role">;
export type BookingDictionary = Record<number, Booking>;