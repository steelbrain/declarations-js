/* @flow */

import type { Range } from 'atom'

export function nodeInRange(node: Object, range: Range): boolean {
  return range.containsPoint([node.loc.start.line - 1, node.loc.start.column])
}
