"use client";

import { SignUpForm } from "@/components/Auth/SignUpForm";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUpSuccess = () => {
    router.push("/account/signin");
  };

  return (
    <div className="min-h-screen">
      <SignUpForm onSuccess={handleSignUpSuccess} />
    </div>
  );
}
