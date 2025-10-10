import { lazy } from "react";

// Usage:
//   const SomeComponent = lazyImport('./path/to/module', 'NamedExport');
// If the module has a default export, you can call it with just the path:
// const SomeComponent = lazyImport('./path/to/module');

export function lazyImport(path: string, namedExport: string) {
  return lazy(() => {
    const promise = import(path);
    if (namedExport == null) {
      return promise;
    } else {
      return promise.then((module) => ({ default: module[namedExport] }));
    }
  });
}
