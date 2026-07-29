import z from "zod";

interface EmailErrors {
  empty?: string;
  invalid_format?: string;
}

export const EmailSchema = ({
  empty = "Please enter an email address",
  invalid_format = "Please enter a valid email address",
}: EmailErrors = {}) =>
  z.email({
    error: (issue) => {
      if (issue.code === "invalid_type") return;
      return issue.input!.length ? invalid_format : empty;
    },
  });
