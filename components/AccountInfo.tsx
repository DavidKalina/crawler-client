import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface AccountInfoProps {
  fullName: string;
  companyName?: string | null;
  email: string;
}

export function AccountInfo({ fullName, companyName, email }: AccountInfoProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-400" />
          <div>
            <CardTitle className="text-lg font-medium text-zinc-100">Account Information</CardTitle>
            <CardDescription className="text-zinc-400">
              Your personal and account details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Full Name</label>
            <p className="text-sm text-zinc-400">{fullName}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <p className="text-sm text-zinc-400">{email}</p>
          </div>

          {companyName && (
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-zinc-300">Company</label>
              <p className="text-sm text-zinc-400">{companyName}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center space-x-1.5 rounded-md bg-blue-400/10 px-2.5 py-1.5">
          <div className="h-1 w-1 rounded-full bg-blue-400"></div>
          <p className="text-xs text-blue-400">Verified account</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountInfo;
