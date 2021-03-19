import React from 'react';
import { DirectoryEntries } from '../common/types';

import './WfxApp.scss';

import Entry from './Entry';

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
    <div className="Entries">
      <Entry.Header />
      {window.location.pathname === '/' || <Entry.Dir name=".." mtime={null} />}
      {entries.dirs.map(data => <Entry.Dir key={data.name} {...data} />)}
      {entries.files.map(data => <Entry.File key={data.name} {...data} />)}
    </div>
  );
}


export default function () {
  const path = decodeURIComponent(window.location.pathname);

  const [entries, setEntries] = React.useState<DirectoryEntries | null>(null);

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
