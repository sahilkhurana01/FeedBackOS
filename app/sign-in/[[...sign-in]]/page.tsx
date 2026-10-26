import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto shadow-xl rounded-2xl",
            card: "border border-border bg-card shadow-none rounded-2xl",
          },
        }}
      />
    </div>
  );
}
