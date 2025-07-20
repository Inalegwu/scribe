import { Flex } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";

export const Route = createFileRoute("/settings")({
  component: memo(Component),
});

function Component() {
  return <Flex className="w-full h-full">Settings page</Flex>;
}
