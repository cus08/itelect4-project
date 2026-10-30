import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubmissionBadge } from "./SubmissionBadge";

describe("SubmissionBadge", () => {
  it("shows the grade, status, and repo link when provided", () => {
    render(
      <SubmissionBadge
        title="Submission #1"
        grade={95}
        status="passed"
        notes="Repository: https://github.com/juan/itelect4-project"
      />
    );

    expect(screen.getByText("Grade: 95%")).toBeInTheDocument();
    expect(screen.getByText("passed")).toBeInTheDocument();
    expect(
      screen.getByText('"Repository: https://github.com/juan/itelect4-project"'),
    ).toBeInTheDocument();
  });

  it("does not show grade when grade is undefined", () => {
    render(
      <SubmissionBadge
        title="Submission #2"
        status="pending"
      />
    );

    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.queryByText(/Grade:/i)).not.toBeInTheDocument();
  });
});
