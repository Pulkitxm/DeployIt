import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorDiv({
  title,
  description,
  link,
}: {
  title?: string;
  description?: string;
  link: string;
}) {
  return (
    <Alert variant="destructive" className="mx-auto mt-8 max-w-md">
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <AlertDescription>
        <Link href={link} className="hover:underline">
          Go Back
        </Link>
      </AlertDescription>
    </Alert>
  );
}
