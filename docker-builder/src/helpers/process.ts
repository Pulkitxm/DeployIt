export async function executeProcess(
  method: (() => Promise<void>) | (() => void),
  { initialLog, finalLog }: { initialLog?: string; finalLog?: string },
) {
  try {
    initialLog && console.log(initialLog + "\n");
    const res = await method();
    finalLog && console.log("\n" + finalLog + "\n");

    return res;
  } catch (err) {
    console.error(err);
    process.exit(1);
    return null;
  }
}
