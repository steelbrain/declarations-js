/* @flow */

import type { TextEditor, Range } from 'atom'
import { scanDeclarations } from 'declarations-javascript'
import { processDeclaration } from './helpers'

export default {
  activate() {
    if (!atom.inSpecMode()) {
      require('atom-package-deps').install('declarations-js') // eslint-disable-line
    }
  },

  provideDeclarations() {
    return {
      grammarScopes: ['source.js', 'source.js.jsx'],
      async getDeclarations({ textEditor, visibleRange }: { textEditor: TextEditor, visibleRange: Range }) {
        if (atom.packages.isPackageActive('declarations-flow') && textEditor.getText().indexOf('/* @flow */') !== -1) {
          // Let the declarations-flow package handle the flow files
          return []
        }
        const filePath = textEditor.getPath()
        let declarations
        try {
          declarations = scanDeclarations(filePath, textEditor.getText(), function(node) {
            return visibleRange.containsPoint([node.loc.start.line - 1, node.loc.start.column])
          })
        } catch (_) {
          return []
        }
        return processDeclaration(declarations, filePath)
      },
    }
  },
}
