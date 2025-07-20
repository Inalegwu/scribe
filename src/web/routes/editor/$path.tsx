import { useObservable } from "@legendapp/state/react";
import { Flex, Heading, Tooltip } from "@radix-ui/themes";
import { Icon } from "@src/web/components";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

// TODO: change this path to /viewer/$path
export const Route = createFileRoute("/editor/$path")({
  component: Component,
});

function Component() {
  const editorState = useObservable<"read" | "edit">("read");
  const { path } = Route.useParams();

  return (
    <Flex gap="6" className="w-full h-screen">
      {path}
      <Heading> {editorState.get()}</Heading>
      <Flex className="absolute z-10 p-0.5 shadow-md shadow-opacity-[0.4] shadow-moonlightSlight/10 bottom-4 border-1 border-solid border-neutral-200 dark:border-moonlightSlight/30 rounded-full left-[47vw] bg-white dark:bg-moonlightOverlay">
        <Tooltip content="Read">
          <motion.button
            animate={{
              // backgroundColor:
              //   editorState.get() === "read" ? "rgb(255 187 136 / 0.55)" : "",
              color: editorState.get() === "read" ? "rgb(255 187 136)" : "",
            }}
            onClick={() => editorState.set("read")}
            className="p-2.5 text-neutral-500  dark:text-moonlightSlight rounded-full"
          >
            <Icon name="Glasses" size={18} />
          </motion.button>
        </Tooltip>
        <Tooltip content="Edit">
          <motion.button
            animate={{
              // backgroundColor:
              //   editorState.get() === "edit" ? "rgb(255 187 136 / 0.55)" : "",
              color: editorState.get() === "edit" ? "rgb(255 187 136)" : "",
            }}
            onClick={() => editorState.set("edit")}
            className="p-2.5 text-neutral-500  dark:text-moonlightSlight rounded-full"
          >
            <Icon name="PencilLine" size={18} />
          </motion.button>
        </Tooltip>
        <motion.div
          animate={{
            transform:
              editorState.get() === "read"
                ? "translateX(0)"
                : "translateX(40px)",
          }}
          className="absolute z-0 w-[50%] h-full top-0 left-0 rounded-full bg-moonlightOrange/10"
        />
      </Flex>
    </Flex>
  );
}
