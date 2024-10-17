import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getProjectDetails } from "@/actions/db/user";
import { deleteProject } from "@/actions/gh/delete";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

type ProjectType = Exclude<Awaited<ReturnType<typeof getProjectDetails>>, null>;

export default function DeleteProject({ project }: { project: ProjectType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [deleteKeyword, setDeleteKeyword] = useState("");

  const router = useRouter();

  const handleDelete = async () => {
    if (
      true
      // projectName === project.name &&
      // deleteKeyword.toLowerCase() === "delete"
    ) {
      try {
        setLoading(true);
        await deleteProject(project.id);
        router.push("/dashboard");
        setLoading(false);
        setIsOpen(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Delete Project
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">
                Project Name
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3"
                placeholder={project.name}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deleteKeyword" className="text-right">
                Type &apos;delete&apos;
              </Label>
              <Input
                id="deleteKeyword"
                value={deleteKeyword}
                onChange={(e) => setDeleteKeyword(e.target.value)}
                className="col-span-3"
                placeholder="delete"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              // disabled={
              //   projectName !== project.name ||
              //   deleteKeyword.toLowerCase() !== "delete"
              // }
              className="w-32"
            >
              {loading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
