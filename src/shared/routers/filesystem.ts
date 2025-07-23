import { publicProcedure, router } from "@src/trpc";
import { dialog } from "electron";

export const fileSystem = router({
  openPdfFile: publicProcedure.mutation(async ({ ctx }) => {
    const _ = await dialog.showOpenDialog({
      buttonLabel: "Open File",
      defaultPath: ctx.app.getPath("downloads"),
      title: "Open PDF",
      filters: [{ name: "PDF File", extensions: ["pdf"] }],
      properties: ["dontAddToRecent", "openFile"],
    });

    if (_.canceled) {
      return {
        canceled: _.canceled,
        success: false,
        files: null,
      };
    }

    console.log(_.filePaths);

    return {
      canceled: null,
      success: true,
      file: _.filePaths.at(0),
    };
  }),
  getOpenedFiles: publicProcedure.query(async ({ ctx }) => {
    const files = await ctx.store
      .allDocs({
        include_docs: true,
      })
      .then((res) =>
        res.rows.map((row) => ({
          id: row.id,
          fileName: row.doc?.fileName!,
          filePath: row.doc?.filePath!,
          lastAccessed: row.doc?.lastAccessed!,
          thumbnail: row.doc?.thumbnail!,
        })),
      )
      .then((files) => files.filter((file) => file.fileName === undefined));

    console.log({ files });

    return files;
  }),
});
