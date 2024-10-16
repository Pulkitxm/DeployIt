import { handleDeleteProjectDocker } from "./delete";
import { handleProjectImportViaDocker } from "./import";
import { validateDeleteProject, validateImportProject, validateProjectOperation } from "./project";
import redis from "./redis";

const loopHandler = async () => {
  if (!redis) return;

  while (true) {
    try {
      const res = await redis.brpop("project_queue", 0);
      if (!res) continue;

      const message = res[1];
      console.log("Received message:", message);

      const parsedMessage = validateProjectOperation.safeParse(
        JSON.parse(message),
      );
      if (parsedMessage.success) {
        if (parsedMessage.data.OPERATION === "BUILD") {
          const parsedMessageProject = validateImportProject.safeParse(JSON.parse(message));
          if(!parsedMessageProject.success) continue;
          await handleProjectImportViaDocker(parsedMessageProject.data);
        } else if (parsedMessage.data.OPERATION === "DELETE") {
          const parsedMessageProject = validateDeleteProject.safeParse(JSON.parse(message));
          if(!parsedMessageProject.success) {
            console.error("Validation error:", parsedMessageProject.error.issues);
            continue;
          }
          handleDeleteProjectDocker(parsedMessageProject.data);
        }
      } else {
        console.error("Validation error:", parsedMessage.error.issues);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }
};

redis?.on("error", (err) => {
  console.error("Error from Redis:", err);
  process.exit(1);
});

redis?.on("ready", () => {
  console.log("Redis is ready, starting loop handler.");
  loopHandler();
});
