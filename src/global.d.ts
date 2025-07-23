declare global {
  export type GlobalState = {
    colorMode: "dark" | "light";
    editorState: "edit" | "read";
    activeFileName: string | null;
  };

  export type PDF = {
    filePath: string;
    thumbnail: string;
    fileName: string;
    lastAccessed: string;
  };

  export type DeeplinkChannel = {
    path: string;
  };
}

export type {};
