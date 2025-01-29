// app/checkout/success/page.tsx
import SuccessContent from "@/components/SuccessContent";
import { Suspense } from "react";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-zinc-800 w-full max-w-md p-6 rounded-lg">
            Loading...
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
