# Installation
> `npm install --save @types/fs-readfile-promise`

# Summary
This package contains type definitions for fs-readfile-promise (https://github.com/shinnn/fs-readfile-promise).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/fs-readfile-promise.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/fs-readfile-promise/index.d.ts)
````ts
/// <reference types="node" />
import { PathLike } from "fs";
type PathType = PathLike | number;
type OptionsType = { encoding: string; flag?: string | undefined } | string;

export = fsReadFilePromise;

/**
 * Asynchronously reads the entire contents of a file.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
 * @param options Either the encoding for the result, or an object that contains the encoding and an optional flag.
 * If a flag is not provided, it defaults to `'r'`.
 */
declare function fsReadFilePromise(path: PathType, options: OptionsType): Promise<string>;

/**
 * Asynchronously reads the entire contents of a file.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
 */
declare function fsReadFilePromise(path: PathType, options?: null): Promise<Buffer>;

declare namespace fsReadFilePromise {}

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 03:09:37 GMT
 * Dependencies: [@types/node](https://npmjs.com/package/@types/node)

# Credits
These definitions were written by [Motosugi Murata](https://github.com/mtsg).
