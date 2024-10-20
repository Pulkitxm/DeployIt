import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { HomeIcon as Home } from "lucide-react";

export default function HomeIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          <Home className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            This project is set to be displayed on the <b>Home</b> page.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
