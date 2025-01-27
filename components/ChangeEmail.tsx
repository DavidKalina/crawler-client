"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Mail, KeyRound, Loader2 } from "lucide-react";

export function EmailChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newEmail !== confirmEmail) {
      toast({
        title: "Error",
        description: "Email addresses do not match",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(newEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      const { error: updateError } = await supabase.auth.updateUser(
        {
          email: newEmail,
        },
        {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/settings`,
        }
      );

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Verification Email Sent",
        description: "Please check your new email address to confirm the change",
      });

      setCurrentPassword("");
      setNewEmail("");
      setConfirmEmail("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-400" />
          <div>
            <CardTitle className="text-lg font-medium text-zinc-100">
              Change Email Address
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Update your account email address. You&apos;ll need to verify the new address before
              the change takes effect.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password-email" className="text-zinc-400">
              Current Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-zinc-500" />
              </div>
              <Input
                id="current-password-email"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                         focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email" className="text-zinc-400">
              New Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-zinc-500" />
              </div>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                autoComplete="email"
                className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                         focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-email" className="text-zinc-400">
              Confirm New Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-zinc-500" />
              </div>
              <Input
                id="confirm-email"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                autoComplete="email"
                className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                         focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {newEmail && !validateEmail(newEmail) && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>Please enter a valid email address</AlertDescription>
            </Alert>
          )}

          {newEmail && confirmEmail && newEmail !== confirmEmail && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>Email addresses do not match</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isLoading || !currentPassword || !newEmail || !confirmEmail}
            className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 
                     hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              "Update Email Address"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
