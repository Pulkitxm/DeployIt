"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { GithubIcon } from "lucide-react";

export default function LoginWithGithub() {
  const onSignin = () => {
    signIn("github");
  };

  return (
    <Button
      className="w-full bg-[#24292e] hover:bg-[#2f363d] text-white"
      onClick={onSignin}
    >
      <GithubIcon className="w-4 h-4 mr-2" />
      Login with GitHub
    </Button>
  );
}
