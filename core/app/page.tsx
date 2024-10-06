"use client";

import { signIn, useSession } from "next-auth/react";
import React from "react";

export default function Page() {
  const session = useSession();
  console.log(session);

  if (!session.data) {
    return <button onClick={() => signIn()}>Signin</button>;
  }

  return <div></div>;
}
