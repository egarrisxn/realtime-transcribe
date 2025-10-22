"use server";

const SECRET_CODE = process.env.AUTH_CODE;

export async function checkAccessCode(
  enteredCode: string
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (enteredCode === SECRET_CODE) {
    // In the future, I will set a secure HTTP-only cookie here
    // to keep users authorized across pages/sessions.
    // E.g., cookies().set('auth_token', 'temporary-token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return { success: true };
  } else {
    return { success: false };
  }
}
