/* @flow */

import type { TextEditor, Range } from 'atom'
import scan from './scanner'

export default {
  instance: null,

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
        const entries = scan({ textEditor, visibleRange })
        if (!entries.length) {
          return []
        }
        return []
      },
    }
  },
}
