/* @flow */

import Path from 'path'
import resolve from 'resolve'

export function locToPoint(loc: Object): [number, number] {
  return [loc.line - 1, loc.column]
}

export function locToRange(loc: Object): [[number, number], [number, number]] {
  return [locToPoint(loc.start), locToPoint(loc.end)]
}

export function processDeclaration(entry: Object, sourceFile: string): Object {
  // TODO: Add support for jumping to the right var in external files
  let filePath
  if (entry.source.filePath) {
    try {
      filePath = resolve.sync(entry.source.filePath, Path.dirname(sourceFile))
    } catch (_) { /* No Op */ }
  }

  return {
    range: locToRange(entry.position),
    source: {
      filePath: filePath || sourceFile,
      position: filePath ? null : locToPoint(entry.source.position.start),
    },
  }
}
