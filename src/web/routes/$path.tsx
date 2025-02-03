import { Flex } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$path")({
  component: Component,
});

function Component() {
  const { path } = Route.useParams();

  return <Flex className="w-full h-screen">{path}</Flex>;
}
