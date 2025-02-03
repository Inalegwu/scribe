import { Icon, Spinner } from "@components/index";
import { computed } from "@legendapp/state";
import { Flex, Text, Tooltip } from "@radix-ui/themes";
import t from "@shared/config";
import { useRouter, useRouterState } from "@tanstack/react-router";
import type React from "react";
import { useEffect } from "react";
import { globalState$ } from "../state";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const utils = t.useUtils();
  const router = useRouterState();
  const navigation = useRouter();
  const { mutate: minimizeWindow } = t.window.minimize.useMutation();
  const { mutate: maximizeWindow } = t.window.maximize.useMutation();
  const { mutate: closeWindow } = t.window.closeWindow.useMutation();

  const isNotHome = computed(() => router.location.pathname === "/").get();

  const { mutate: openPDF, isLoading: addingPDF } =
    t.fs.openPdfFile.useMutation({
      onSuccess: (data) => {
        if (data.canceled) return;

        utils.invalidate();
      },
    });

  useEffect(() => {
    if (globalState$.colorMode.get() === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <Flex
      width="100%"
      direction="column"
      grow="1"
      className="transition bg-moonlightWhite dark:bg-moonlightBase"
    >
      <Flex
        align="center"
        justify="between"
        className="px-2 py-2 border-b-1 border-b-solid border-b-neutral-50 dark:border-b-neutral-800"
      >
        <Flex align="center" justify="start" gap="4">
          <Text size="2" className="text-moonlightStone" weight="medium">
            Scribe
          </Text>
          <Flex gap="4" align="center" justify="center">
            <Tooltip content="Open PDF">
              <button
                onClick={() => openPDF()}
                className="flex items-center  space-x-2 justify-center text-moonlightSoft"
              >
                {addingPDF ? (
                  <Spinner size={13} />
                ) : (
                  <Icon name="Plus" size={13} />
                )}
              </button>
            </Tooltip>
            <Flex align="center" justify="start" gap="3">
              <button
                onClick={() => navigation.history.back()}
                className="text-moonlightSoft flex items-center justify-center"
                disabled={isNotHome}
              >
                <Icon name="ArrowLeft" size={13} />
              </button>
              <button
                className="text-moonlightSoft flex items-center justify-center"
                onClick={() => navigation.history.forward()}
              >
                <Icon name="ArrowRight" size={13} />
              </button>
            </Flex>
          </Flex>
        </Flex>
        <Flex id="drag-region" grow="1" p="2" />
        <Flex align="center" justify="end" gap="3">
          <button
            className="px-1 text-moonlightStone"
            onClick={() => minimizeWindow()}
          >
            <Icon name="Minus" size={12} />
          </button>
          <button
            className="px-1 text-moonlightStone"
            onClick={() => maximizeWindow()}
          >
            <Icon name="Maximize" size={12} />
          </button>
          <button className="px-1 text-red-500" onClick={() => closeWindow()}>
            <Icon name="X" size={12} />
          </button>
        </Flex>
      </Flex>
      {children}
    </Flex>
  );
}
