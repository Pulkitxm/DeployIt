"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getRepos } from "@/actions/gh/repos";
import { Repo } from "@/types/gh";
import ProtectClientRoute from "@/components/ProtectRoute/ProtectClientRoute";
import Onboarding from "@/components/OnBoarding";

export default function New() {
  const { data: session } = useSession();
  const protectRoute = ProtectClientRoute();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const fetchRepos = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const repos = await getRepos(session?.user.github_id ?? -1, query);
        setRepos(repos);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setLoading(false);
      }
    },
    [session?.user.github_id],
  );

  useEffect(() => {
    fetchRepos("");
  }, [fetchRepos]);

  if (protectRoute) return protectRoute;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Onboarding
        repos={repos}
        loading={loading}
        fetchRepos={fetchRepos}
        query={query}
        setQuery={setQuery}
      />
    </div>
  );
}
