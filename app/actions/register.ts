"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface CreateProfileParams {
  userId: string;
  fullName: string;
  email: string;
  companyName?: string;
}

export async function createProfile({ userId, fullName, email, companyName }: CreateProfileParams) {
  try {
    const STARTER_PAGES = 1000; // Give new users some free pages to start with

    const { error } = await supabaseAdmin.from("profiles").insert([
      {
        id: userId,
        full_name: fullName,
        email: email,
        company_name: companyName,
        available_pages: STARTER_PAGES,
        lifetime_pages_purchased: STARTER_PAGES,
        pages_used: 0,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}
