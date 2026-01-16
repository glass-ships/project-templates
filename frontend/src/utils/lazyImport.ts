import { lazy } from "react";

export function lazyImport(path: string, namedExport?: string) {
  return lazy(() => {
    path = path.replace("@/", "../"); // Vite cannot handle alias in dynamic imports
    const promise = import(/* @vite-ignore */ path);
    if (namedExport === undefined) {
      return promise;
    } else {
      return promise.then((module) => ({ default: module[namedExport] }));
    }
  });
}
