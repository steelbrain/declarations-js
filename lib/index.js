/* @flow */

import type { TextEditor, Range } from 'atom'
import { scanDeclarations } from 'declarations-javascript'
import { processDeclaration } from './helpers'

const FLOW_PACKAGES = ['declarations-flow', 'flow-ide']

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
        if (textEditor.getText().indexOf('/* @flow */') !== -1 && FLOW_PACKAGES.some(name => atom.packages.isPackageActive(name))) {
          // Let the declarations-flow package handle the flow files
          return []
        }
        const filePath = textEditor.getPath()
        return processDeclaration(scanDeclarations(filePath, textEditor.getText(), function(node) {
          return visibleRange.containsPoint([node.loc.start.line - 1, node.loc.start.column])
        }), filePath)
      },
    }
  },
}
