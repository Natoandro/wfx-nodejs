import React from 'react';
import { DirectoryEntries, DirectoryEntry } from '../common/types';

namespace Entry {
  interface DirProps {
    data: DirectoryEntry.Directory;
  }

  export function Dir({ data }: DirProps) {
    const path = `${window.location}${data.name}/`;
    return (
      <li>
        <a href={ path }>(dir) { data.name }</a>
      </li>
    );
  }

  interface FileProps {
    data: DirectoryEntry.File;
  }
  export function File({ data }: FileProps) {
    return (
      <li>{ data.name }</li>
    );
  }
}

async function getEntries(path) {
  const response = await window.fetch(path, {
    headers: { 'Accept': 'application/json' }
  });
  return await response.json() as DirectoryEntries;
}
interface EntriesProps {
  entries: DirectoryEntries;
}
function Entries({ entries }: EntriesProps) {
  return (
    <ul>
      { entries.dirs.map(data => <Entry.Dir key={data.name} data={ data } />) }
      { entries.files.map(data => <Entry.File key={data.name} data={ data } />) }
    </ul>
  );
}


export default function () {
  const path = window.location.pathname;

  const [entries, setEntries] = React.useState<DirectoryEntries | null>(null);
  console.log('entries-', entries);

  React.useEffect(() => {
    getEntries(path).then(setEntries);
  }, []);

  return (
    <React.Fragment>
      <h1>WFX: index of { path }</h1>
      { entries && <Entries entries={entries } /> }
    </React.Fragment>
  );
}
