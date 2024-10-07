"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getRepos } from "@/actions/gh/repos";
import { Repo } from "@/types/gh";
import ProtectClientRoute from "@/components/ProtectRoute/ProtectClientRoute";
import Onboarding from "@/components/Dash/OnBoarding";

export default function DashBoard() {
  const { data: session } = useSession();
  const protectRoute = ProtectClientRoute();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setRepos(
        await getRepos(session?.user.github_id ?? -1).finally(() => {
          setLoading(false);
        }),
      );
    })();
  }, [session?.user.github_id]);

  if (protectRoute) return protectRoute;

  return <Onboarding repos={repos} loading={loading} />;
}
