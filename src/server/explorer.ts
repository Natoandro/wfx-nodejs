import fs, { Stats } from 'fs';
import path from 'path';
import { DirectoryEntries, DirectoryEntry } from '../common/types';

const { stat, opendir } = fs.promises;


export default class Explorer {
  root: string;

  constructor(root: string) {
    this.root = root || process.env['HOME'];
  }

  async getDirectoryContent(pathname: string): Promise<DirectoryEntries> {
    const dirname = path.join(this.root, pathname);
    const dir = await opendir(dirname);

    const dirs: DirectoryEntry.Directory[] = [];
    const files: DirectoryEntry.File[] = [];

    for await (let entry of dir) {
      try {
        const stats = await stat(path.join(dirname, entry.name));
        if (entry.isDirectory()) dirs.push(Explorer.directory(entry.name, stats));
        else if (entry.isFile()) files.push(Explorer.file(entry.name, stats));
      }
      catch (err) {
        console.error(`Could not read file: ${path.join(dirname, entry.name)}`);
        continue;
      }
    }

    return { dirs, files };
  }

  private static directory(name: string, stats: Stats): DirectoryEntry.Directory {
    return {
      name,
      mtime: stats.mtimeMs
    };
  }

  private static file(name: string, stats: Stats): DirectoryEntry.File {
    return {
      name,
      mtime: stats.mtimeMs,
      size: stats.size
    };
  }

}

