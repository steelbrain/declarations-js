/* @flow */

import Path from 'path'
import resolve from 'resolve'

export function locToPoint(loc: Object): [number, number] {
  return [loc.line - 1, loc.column]
}

export function locToRange(loc: Object): [[number, number], [number, number]] {
  return [locToPoint(loc.start), locToPoint(loc.end)]
}

export function processDeclaration(entries: Array<Object>, sourceFile: string): Array<Object> {
  const toReturn = []
  for (let i = 0, length = entries.length; i < length; ++i) {
    const entry = entries[i]
    let filePath = entry.source.filePath
    if (filePath) {
      if (resolve.isCore(filePath)) {
        continue
      }
      try {
        filePath = resolve.sync(filePath, {
          basedir: Path.dirname(sourceFile),
        })
      } catch (_) {
        continue
      }
    }
    toReturn.push({
      range: locToRange(entry.position),
      source: {
        filePath: filePath || sourceFile,
        position: entry.source.position ? locToPoint(entry.source.position.start) : null,
      },
    })
  }
  return toReturn
}
