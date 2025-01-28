"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto p-2 rounded-full bg-blue-500/10 w-fit">
              <LogIn className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl font-medium text-zinc-100">Welcome Back</CardTitle>
            <CardDescription className="text-zinc-400">
              Log in to manage your web scraping projects
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-400">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-500" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                             focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-400">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                             focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 
                         hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>

              <div className="text-sm text-center text-zinc-500">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/register"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign up
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
