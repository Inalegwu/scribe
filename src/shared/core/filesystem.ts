import { Effect } from "effect";
import { parentPort } from "node:worker_threads";
import { z } from "zod";
import { parseWorkerMessageWithSchema } from "../utils";

if (!parentPort) throw new Error("[CORE]==>Core Error:: NO PORT");

parentPort.on("message", (message) =>
  parseWorkerMessageWithSchema(z.object({}), message).pipe(
    Effect.matchEffect({
      onFailure: Effect.logError,
      onSuccess: (result) => Effect.gen(function* () {}),
    }),
    Effect.runSync,
  ),
);
