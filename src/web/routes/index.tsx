import { Flex, Heading } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createFileRoute } from "@tanstack/react-router";
import { Item } from "../components/item";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: files } = t.fs.getOpenedFiles.useQuery();

  return (
    <Flex
      grow="1"
      direction="column"
      gap="3"
      className="h-screen w-full overflow-y-scroll px-2 py-1"
    >
      <Flex py="1">
        <Heading size="6" className="text-black dark:text-moonlightWhite">
          Recent Files
        </Heading>
      </Flex>
      <Flex gap="3" wrap="wrap">
        {files?.map((file) => (
          <Item key={file.id} pdf={file} />
        ))}
      </Flex>
    </Flex>
  );
}
