import type {
  Course,
  ApiSubmission,
  NewSubmission,
  AuthReply,
  ApiUser,
  TutoringSession,
  Booking,
  User,
} from "../types/index";
import useAuthStore from "../store/authStore";

// Vite only exposes variables whose name starts with VITE_, and it
// replaces this at BUILD time -- the value that was in .env when
// `npm run build` ran is baked into the bundle. That is why adding it
// in Vercel is not enough on its own: the next deploy is what picks it
// up.
export const API_URL = import.meta.env.VITE_API_URL;

// The same guard db.ts has for MONGODB_URI, for the same reason: a
// sentence now beats every call going to "undefined/api/courses".
if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env, fill it in, " +
      "and restart npm run dev.",
  );
}

// Every call goes through here: the host, the JSON header, the token
// when there is one, and the API's own message when it refuses.
async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  // getState(), not the useAuthStore hook -- this is not a component,
  // and it does not need to re-render when the token changes. It only
  // needs whatever the token is at the moment of the call.
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // The exact header requireAuth reads: the word Bearer, one
      // space, then the token. No token in the store means no header
      // at all, which is what the public course routes want.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    // Every refusal this API sends has a message field. Reading it is
    // the difference between "Could not save the submission" and
    // "repoUrl must start with https://github.com/".
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

// ---- courses: public. request() sends no token, and none is needed.
export function fetchCourses(): Promise<Course[]> {
  return request<Course[]>("/api/courses");
}

// Session 7 asked json-server for /courses?code=ITELECT4 and read
// matches[0], because json-server has no route for a single row. This
// one does, so there is no array to unwrap -- and no "No course found"
// message written here either. A bad code answers 404 and request()
// throws the sentence the API sent.
export function fetchCourseByCode(code: string): Promise<Course> {
  return request<Course>(`/api/courses/${code}`);
}

// ---- submissions: private. The token goes on automatically.
export function fetchSubmissions(): Promise<ApiSubmission[]> {
  return request<ApiSubmission[]>("/api/submissions");
}

export function createSubmission(
  newSubmission: NewSubmission,
): Promise<ApiSubmission> {
  return request<ApiSubmission>("/api/submissions", {
    method: "POST",
    body: JSON.stringify(newSubmission),
  });
}

// ---- auth: the two routes that make a session exist
export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Compatibility helpers for existing pages:
export const getCourses = fetchCourses;
export const getCourseById = fetchCourseByCode;
export const getSubmissions = fetchSubmissions;

export type CreateBookingApiDto = Omit<Booking, "id">;
export type CreateSessionApiDto = Omit<TutoringSession, "id">;
export type CreateSubmissionApiDto = NewSubmission;

export async function getSessions(): Promise<TutoringSession[]> {
  return request<TutoringSession[]>("/api/sessions").catch(() => []);
}

export async function getSessionById(id: string): Promise<TutoringSession> {
  return request<TutoringSession>(`/api/sessions/${id}`);
}

export async function getBookings(): Promise<Booking[]> {
  return request<Booking[]>("/api/bookings").catch(() => []);
}

export async function createBooking(data: CreateBookingApiDto): Promise<Booking> {
  return request<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>("/api/users").catch(() => []);
}
