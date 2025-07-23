import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import type { z } from "zod";

export const parseFileNameFromPath = (path: string) =>
  Option.fromNullable(
    path
      .replace(/^.*[\\\/]/, "")
      .replace(/\.[^/.]+$/, "")
      .replace(/(\d+)$/, "")
      .replace("-", ""),
  ).pipe(Option.getOrElse(() => path));

export const parseWorkerMessageWithSchema = Effect.fnUntraced(function* <
  T extends z.ZodRawShape,
>(schema: z.ZodObject<T>, message: unknown) {
  const result = yield* Effect.sync(() => schema.safeParse(message));

  if (!result.success) {
    return yield* Effect.fail(result.error.flatten());
  }

  return result.data;
});

// export const parseWorkerMessageWithSchema = <T extends z.ZodRawShape>(
//   s: z.ZodObject<T>,
//   m: string,
// ) => {
//   const result = s.safeParse(m);

//   if (!result.success) {
//     // return err({
//     //   message: result.error.flatten(),
//     // });
//     return Effect.fail({
//       message: result.error.flatten(),
//     });
//   }

//   return Effect.succeed({
//     data: result.data,
//   });
// };
