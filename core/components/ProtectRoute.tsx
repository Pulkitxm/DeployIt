import { getServerSession } from "next-auth";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginWithGithub from "./LoginWithGithub";
import { authOptions } from "@/lib/options";

export default async function ProtectRoute() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    return (
      <div className="flex h-full w-full items-center justify-center text-white">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
            <CardDescription>
              You are not authorized to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginWithGithub />
          </CardContent>
        </Card>
      </div>
    );
  }
}
