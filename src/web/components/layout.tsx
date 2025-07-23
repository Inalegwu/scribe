import { computed } from "@legendapp/state";
import { useObservable, useObserveEffect } from "@legendapp/state/react";
import { DropdownMenu, Flex, Heading, Text } from "@radix-ui/themes";
import t from "@shared/config";
import { parseFileNameFromPath } from "@src/shared/utils";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { capitalize } from "effect/String";
import { Sidebar } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect } from "react";
import { globalState$ } from "../state";
import Icon from "./icon";
import ThemeButton from "./theme-button";
import Toast, { toast } from "./toast";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const navigation = useRouter();
  const { mutate: minimizeWindow } = t.window.minimize.useMutation();
  const { mutate: maximizeWindow } = t.window.maximize.useMutation();
  const { mutate: closeWindow } = t.window.closeWindow.useMutation();

  const isHome = computed(() => routerState.location.pathname === "/").get();
  const sidebar = useObservable(false);
  const colorMode = globalState$.colorMode.get();

  console.log(globalState$.activeFileName.get());

  useObserveEffect(() => {
    if (globalState$.colorMode.get() === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, {});

  useEffect(() => {
    if (colorMode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [colorMode]);

  return (
    <Flex
      width="100%"
      grow="1"
      className="transition bg-neutral-50 w-full h-screen dark:bg-moonlightBase"
    >
      <motion.div
        initial={{
          opacity: 0,
          width: 0,
          display: "none",
        }}
        animate={{
          width: sidebar.get() ? "18%" : "0%",
          display: sidebar.get() ? "flex" : "none",
          opacity: sidebar.get() ? 1 : 0,
        }}
      >
        <Flex
          direction="column"
          className="border-r-1 bg-neutral-100 dark:bg-moonlightOverlay border-r-solid border-r-neutral-100 dark:border-r-moonlightSoft/20 w-full h-full"
        >
          {/* main body */}
          <Flex gap="2" direction="column" grow="1">
            <Flex className="p-2" align="center" justify="between">
              <Heading size="4" className="text-moonlightIndigo">
                Scribe
              </Heading>
              <ActionButton />
            </Flex>
            <Flex direction="column">
              <Link
                href="/"
                className="p-3 flex items-center justify-start space-x-2"
              >
                <Icon name="House" size={12} />
                <Text size="2">Home</Text>
              </Link>
              <Link
                href="/"
                className="p-3 flex items-center justify-start space-x-2"
              >
                <Icon name="History" size={12} />
                <Text size="2">History</Text>
              </Link>
            </Flex>
          </Flex>
          <Flex className="p-2" align="center" justify="between">
            {/* <Link
              href="/settings"
              className="px-2 py-2 flex items-center justify-center rounded-md dark:text-moonlightText cursor-pointer hover:bg-neutral-400/10 dark:hover:bg-neutral-400/5"
            >
              <Icon name="Settings2" size={12} />
            </Link> */}
          </Flex>
        </Flex>
      </motion.div>
      <motion.div
        initial={{
          width: "100%",
        }}
        animate={{
          width: sidebar.get() ? "82%" : "100%",
        }}
      >
        <Flex direction="column" className="w-full h-screen">
          {/* title bar */}
          <Flex
            align="center"
            justify="between"
            className="border-b-1 bg-white dark:bg-moonlightInterface w-full"
          >
            <Flex className="px-2" align="center" justify="start" gap="3">
              <button
                onClick={() => sidebar.set(!sidebar.get())}
                className="px-2 py-2 rounded-md dark:text-moonlightText cursor-pointer hover:bg-neutral-400/10 dark:hover:bg-neutral-400/5"
              >
                <Sidebar size={12} />
              </button>
            </Flex>
            <Flex grow="1" gap="1" align="center" justify="center">
              <Flex grow="1" id="drag-region" p="2" />
              <Flex>
                <button
                  disabled={isHome}
                  className="px-2 py-2 rounded-md dark:text-moonlightText cursor-pointer hover:bg-neutral-400/10 dark:hover:bg-neutral-400/5"
                  onClick={() => navigation.history.back()}
                >
                  <Icon name="ArrowLeft" size={12} />
                </button>
                <button
                  className="px-2 py-2 rounded-md dark:text-moonlightText cursor-pointer hover:bg-neutral-400/10 dark:hover:bg-neutral-400/5"
                  onClick={() => navigation.history.forward()}
                >
                  <Icon name="ArrowRight" size={12} />
                </button>
              </Flex>
              <Flex
                align="center"
                justify="center"
                grow="1"
                gap="2"
                className="p-1 rounded-md w-2/6 bg-neutral-100/50 dark:bg-neutral-100/4 border-1 border-solid border-neutral-100 dark:border-neutral-100/5"
              >
                <Text size="1" className="text-moonlightSlight">
                  {capitalize(
                    routerState.location.pathname === "/"
                      ? "Home"
                      : routerState.location.pathname === "/history"
                        ? "History"
                        : routerState.location.pathname === "/settings"
                          ? "Settings"
                          : routerState.location.pathname.includes("/editor")
                            ? `${globalState$.activeFileName.get()} | ${capitalize(
                                globalState$.editorState.get(),
                              )}`
                            : "Exploring",
                  )}
                </Text>
              </Flex>
              <ThemeButton />
              {/* <BrowserButton /> */}
              <Flex grow="1" id="drag-region" p="2" />
            </Flex>
            <Flex align="center" justify="end">
              <button
                className="p-3 hover:bg-neutral-400/10 dark:text-moonlightText dark:hover:bg-neutral-400/5"
                onClick={() => minimizeWindow()}
                type="button"
              >
                <Icon name="Minus" size={12} />
              </button>
              <button
                className="p-3 hover:bg-neutral-400/10 dark:text-moonlightText dark:hover:bg-neutral-400/5"
                onClick={() => maximizeWindow()}
                type="button"
              >
                <Icon name="Maximize2" size={12} />
              </button>
              <button
                className="p-3 hover:bg-red-500 dark:text-moonlightText hover:text-white"
                onClick={() => closeWindow()}
                type="button"
              >
                <Icon name="X" size={12} />
              </button>
            </Flex>
          </Flex>
          {/* body */}
          {children}
        </Flex>
      </motion.div>
      <Toast />
    </Flex>
  );
}

const ActionButton = () => {
  const router = useRouter();
  const { mutate: openPDF } = t.fs.openPdfFile.useMutation({
    onSuccess: (data) => {
      if (data.canceled) return;

      if (data.file === undefined) {
        toast.error("Something went wrong while opening file");
        return;
      }

      globalState$.activeFileName.set(parseFileNameFromPath(data.file));

      router.navigate({
        to: "/editor/$path",
        params: {
          path: data.file,
        },
      });
    },
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="px-2 py-2 rounded-md dark:text-moonlightText cursor-pointer hover:bg-neutral-400/10 dark:hover:bg-neutral-400/5">
          <Icon name="EllipsisVertical" size={12} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="bg-white dark:bg-moonlightOverlay"
        size="1"
        variant="soft"
      >
        <DropdownMenu.Item onClick={() => openPDF()}>
          <Flex align="center" justify="start" gap="2">
            <Icon name="FolderOpen" size={11} />
            <Text size="1">Open File</Text>
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

// const SettingsButton = () => {
//   return (
//     <Dialog.Root>
//       <Dialog.Trigger></Dialog.Trigger>
//       <Dialog.Content className="bg-moonlightWhite dark:bg-moonlightFocusLow text-black dark:text-moonlightWhite">
//         body
//       </Dialog.Content>
//     </Dialog.Root>
//   );
// };
