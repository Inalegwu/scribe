import { Flex } from "@radix-ui/themes";
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
      gap="3"
      className="h-screen w-full overflow-y-scroll px-2 py-4"
    >
      {files?.map((file) => (
        <Item key={file.id} pdf={file} />
      ))}
    </Flex>
  );
}
