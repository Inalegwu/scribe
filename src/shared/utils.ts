import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import { fromPath } from "pdf2pic";
import sharp from "sharp";
import type { z } from "zod";

export const generateThumbnail = Effect.fnUntraced(function* (path: string) {
  const converter = yield* Effect.try(() => fromPath(path));
  const intermediary = yield* Effect.tryPromise(
    async () => await converter(1, { responseType: "base64" }),
  );

  return yield* Effect.tryPromise(
    async () => (await sharp(intermediary.base64).toBuffer()).buffer,
  ).pipe(Effect.map(convertBufferToImage), Effect.tap(Effect.logInfo));
});

export const convertBufferToImage = (buffer: ArrayBufferLike) =>
  `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;

export const parseFileNameFromPath = (path: string) =>
  Option.fromNullable(
    path
      .replace(/^.*[\\\/]/, "")
      .replace(/\.[^/.]+$/, "")
      .replace(/(\d+)$/, "")
      .replace("-", ""),
  ).pipe(Option.getOrElse(() => path));

const err = (obj: Record<string, unknown>) =>
  ({ ...obj, _tag: "err" }) as const;
const ok = (obj: Record<string, unknown>) => ({ ...obj, _tag: "ok" }) as const;

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
