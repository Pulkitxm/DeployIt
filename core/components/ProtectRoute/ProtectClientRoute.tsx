import { useSession } from "next-auth/react";
import ProtectRouteUI from "../ProtectRoute";

export default function ProtectClientRoute() {
  const { data: session } = useSession();
  if (!session) {
    return <ProtectRouteUI />;
  }
}
