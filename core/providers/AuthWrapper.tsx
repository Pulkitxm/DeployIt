import { useSession } from "next-auth/react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") return null;

  return children;
}
