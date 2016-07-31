/* @flow */

import traverse from 'babel-traverse'
import { parse } from 'babylon'
import type { TextEditor, Range } from 'atom'
import { nodeInRange } from './helpers'

export default function scan({ textEditor, visibleRange }: { textEditor: TextEditor, visibleRange: Range }): Array<Object> {
  let ast
  try {
    ast = parse(textEditor.getText(), {
      sourceType: 'module',
      plugins: [
        'jsx',
        'flow',
        'asyncFunctions',
        'classConstructorCall',
        'doExpressions',
        'trailingFunctionCommas',
        'objectRestSpread',
        'decorators',
        'classProperties',
        'exportExtensions',
        'exponentiationOperator',
        'asyncGenerators',
        'functionBind',
        'functionSent',
      ],
      filename: textEditor.getPath(),
    })
  } catch (_) {
    return []
  }
  const toReturn = []
  traverse(ast, {
    ReferencedIdentifier(path: Object) {
      if (!path.node.loc || !nodeInRange(path.node, visibleRange)) {
        return
      }
      const declaration = path.scope.getBinding(path.node.name)
      if (!declaration) {
        return
      }
      console.log(Object.assign({}, declaration))
      // toReturn.push({
      //   node: path.node,
      //   declaration,
      // })
    },
  })
  console.log('toReturn', toReturn, 'visibleRange', visibleRange)
  return []
}
