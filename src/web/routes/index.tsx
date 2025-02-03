import { Flex, Heading, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { Link, createFileRoute } from "@tanstack/react-router";

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
      <Flex py="3">
        <Heading size="6" className="text-moonlightStone">
          Recent Files
        </Heading>
      </Flex>
      <Flex gap="3">
        {files?.map((file) => (
          <Link
            key={file.id}
            to="/$path"
            params={{
              path: file.filePath,
            }}
          >
            <Flex direction="column" gap="2" className="h-70 w-50">
              <Flex className="w-full h-full border-1 border-solid border-moonlightSlight rounded-md" />
              <Text size="1" className="text-moonlightWhite w-full">
                {file.fileName}
              </Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
}
