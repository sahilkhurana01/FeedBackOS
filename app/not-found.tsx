import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="grid size-16 place-items-center rounded-3xl bg-muted text-primary mb-6">
        <Sparkles className="size-8" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404 — Page Not Found</h1>
      <p className="mt-3 max-w-md text-[15px] text-muted-foreground">
        The workspace route you are looking for doesn't exist or has moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/dashboard">
          <Button className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Dashboard Overview
          </Button>
        </Link>
      </div>
    </div>
  );
}
