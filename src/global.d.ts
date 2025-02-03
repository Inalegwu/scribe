declare global {
  export type GlobalState = {
    colorMode: "dark" | "light";
  };

  export type PDF = {
    filePath: string;
    thumbnail: string;
    fileName: string;
    lastAccessed: string;
  };
}

export type {};
