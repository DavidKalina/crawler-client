"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { AccountInfo } from "@/components/AccountInfo";
import { DangerZone } from "@/components/DangerZone";
import { UsageOverview } from "@/components/UsageOverView";
import { PasswordReset } from "@/components/PasswordReset";
import { EmailChange } from "@/components/ChangeEmail";

interface UserProfile {
  full_name: string;
  company_name: string | null;
  email: string;
  monthly_quota: number;
  pages_used: number;
  last_quota_reset: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast({
          title: "Error",
          description: "Failed to authenticate user",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
    };

    fetchProfile();
  }, [supabase, toast]);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });

      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return null; // Or a loading state
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {/* Grid layout with responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1: Account Overview */}
          <div className="lg:col-span-3">
            <UsageOverview
              pagesUsed={profile.pages_used}
              monthlyQuota={profile.monthly_quota}
              lastQuotaReset={profile.last_quota_reset}
            />
          </div>

          {/* Column 2: Account Information */}
          <div className="space-y-6">
            <AccountInfo
              fullName={profile.full_name}
              companyName={profile.company_name}
              email={profile.email}
            />
            <DangerZone isLoading={isLoading} onDeleteAccount={handleDeleteAccount} />
          </div>

          {/* Column 3: Email Management */}
          <div>
            <EmailChange />
          </div>

          {/* Column 4: Password Management */}
          <div>
            <PasswordReset />
          </div>
        </div>
      </div>
    </div>
  );
}
