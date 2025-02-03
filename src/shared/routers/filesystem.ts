import { publicProcedure, router } from "@src/trpc";
import { Console, Hash, Micro } from "effect";
import { dialog } from "electron";
import { generateThumbnail, parseFileNameFromPath } from "../utils";

export const fileSystem = router({
    openPdfFile: publicProcedure.mutation(async ({ ctx }) => {
        Console.log("Here...");
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

        Micro.runSync(Micro.gen(function* () {
            yield* Micro.forEach(_.filePaths, (path) =>
                Micro.tryPromise({
                    try: async () =>
                        await ctx.store.put({
                            _id: Hash.hash(path).toString(),
                            fileName: parseFileNameFromPath(path),
                            filePath: path,
                            lastAccessed: Date.now().toString(),
                            thumbnail: generateThumbnail(path),
                        }),
                    catch: (cause) => new Error(String(cause)),
                }));
        }));
        _;
        return {
            canceled: null,
            success: true,
            files: _.filePaths.map((path) => ({
                path,
            })),
        };
    }),
    getOpenedFiles: publicProcedure.query(async ({ ctx }) =>
        await Micro.runPromise(Micro.try({
            try: () =>
                ctx.store.allDocs({ include_docs: true }).then((response) =>
                    response.rows.map((
                        row,
                    ) => ({
                        id: row.doc?._id!,
                        filePath: row.doc?.filePath!,
                        fileName: row.doc?.fileName!,
                        thumbnail: row.doc?.thumbnail!,
                        lastAccessed: row.doc?.lastAccessed!,
                    } satisfies PDF & { id: string }))
                ),
            catch: (cause) => new Error(String(cause)),
        }))
    ),
});
