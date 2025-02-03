import { Flex, Text } from "@radix-ui/themes";
import type { ErrorComponentProps } from "@tanstack/react-router";

export default function ErrorComponent(props: ErrorComponentProps) {
  return (
    <Flex
      className="w-full h-screen bg-red-50 px-10"
      direction="column"
      align="center"
      justify="center"
    >
      <Text>Error</Text>
      <Text>{props.error.message}</Text>
    </Flex>
  );
}
