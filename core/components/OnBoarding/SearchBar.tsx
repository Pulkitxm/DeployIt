import { useEffect, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchBar({
  fetchRepos,
  query,
  setQuery,
}: {
  fetchRepos: (query: string) => Promise<void>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRepos(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [fetchRepos, query]);

  return (
    <div className="relative flex-grow">
      <SearchIcon className="absolute left-3 top-1/2 size-3 -translate-y-1/2 transform text-gray-400" />
      <Input
        className="w-full pl-10"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
