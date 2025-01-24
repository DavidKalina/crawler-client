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
import { Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Get started with 1000 free pages per month
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Acme Corp"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {validationErrors.password ? (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  Must be at least 8 characters with one uppercase letter and one number
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  terms and conditions
                </a>
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !agreedToTerms}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <div className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegistrationPage;
