// src/schemas/submissionSchema.ts
// One schema. The rules live here, and the TypeScript type is DERIVED
// from it -- so a rule and its type can never drift apart.
import { z } from "zod";

export const submissionSchema = z.object({
  // .min(1) is what "required" means for a string: not empty.
  courseCode: z.string().min(1, "Choose a course."),

  // z.string().url() checks the whole shape of a URL, scheme included.
  // .refine() adds custom business rule: must contain github.com
  repoUrl: z
    .string()
    .url("That is not a valid URL -- include https://")
    .refine(
      (url) => url.includes("github.com"),
      "It has to be a GitHub URL."
    ),
});

// z.infer reads the schema and hands back the TypeScript type:
//   { courseCode: string; repoUrl: string }
export type SubmissionFormValues = z.infer<typeof submissionSchema>;
