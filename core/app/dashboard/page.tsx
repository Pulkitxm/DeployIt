import ProtectRoute from "@/components/ProtectRoute";
import React from "react";

export default async function Dashboard() {
  return (await ProtectRoute()) ?? <div>page</div>;
}
