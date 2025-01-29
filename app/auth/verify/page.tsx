// app/auth/verify/page.tsx
import VerifyContent from "@/components/VerifyContent";
import { Suspense } from "react";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
          <div className="w-full max-w-md bg-zinc-900 border-zinc-800 p-6 rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin border-4 border-blue-400 border-t-transparent rounded-full" />
              <p className="text-center text-sm text-zinc-400">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
