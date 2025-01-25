"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

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
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Then update the email
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

      // Clear form
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
    <Card>
      <CardHeader>
        <CardTitle>Change Email Address</CardTitle>
        <CardDescription>
          Update your account email address. You&apos;ll need to verify the new address before the
          change takes effect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password-email">Current Password</Label>
            <Input
              id="current-password-email"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email">New Email Address</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-email">Confirm New Email Address</Label>
            <Input
              id="confirm-email"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {newEmail && !validateEmail(newEmail) && (
            <Alert variant="destructive">
              <AlertDescription>Please enter a valid email address</AlertDescription>
            </Alert>
          )}

          {newEmail && confirmEmail && newEmail !== confirmEmail && (
            <Alert variant="destructive">
              <AlertDescription>Email addresses do not match</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !currentPassword || !newEmail || !confirmEmail}
          >
            {isLoading ? "Updating..." : "Update Email Address"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
