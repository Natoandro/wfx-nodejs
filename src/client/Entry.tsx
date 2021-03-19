import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { DirectoryEntry } from '../common/types';

import './Entry.scss';

interface AdditionalProps {
  [name: string]: any;
}

interface RawEntryProps {
  icon?: React.ReactNode;
  name: string;
  mtime: string;
  size?: string;
}

function RawEntry(_props: RawEntryProps & AdditionalProps) {
  const { icon, name, mtime, size = "", className, ...props } = _props;
  return (
    <div className={ clsx(className, 'Entry') } { ...props }>
      <div className="Entry-icon">{ icon }</div>
      <div className="Entry-name Entry-text-field">{ name }</div>
      <div className="Entry-modified Entry-text-field">{ mtime }</div>
      <div className="Entry-size Entry-text-field">{ size }</div>
    </div>
  );
}

namespace Entry {

  // TODO: move into utils
  function formatDate(timestamp: number) {
    if (timestamp == null) return '';
    return moment(timestamp).format('YYYY/MM/DD');
  }

  function getParentDirectory(path) {
    const array = path.split('/');
    array.splice(array.length - 2, 1);
    return array.join('/');
  }

  type DirProps = DirectoryEntry.Directory & AdditionalProps;
  export function Dir({ name, mtime, ...props }: DirProps) {
    const path = window.location.pathname;
    const href = name == '..' ? getParentDirectory(path) : `${path}${name}/`;
    const handleClick = () => {
      window.location.pathname = href;
    };
    return (
      <RawEntry
        icon={<span className="DirIcon">d</span>}
        name={name}
        mtime={formatDate(mtime)}
        onClick={handleClick}
        {...props}
      />
    );
  }

  type FileProps = DirectoryEntry.File & AdditionalProps;
  export function File({ name, mtime, size, className, ...props }: FileProps) {
    return (
      <RawEntry
        name={name}
        mtime={formatDate(mtime)}
        size={`${size} B`}
      />
    );
  }

  export function Header({ ...props }: AdditionalProps) {
    return (
      <RawEntry
        name="Name"
        mtime="Modified"
        size="Size"
        className="HeaderEntry"
      />
    );
  }
}

export default Entry;
