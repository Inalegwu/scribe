import * as Effect from "effect/Effect";

Effect.gen(function* () {
  yield* Effect.logInfo("parsing pdf files into tree data for editing");
}).pipe(Effect.runPromise);
