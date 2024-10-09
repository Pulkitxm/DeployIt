import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { getRepoBranches } from "@/actions/gh/repo";
import { useSession } from "next-auth/react";
import { ImportProjectType } from "@/types/project";

export default function ChooseBranch({
  importProjectData,
  setImportProjectData,
}: {
  importProjectData: ImportProjectType;
  setImportProjectData: React.Dispatch<React.SetStateAction<ImportProjectType>>;
}) {
  const { data: session } = useSession();
  const [branches, setBranches] = useState<string[]>([]);
  const fetchRepoDetails = useCallback(async () => {
    const githubId = session?.user.github_id;
    if (!githubId) return;
    const repoBranches = await getRepoBranches({
      githubId,
      repoOwner: importProjectData.repoOwner,
      repoName: importProjectData.repoName,
    });
    if (repoBranches) setBranches(repoBranches);
  }, [
    importProjectData.repoName,
    importProjectData.repoOwner,
    session?.user.github_id,
  ]);

  useEffect(() => {
    fetchRepoDetails();
  }, [fetchRepoDetails]);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-muted-foreground">
        Branch
      </label>
      <Select
        value={importProjectData.branch}
        onValueChange={(branch) =>
          setImportProjectData((prev) => ({ ...prev, branch }))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="other">Other</SelectItem> */}
          {branches.map((branch) => (
            <SelectItem key={branch} value={branch}>
              {branch}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
