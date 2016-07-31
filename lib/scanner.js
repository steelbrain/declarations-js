/* @flow */

import traverse from 'babel-traverse'
import { parse } from 'babylon'
import type { TextEditor, Range } from 'atom'
import { nodeInRange, getBinding } from './helpers'
import type { Declaration } from './types'

export default function scan({ textEditor, visibleRange }: { textEditor: TextEditor, visibleRange: Range }): Array<Declaration> {
  let ast
  const toReturn = []
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

  traverse(ast, {
    ReferencedIdentifier(path: Object) {
      if (!path.node.loc || !nodeInRange(path.node, visibleRange)) {
        return
      }
      const declaration = getBinding(path.scope, path.node.name)
      if (!declaration) {
        return
      }

      let declarationName = null
      let declarationPath = null
      const declarationPosition = declaration.identifier.loc

      if (declaration.path.type === 'ImportDefaultSpecifier') {
        declarationPath = declaration.path.parent.source.value
      } else if (declaration.path.type === 'ImportSpecifier') {
        declarationPath = declaration.path.parent.source.value
        declarationName = declaration.path.node.imported.name
      } else if (declaration.path.type === 'VariableDeclarator') {
        const node = declaration.path.node
        if (
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'Identifier' &&
          node.init.callee.name === 'require' &&
          node.init.arguments.length &&
          node.init.arguments[0].type === 'StringLiteral'
        ) {
          declarationPath = node.init.arguments[0].value
        }
        if (declarationPath && node.id.type === 'ObjectPattern') {
          for (let i = 0, length = node.id.properties.length; i < length; ++i) {
            const entry = node.id.properties[i]
            if (declarationPosition && entry.loc && entry.loc.line === declarationPosition.line && entry.loc.column === declarationPosition.column) {
              if (entry.key && entry.key.type === 'Identifier') {
                declarationName = entry.key
              }
              break
            }
          }
        }
      }

      toReturn.push({
        name: path.node.name,
        position: path.node.loc,
        source: {
          name: declarationName,
          filePath: declarationPath,
          position: declarationPosition,
        },
      })
    },
  })

  return toReturn
}
