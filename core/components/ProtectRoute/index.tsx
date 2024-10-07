import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginWithGithub from "./LoginWithGithub";

export default function ProtectRouteUI() {
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
