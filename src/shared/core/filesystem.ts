import { FileSystem } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { Effect, Stream } from "effect";
import { parentPort } from "node:worker_threads";
import { z } from "zod";
import { parseWorkerMessageWithSchema } from "../utils";

if (!parentPort) throw new Error("[CORE]==>Core Error:: NO PORT");

parentPort.on("message", (message) =>
  parseWorkerMessageWithSchema(
    z.object({
      start: z.boolean(),
    }),
    message,
  ).pipe(
    Effect.matchEffect({
      onFailure: Effect.logError,
      onSuccess: (result) =>
        Effect.gen(function* () {
          const fs = yield* FileSystem.FileSystem;

          yield* fs.watch(process.env.DOCUMENTS_DIR!).pipe(
            Stream.map((fsEvent) => console.log(fsEvent.path)),
            Stream.runDrain,
          );
        }).pipe(Effect.provide(NodeContext.layer)),
    }),
    Effect.runSync,
  ),
);
