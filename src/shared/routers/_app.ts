import { publicProcedure, router } from "@src/trpc";
import pkg from "../../../package.json";
import { fileSystem } from "./filesystem";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  fs: fileSystem,
});

export type AppRouter = typeof appRouter;
