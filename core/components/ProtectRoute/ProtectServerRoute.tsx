import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import ProtectRouteUI from "../ProtectRoute";

export async function ProtectServerRoute() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <ProtectRouteUI />;
  }
}
