// app/api/user/delete/route.ts
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function DELETE() {
  try {
    // Get the user's session using the server client
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create admin client with service role for operations that require elevated privileges
    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: jobsDeleteError } = await adminClient
      .from("web_crawl_jobs")
      .delete()
      .eq("user_id", user.id);

    if (jobsDeleteError) {
      console.error("Error deleting crawl jobs:", jobsDeleteError);
      return NextResponse.json({ error: "Failed to delete user data" }, { status: 500 });
    }

    // 2. Verify no jobs remain
    const { data: remainingJobs, error: checkJobsError } = await adminClient
      .from("web_crawl_jobs")
      .select("id")
      .eq("user_id", user.id);

    if (checkJobsError) {
      console.error("Error checking remaining jobs:", checkJobsError);
      return NextResponse.json({ error: "Failed to verify data deletion" }, { status: 500 });
    }

    if (remainingJobs && remainingJobs.length > 0) {
      console.error("Found remaining jobs after deletion");
      return NextResponse.json({ error: "Failed to delete all user data" }, { status: 500 });
    }

    // 3. Delete the user from auth.users (this will cascade to profiles)
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      console.error("Error deleting user:", deleteUserError);
      return NextResponse.json({ error: "Failed to delete user account" }, { status: 500 });
    }

    await adminClient.rpc("cleanup_user_data", { user_id: user.id });

    return NextResponse.json(
      { message: "Account and all associated data successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete account route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
