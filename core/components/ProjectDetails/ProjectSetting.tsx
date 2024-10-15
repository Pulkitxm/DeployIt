"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getProjectDetails, updateProject } from "@/actions/db/user";
import {
  validateFrojectUpdateFormType,
  ProjectUpdateFormType,
} from "@/types/project";

export default function ProjectSettings({
  project,
}: {
  project: Exclude<Awaited<ReturnType<typeof getProjectDetails>>, null>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectUpdateFormType>({
    resolver: zodResolver(validateFrojectUpdateFormType),
    defaultValues: {
      name: project.name,
      slug: project.slug,
      private: project.private,
    },
  });

  async function onSubmit(values: ProjectUpdateFormType) {
    setIsLoading(true);
    try {
      const res = await updateProject(project.id, values);

      if (!res) {
        toast({
          title: "Error",
          description: "There was a problem updating your project settings.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Project updated",
        description: "Your project settings have been updated successfully.",
      });
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: "There was a problem updating your project settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>
          Manage your project&apos;s configuration and details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your project&apos;s display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-project" {...field} />
                  </FormControl>
                  <FormDescription>
                    The unique identifier for your project&apos;s URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="private"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Private Project</FormLabel>
                    <FormDescription>
                      Make your project private and only accessible to you.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Project Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}
