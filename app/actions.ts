/**
 * Server action that validates a 4-digit access code.
 *
 * In the future, a secure HTTP-only cookie will be set here
 * to persist authorization across pages/sessions.
 *
 * Example:
 * cookies().set("auth_token", "temporary-token", {
 *   httpOnly: true,
 *   secure: process.env.NODE_ENV === "production",
 * });
 */

"use server";

const SECRET_CODE = process.env.AUTH_CODE;

/**
 * Compares the entered code with the secret code stored in environment variables.
 * Adds a short artificial delay to mimic async verification.
 */
export async function checkAccessCode(
  enteredCode: string
): Promise<{ success: boolean }> {
  // Simulate a short delay for UX and security
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validate the entered code
  if (enteredCode === SECRET_CODE) {
    return { success: true };
  }

  return { success: false };
}
