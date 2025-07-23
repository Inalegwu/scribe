import { publicProcedure, router } from "@src/trpc";
import { observable } from "@trpc/server/observable";
import pkg from "../../../package.json";
import { fileSystem } from "./filesystem";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  fs: fileSystem,
  // TODO: install broadcast-channel package for this
  deeplink: publicProcedure.subscription(({ ctx }) =>
    observable<DeeplinkChannel>((emit) => {
      const deeplinkListener = (event: DeeplinkChannel) => {
        emit.next(event);
      };

      return () => {};
    }),
  ),
});

export type AppRouter = typeof appRouter;
