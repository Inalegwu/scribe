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

    return {
      canceled: null,
      success: true,
      file: _.filePaths.at(0),
    };
  }),
});
