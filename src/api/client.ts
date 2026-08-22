import type { TutoringSession, Booking, User, Submission, Course } from '../types';

export type CreateBookingApiDto = Omit<Booking, 'id'>;
export type CreateSessionApiDto = Omit<TutoringSession, 'id'>;
export type CreateSubmissionApiDto = Omit<Submission, 'id'>;

const API_BASE = 'http://localhost:3001';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error (${response.status}): ${response.statusText}`);
  }
  return response.json();
}

export async function getSessions(): Promise<TutoringSession[]> {
  return request<TutoringSession[]>('/sessions');
}

export async function getSessionById(id: string): Promise<TutoringSession> {
  return request<TutoringSession>(`/sessions/${id}`);
}

export async function getBookings(): Promise<Booking[]> {
  return request<Booking[]>('/bookings');
}

export async function createBooking(data: CreateBookingApiDto): Promise<Booking> {
  return request<Booking>('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>('/users');
}

export async function getSubmissions(): Promise<Submission[]> {
  return request<Submission[]>('/submissions');
}

export async function createSubmission(data: CreateSubmissionApiDto): Promise<Submission> {
  return request<Submission>('/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function getCourses(): Promise<Course[]> {
  return request<Course[]>('/courses');
}

export async function getCourseById(id: string): Promise<Course> {
  return request<Course>(`/courses/${id}`);
}
