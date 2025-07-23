import { Switch } from "@legendapp/state/react";
import { Flex, Tooltip } from "@radix-ui/themes";
import { Icon } from "@src/web/components";
import { globalState$ } from "@src/web/state";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import React from "react";

// TODO: change this path to /viewer/$path
export const Route = createFileRoute("/editor/$path")({
  component: Component,
});

function Component() {
  const editorState = globalState$.editorState.get();
  const { path } = Route.useParams();

  return (
    <Flex direction="column" className="w-full h-screen">
      <Switch value={editorState}>
        {{
          edit: () => <Edit />,
          read: () => <Read />,
        }}
      </Switch>
      <Flex className="absolute z-10 p-0.5 shadow-md shadow-opacity-[0.4] shadow-moonlightSlight/10 bottom-4 border-1 border-solid border-neutral-200 dark:border-moonlightSlight/30 rounded-full left-[47vw] bg-white dark:bg-moonlightOverlay">
        <Tooltip content="Read">
          <motion.button
            animate={{
              // backgroundColor:
              //   editorState.get() === "read" ? "rgb(255 187 136 / 0.55)" : "",
              color:
                globalState$.editorState.get() === "read"
                  ? "rgb(255 187 136)"
                  : "",
            }}
            onClick={() => globalState$.editorState.set("read")}
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
              color:
                globalState$.editorState.get() === "edit"
                  ? "rgb(255 187 136)"
                  : "",
            }}
            onClick={() => globalState$.editorState.set("edit")}
            className="p-2.5 text-neutral-500  dark:text-moonlightSlight rounded-full"
          >
            <Icon name="PencilLine" size={18} />
          </motion.button>
        </Tooltip>
        <motion.div
          animate={{
            transform:
              globalState$.editorState.get() === "read"
                ? "translateX(0)"
                : "translateX(40px)",
          }}
          className="absolute z-0 w-[50%] h-full top-0 left-0 rounded-full bg-moonlightOrange/10"
        />
      </Flex>
    </Flex>
  );
}

const Edit = React.memo(() => {
  return (
    <Flex direction="column">
      <Flex
        align="center"
        justify="start"
        className="w-full bg-neutral-100 dark:bg-moonlightFocusLow border-y-solid border-y-[0.1px] border-y-neutral-200 dark:border-y-moonlightSlight/10"
      >
        <button className="p-4 hover:bg-neutral-300/10">
          <Icon name="Heading1" size={15} />
        </button>
      </Flex>
    </Flex>
  );
});

const Read = React.memo(() => {
  return <Flex>read view</Flex>;
});
