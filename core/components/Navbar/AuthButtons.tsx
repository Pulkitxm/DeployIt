import React from "react";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import UserDetails from "./UserDetails";
import { REDIRECT_SIGN_IN_PATH, REDIRECT_SIGN_OUT_PATH } from "@/lib/config";

const login = () => {
  signIn("github", {
    callbackUrl: REDIRECT_SIGN_IN_PATH || "/dashboard",
  });
};

const logout = () => {
  signOut({
    callbackUrl: REDIRECT_SIGN_OUT_PATH || "/",
  });
};

export default function AuthButtons() {
  const { data: session } = useSession();
  return (
    <div className="frr flex">
      {session ? (
        <div>
          <UserDetails session={session} logout={logout} />
        </div>
      ) : (
        <>
          <Button size="sm" onClick={login}>
            Log in
          </Button>
        </>
      )}
    </div>
  );
}

export function AuthButtonsSm() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <Button className="w-full justify-center" size="sm" onClick={logout}>
          Sign out
        </Button>
      ) : (
        <>
          <Button className="w-full justify-center" size="sm" onClick={login}>
            Log in
          </Button>
        </>
      )}
    </>
  );
}
