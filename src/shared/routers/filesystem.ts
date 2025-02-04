import { publicProcedure, router } from "@src/trpc";
import { Console, Micro } from "effect";
import { dialog } from "electron";
import { v4 } from "uuid";
import { generateThumbnail, parseFileNameFromPath } from "../utils";

export const fileSystem = router({
    openPdfFile: publicProcedure.mutation(async ({ ctx }) => {
        const _ = await dialog.showOpenDialog({
            buttonLabel: "Open File",
            defaultPath: ctx.app.getPath("downloads"),
            title: "Open PDF",
            filters: [{ name: "PDF File", extensions: ["pdf"] }],
        });

        if (_.canceled) {
            return {
                canceled: _.canceled,
                success: false,
                files: null,
            };
        }

        Console.log(_.filePaths);

        await Micro.runPromise(
            Micro.gen(function* () {
                yield* Micro.forEach(_.filePaths, (path) =>
                    Micro.tryPromise({
                        try: async () =>
                            await ctx.store.put({
                                _id: v4(),
                                fileName: parseFileNameFromPath(path),
                                filePath: path,
                                lastAccessed: Date.now().toString(),
                                thumbnail: generateThumbnail(path),
                            }),
                        catch: (cause) => new Error(String(cause)),
                    }));
            }),
        );

        return {
            canceled: null,
            success: true,
            files: _.filePaths.map((path) => ({
                path,
            })),
        };
    }),
    getOpenedFiles: publicProcedure.query(
        async ({ ctx }) =>
            await Micro.runPromise(
                Micro.try({
                    try: () =>
                        ctx.store.allDocs({ include_docs: true }).then((
                            response,
                        ) => response.rows.map(
                            (row) =>
                                ({
                                    id: row.doc?._id!,
                                    filePath: row.doc?.filePath!,
                                    fileName: row.doc?.fileName!,
                                    thumbnail: row.doc?.thumbnail!,
                                    lastAccessed: row.doc?.lastAccessed!,
                                }) satisfies PDF & { id: string },
                        )),
                    catch: (cause) => new Error(String(cause)),
                }),
            ),
    ),
});
