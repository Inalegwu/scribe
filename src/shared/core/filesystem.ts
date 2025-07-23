import { FileSystem } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { Effect } from "effect";
import { parentPort } from "node:worker_threads";
import { z } from "zod";
import { parseWorkerMessageWithSchema } from "../utils";

const executor = Effect.fnUntraced(function* () {
  const fs = yield* FileSystem.FileSystem;

  yield* Effect.logInfo("FileSystem worker");
});

if (!parentPort) throw new Error("[CORE]==>Core Error:: NO PORT");

parentPort.on("message", (message) =>
  parseWorkerMessageWithSchema(
    z.object({
      start: z.boolean(),
    }),
    message,
  ).pipe(
    Effect.matchEffect({
      onFailure: Effect.logFatal,
      onSuccess: ({ start }) =>
        executor().pipe(Effect.provide(NodeContext.layer)),
    }),
    Effect.annotateLogs({
      worker: "filesystem",
      message,
    }),
    Effect.runSync,
  ),
);
