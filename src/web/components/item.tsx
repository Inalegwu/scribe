import { Flex, Text } from "@radix-ui/themes";
import moment from "moment";
import { memo } from "react";

type Props = {
  pdf: PDF & { id: string };
};

export const Item = memo(({ pdf }: Props) => {
  return (
    <Flex direction="column" gap="1" className="w-40">
      <Flex className="h-60 w-full border-1 rounded-md border-solid border-neutral-200 dark:border-neutral-800" />
      <Flex direction="column" align="start">
        <Text size="1" className="dark:text-moonlightWhite">
          {pdf.fileName}
        </Text>
        <Text size="1" className="text-moonlightSoft">
          {moment(pdf.lastAccessed).fromNow()}
        </Text>
      </Flex>
    </Flex>
  );
});
