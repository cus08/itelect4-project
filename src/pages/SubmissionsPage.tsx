import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiSubmission, Course } from "../types";
import { submissionSchema, type SubmissionFormValues } from "../schemas/submissionSchema";
import { SubmissionBadge } from "../components/SubmissionBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSubmissions, createSubmission, getCourses } from "../api/client";

export function SubmissionsPage() {
  const queryClient = useQueryClient();

  // useForm holds the values, runs the schema, and stores the errors.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: { courseCode: "", repoUrl: "" },
  });

  // Same queryKey as CoursesPage, so this list comes out of the cache.
  const courses = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const { data: submissions = [], isLoading, isError } = useQuery<ApiSubmission[]>({
    queryKey: ["submissions"],
    queryFn: getSubmissions,
  });

  const addSubmission = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset(); // clears every field at once
    },
  });

  // handleSubmit only calls this after the schema passes.
  const onSubmit = (values: SubmissionFormValues): void => {
    addSubmission.mutate({
      studentId: 103,
      courseId: values.courseCode,
      courseCode: values.courseCode,
      repoUrl: values.repoUrl,
      submittedAt: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return <div className="animate-pulse p-6 text-foreground">Loading submissions...</div>;
  }
  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/50 dark:text-red-300">
        Could not load submissions.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          My Submissions
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="courseCode" className="text-foreground font-semibold text-xs">
              Course
            </Label>
            <select
              id="courseCode"
              {...register("courseCode")}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Select a course...</option>
              {courses.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} – {c.title}
                </option>
              ))}
            </select>
            {errors.courseCode && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.courseCode.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="repoUrl" className="text-foreground font-semibold text-xs">
              Repository URL
            </Label>
            <Input
              id="repoUrl"
              {...register("repoUrl")}
              aria-invalid={errors.repoUrl ? true : undefined}
              placeholder="https://github.com/you/your-repo"
            />
            {errors.repoUrl && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.repoUrl.message}
              </p>
            )}
          </div>

          {/* Never disabled on "invalid": clicking it is what shows the
              error messages. Only a save in flight disables it. */}
          <Button
            type="submit"
            disabled={addSubmission.isPending}
            className="justify-self-start"
          >
            {addSubmission.isPending ? "Saving..." : "Add submission"}
          </Button>

          {addSubmission.isError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {addSubmission.error instanceof Error ? addSubmission.error.message : "Failed to save submission."}
            </p>
          )}
        </form>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {submissions.map((s) => (
            <SubmissionBadge
              key={s.id}
              title={`Submission #${s.id} – ${s.courseCode || s.courseId}`}
              date={s.submittedAt}
              grade={s.grade}
              notes={s.repoUrl ? `Repository: ${s.repoUrl}` : undefined}
              status={s.grade !== undefined && s.grade >= 75 ? "passed" : undefined}
            />
          ))}
          {submissions.length === 0 && (
            <p className="text-xs text-slate-400 italic text-center py-6 col-span-2">
              No submissions yet. Add one using the form.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubmissionsPage;
