"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <Tabs
      value={pathname.includes("settings") ? "settings" : "overview"}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="overview" asChild>
          <Link href={`/project/${projectId}/overview`}>Overview</Link>
        </TabsTrigger>
        <TabsTrigger value="settings" asChild>
          <Link href={`/project/${projectId}/settings`}>Settings</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
