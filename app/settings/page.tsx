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
import { LayoutDashboard, User, Mail, Lock, AlertTriangle, Settings } from "lucide-react";

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
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 p-6 border-b border-zinc-800">
          <Settings className="h-5 w-5 text-blue-400" />
          <h1 className="text-xl font-medium">Account Settings</h1>
        </div>

        <div className="flex h-full">
          <Tabs defaultValue="overview" orientation="vertical" className="flex-1 flex h-full">
            <TabsList className="h-full w-64 flex-col items-start space-y-1 bg-zinc-900/50 border-r border-zinc-800 pt-6">
              <TabsTrigger
                value="overview"
                className="w-full justify-start gap-2.5 px-4 py-2.5 text-sm font-medium 
                         data-[state=active]:bg-zinc-800/50 data-[state=active]:text-blue-400
                         text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="w-full justify-start gap-2.5 px-4 py-2.5 text-sm font-medium 
                         data-[state=active]:bg-zinc-800/50 data-[state=active]:text-blue-400
                         text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors"
              >
                <User className="h-4 w-4" />
                Account Info
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="w-full justify-start gap-2.5 px-4 py-2.5 text-sm font-medium 
                         data-[state=active]:bg-zinc-800/50 data-[state=active]:text-blue-400
                         text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Settings
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="w-full justify-start gap-2.5 px-4 py-2.5 text-sm font-medium 
                         data-[state=active]:bg-zinc-800/50 data-[state=active]:text-blue-400
                         text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30 transition-colors"
              >
                <Lock className="h-4 w-4" />
                Password
              </TabsTrigger>
              <TabsTrigger
                value="danger"
                className="w-full justify-start gap-2.5 px-4 py-2.5 text-sm font-medium 
                         text-red-400 hover:text-red-300 hover:bg-red-400/10
                         data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400
                         transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 p-8 bg-zinc-950">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <UsageOverview
                  pagesUsed={profile.pages_used}
                  monthlyQuota={profile.monthly_quota}
                  lastQuotaReset={profile.last_quota_reset}
                />
              </TabsContent>

              <TabsContent value="account" className="mt-0 space-y-6">
                <AccountInfo
                  fullName={profile.full_name}
                  companyName={profile.company_name}
                  email={profile.email}
                />
              </TabsContent>

              <TabsContent value="email" className="mt-0 space-y-6">
                <EmailChange />
              </TabsContent>

              <TabsContent value="password" className="mt-0 space-y-6">
                <PasswordReset />
              </TabsContent>

              <TabsContent value="danger" className="mt-0 space-y-6">
                <DangerZone isLoading={isLoading} onDeleteAccount={handleDeleteAccount} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
