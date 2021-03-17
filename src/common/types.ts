
export namespace DirectoryEntry {
  export interface File {
    name: string;
    size: number;
    mtime: number;
  }

  export interface Directory {
    name: string;
    mtime: number;
  }

}

export interface DirectoryEntries {
  dirs: DirectoryEntry.Directory[];
  files: DirectoryEntry.File[];
}

export interface DirectoryEntry {
  type: "directory" | "file" | null;
  name: string;
  size: number;
  mtime: number;
}
