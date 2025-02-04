import { computed } from "@legendapp/state";
import { useObservable } from "@legendapp/state/react";
import { Dialog, DropdownMenu, Flex, Heading, Text } from "@radix-ui/themes";
import t from "@shared/config";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect } from "react";
import { globalState$ } from "../state";
import Icon from "./icon";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouterState();
  const navigation = useRouter();
  const { mutate: minimizeWindow } = t.window.minimize.useMutation();
  const { mutate: maximizeWindow } = t.window.maximize.useMutation();
  const { mutate: closeWindow } = t.window.closeWindow.useMutation();

  const isNotHome = computed(() => router.location.pathname === "/").get();
  const sidebar = useObservable(false);
  const colorMode = globalState$.colorMode.get();

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
      className="transition bg-moonlightWhite w-full h-screen dark:bg-moonlightBase"
    >
      <motion.div
        animate={{
          width: sidebar.get() ? "20%" : "0%",
          display: sidebar.get() ? "flex" : "none",
          opacity: sidebar.get() ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          bounce: 1,
        }}
        className="border-r-solid border-r-1 border-r-neutral-200 dark:border-r-neutral-800"
      >
        <Flex
          direction="column"
          gap="2"
          className="w-full h-full bg-neutral-50 dark:bg-moonlightFocusLow px-2 py-1"
        >
          <Flex align="center" justify="between">
            <Heading size="4" className="text-moonlightIndigo">
              Scribe
            </Heading>
            <MenuButton />
          </Flex>
          <Flex direction="column" grow="1">
            content
          </Flex>
          <Flex align="center" justify="between" width="100%">
            <button
              onClick={() =>
                globalState$.colorMode.set(
                  colorMode === "dark" ? "light" : "dark",
                )
              }
              className="px-1 py-2 dark:text-moonlightStone"
            >
              <Icon name={colorMode === "dark" ? "Sun" : "Moon"} size={13} />
            </button>
            <SettingsButton />
          </Flex>
        </Flex>
      </motion.div>
      <motion.div
        animate={{
          width: sidebar.get() ? "80%" : "100%",
        }}
        className="h-full flex flex-col"
      >
        <Flex
          className="w-full border-b-solid border-b-1 border-b-neutral-100 dark:border-b-neutral-800"
          align="center"
          justify="between"
        >
          <Flex align="center" justify="start">
            <button
              onClick={() => sidebar.set(!sidebar.get())}
              className="px-3 py-3 text-black dark:text-neutral-400"
            >
              <Sidebar size={13} />
            </button>
            <button
              className="px-3 py-3 dark:disabled:text-neutral-700 dark:text-neutral-500"
              disabled={isNotHome}
              onClick={() => navigation.history.back()}
            >
              <Icon name="ArrowLeft" size={13} />
            </button>
            <button
              className="px-3 py-3 dark:text-neutral-500"
              onClick={() => navigation.history.forward()}
            >
              <Icon name="ArrowRight" size={13} />
            </button>
          </Flex>
          <Flex id="drag-region" grow="1" p="2" />
          <Flex align="center" justify="end">
            <button
              onClick={() => minimizeWindow()}
              className="px-3 py-3 text-neutral-500 dark:text-neutral-400"
            >
              <Icon name="Minus" size={13} />
            </button>
            <button
              onClick={() => maximizeWindow()}
              className="px-3 py-3 text-neutral-500 dark:text-neutral-400"
            >
              <Icon name="Maximize" size={13} />
            </button>
            <button
              onClick={() => closeWindow()}
              className="px-3 py-3 text-red-500"
            >
              <Icon name="X" size={13} />
            </button>
          </Flex>
        </Flex>
        <Flex grow="1">{children}</Flex>
      </motion.div>
    </Flex>
  );
}

const MenuButton = () => {
  const utils = t.useUtils();
  const { mutate: openPDF } = t.fs.openPdfFile.useMutation({
    onSuccess: (data) => {
      if (data.canceled) return;

      utils.invalidate();
    },
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="px-1 py-2 dark:text-neutral-500">
          <Icon name="EllipsisVertical" size={13} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1" color="indigo" variant="soft">
        <DropdownMenu.Item onClick={() => openPDF()}>
          <Flex align="center" justify="start" gap="2">
            <Icon name="FolderOpen" size={12} />
            <Text>Open File</Text>
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const SettingsButton = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="px-1 py-2 dark:text-moonlightStone">
          <Icon name="Settings" size={13} />
        </button>
      </Dialog.Trigger>
      <Dialog.Content className="bg-moonlightWhite dark:bg-moonlightFocusLow text-black dark:text-moonlightWhite">
        body
      </Dialog.Content>
    </Dialog.Root>
  );
};
