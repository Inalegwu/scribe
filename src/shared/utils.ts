import { Micro, Option } from "effect";
import { fromPath } from "pdf2pic";

export const generateThumbnail = (path: string) =>
    Micro.runSync(
        Micro.gen(function* () {
            const conveter = yield* Micro.try({
                try: () => fromPath(path),
                catch: (cause) => new Error(String(cause)),
            });

            return yield* Micro.tryPromise({
                try: async () => await conveter(1, { responseType: "base64" }),
                catch: (cause) => new Error(String(cause)),
            }).pipe(
                Micro.andThen((response) =>
                    `data:image/png;base64,${response.base64}`
                ),
            );
        }).pipe(Micro.orDie),
    );

export const convertBufferToImage = (buffer: ArrayBufferLike) =>
    Micro.runSync(
        Micro.try({
            try: () =>
                `data:image/png;base64,${
                    Buffer.from(buffer).toString("base64")
                }`,
            catch: (cause) => new Error(String(cause)),
        }),
    );

export const parseFileNameFromPath = (path: string) =>
    Micro.runSync(Micro.gen(function* () {
        return Option.getOrElse(
            Option.fromNullable(
                path
                    .replace(/^.*[\\\/]/, "")
                    .replace(/\.[^/.]+$/, "")
                    .replace(/(\d+)$/, "")
                    .replace("-", ""),
            ),
            () => path,
        );
    }));
