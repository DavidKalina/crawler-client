"use client";

import { createProfile } from "@/app/actions/register";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Building2, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  companyName?: string;
}

interface ValidationErrors {
  password?: string;
  confirmPassword?: string;
  email?: string;
}

const RegistrationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const supabase = createClient();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Password validation
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    }

    if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile using server action
        const result = await createProfile({
          userId: authData.user.id,
          fullName: formData.fullName,
          email: formData.email,
          companyName: formData.companyName,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        // Redirect to verification page with email parameter
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto p-2 rounded-full bg-blue-500/10 w-fit">
              <UserPlus className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl font-medium text-zinc-100">Create Account</CardTitle>
            <CardDescription className="text-zinc-400">
              Get started with 5000 free pages per month
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
                <Label htmlFor="fullName" className="text-zinc-400">
                  Full Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-zinc-500" />
                  </div>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                             focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

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
                {validationErrors.email && (
                  <p className="text-sm text-red-400">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-zinc-400">
                  Company Name (Optional)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-zinc-500" />
                  </div>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Acme Corp"
                    value={formData.companyName}
                    onChange={handleInputChange}
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
                {validationErrors.password ? (
                  <p className="text-sm text-red-400">{validationErrors.password}</p>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Must be at least 8 characters with one uppercase letter and one number
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-400">
                  Confirm Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                             focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-400">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="border-zinc-700 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
                />
                <Label htmlFor="terms" className="text-sm text-zinc-400">
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                    terms and conditions
                  </a>
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 
                         hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>

              <div className="text-sm text-center text-zinc-500">
                Already have an account?{" "}
                <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign in
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;
