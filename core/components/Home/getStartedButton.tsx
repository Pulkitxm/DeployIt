"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { REDIRECT_SIGN_IN_PATH } from "@/lib/config";

export function GetStartedButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const button = () => (
    <Button
      size="lg"
      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      Get Started <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <span
      onClick={() => {
        if (!session)
          signIn("github", {
            callbackUrl: REDIRECT_SIGN_IN_PATH ?? "/dashboard",
          });
        else router.push("/dashboard");
      }}
    >
      {button()}
    </span>
  );
}
