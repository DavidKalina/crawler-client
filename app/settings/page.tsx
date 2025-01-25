"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccountInfo } from "@/components/AccountInfo";
import { DangerZone } from "@/components/DangerZone";
import { UsageOverview } from "@/components/UsageOverView";
import { PasswordReset } from "@/components/PasswordReset";
import { EmailChange } from "@/components/ChangeEmail";
import { LayoutDashboard, User, Mail, Lock, AlertTriangle } from "lucide-react";

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
    <div className="container mx-auto">
      <div className="max-w-7xl mx-auto h-full">
        <h1 className="text-2xl font-semibold p-6">Account Settings</h1>

        <div className="flex h-full">
          <Tabs defaultValue="overview" orientation="vertical" className="flex-1 flex h-full">
            <TabsList className="h-full w-64 flex-col items-start space-y-1 rounded-none bg-background pt-4">
              <TabsTrigger
                value="overview"
                className="w-full justify-start gap-2 px-4 py-2 text-sm font-medium"
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="w-full justify-start gap-2 px-4 py-2 text-sm font-medium"
              >
                <User className="h-4 w-4" />
                Account Info
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="w-full justify-start gap-2 px-4 py-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                Email Settings
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="w-full justify-start gap-2 px-4 py-2 text-sm font-medium"
              >
                <Lock className="h-4 w-4" />
                Password
              </TabsTrigger>
              <TabsTrigger
                value="danger"
                className="w-full justify-start gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-500"
              >
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 p-6">
              <TabsContent value="overview" className="mt-0">
                <UsageOverview
                  pagesUsed={profile.pages_used}
                  monthlyQuota={profile.monthly_quota}
                  lastQuotaReset={profile.last_quota_reset}
                />
              </TabsContent>

              <TabsContent value="account" className="mt-0">
                <AccountInfo
                  fullName={profile.full_name}
                  companyName={profile.company_name}
                  email={profile.email}
                />
              </TabsContent>

              <TabsContent value="email" className="mt-0">
                <EmailChange />
              </TabsContent>

              <TabsContent value="password" className="mt-0">
                <PasswordReset />
              </TabsContent>

              <TabsContent value="danger" className="mt-0">
                <DangerZone isLoading={isLoading} onDeleteAccount={handleDeleteAccount} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
