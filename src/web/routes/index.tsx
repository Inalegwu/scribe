import { Flex, Heading } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "../components";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Flex
      grow="1"
      gap="3"
      direction="column"
      align="center"
      justify="center"
      className="h-screen w-full overflow-y-scroll px-2 py-4"
    >
      <Icon
        name="File"
        className="text-neutral-300 dark:text-moonlightSlight"
        size={50}
      />
      <Heading size="8" className="text-neutral-300 dark:text-moonlightSlight">
        No Open File
      </Heading>
    </Flex>
  );
}
