"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AuthState {
  error: string | null;
  success: string | null;
}

/**
 * Sign in an existing user with Email and Password.
 */
export async function signIn(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Please enter both email and password.", success: null };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

/**
 * Register a new user with Email and Password.
 */
export async function signUp(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password.", success: null };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters.", success: null };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
    },
  });

  if (error) {
    return { error: error.message, success: null };
  }

  // If email confirmation is required by Supabase project settings
  if (data?.user && !data.session) {
    return {
      error: null,
      success: "Account created! Please check your email inbox to confirm your account.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Sign out the current user session.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Get currently authenticated user on the server.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
