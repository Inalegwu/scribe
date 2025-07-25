import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

export const globalState$ = observable<GlobalState>({
  colorMode: "light",
  editorState: "read",
  activeFileName: null,
});

persistObservable(globalState$, {
  local: "global_state",
  pluginLocal: ObservablePersistLocalStorage,
});
