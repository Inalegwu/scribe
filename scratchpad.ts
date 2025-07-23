import { FileSystem } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

Effect.gen(function* () {
  yield* Effect.logInfo("Starting scratchpad");
  const fs = yield* FileSystem.FileSystem;

  //   const files = yield* fs
  //     .readDirectory("C:\\Users\\sipho\\Documents\\Mega Downloads", {
  //       recursive: true,
  //     })
  //     .pipe(
  //       //   Effect.tap(Effect.logInfo),
  //       Effect.orDie,
  //     );

  yield* fs.watch("C:\\Users\\Sipho\\Documents").pipe(
    Stream.map((event) => console.log(event)),
    Stream.runDrain,
  );
}).pipe(
  Effect.annotateLogs({
    module: "scratchpad",
  }),
  Effect.provide(NodeContext.layer),
  Effect.runPromise,
);
