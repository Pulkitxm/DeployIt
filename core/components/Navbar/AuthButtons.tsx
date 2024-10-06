import React from "react";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import UserDetails from "./UserDetails";

export default function AuthButtons() {
  const { data: session } = useSession();
  return (
    <div className="flex frr">
      {session ? (
        <div>
          <UserDetails session={session} />
        </div>
      ) : (
        <>
          <Button size="sm" onClick={() => signIn("github")}>
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
        <Button
          className="w-full justify-center"
          size="sm"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      ) : (
        <>
          <Button variant="ghost" className="w-full justify-center" size="sm" onClick={() => signIn("github")}>
            Log in
          </Button>
          <Button className="w-full justify-center" size="sm" onClick={() => signIn("github")}>
            Sign up
          </Button>
        </>
      )}
    </>
  );
}
