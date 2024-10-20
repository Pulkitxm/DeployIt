"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { REDIRECT_SIGN_IN_PATH } from "@/lib/config";

export default function LoginWithGithub() {
  const onSignin = () => {
    signIn("github", {
      callbackUrl: REDIRECT_SIGN_IN_PATH ?? "/dashboard",
    });
  };

  return (
    <Button
      className="w-full bg-[#24292e] text-white hover:bg-[#2f363d]"
      onClick={onSignin}
    >
      <GithubIcon className="mr-2 h-4 w-4" />
      Login with GitHub
    </Button>
  );
}
