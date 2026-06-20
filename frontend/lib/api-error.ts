import axios from "axios";

export interface LaravelErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object") {
      const { message, errors } = data as LaravelErrorResponse;

      if (errors && typeof errors === "object") {
        const fieldMessages = Object.values(errors)
          .flat()
          .filter((value): value is string => Boolean(value));

        if (fieldMessages.length > 0) {
          return fieldMessages.join(" ");
        }
      }

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }

    if (error.message === "Network Error") {
      return "Unable to reach the server. Please try again.";
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
