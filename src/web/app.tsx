import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { configureObservablePersistence } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import t, { queryClient, trpcClient } from "@shared/config";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "virtual:uno.css";
import ErrorComponent from "./components/error-component";
import { ToastProvider } from "./components/toast";
import "./defaults.css";
import { routeTree } from "./routeTree.gen";

enableReactTracking({
  auto: true,
});

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

const history = createHashHistory({});

const router = createRouter({
  routeTree,
  history,
  defaultErrorComponent: (props) => <ErrorComponent {...props} />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement!);

  root.render(
    <StrictMode>
      <t.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Theme radius="medium" accentColor="gray" grayColor="gray">
            <ToastProvider
              context={{
                duration: 5000,
                position: "bottom-center",
              }}
            >
              <RouterProvider router={router} />
            </ToastProvider>
          </Theme>
        </QueryClientProvider>
      </t.Provider>
    </StrictMode>,
  );
}
