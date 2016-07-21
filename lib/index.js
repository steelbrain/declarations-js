/* @flow */

import type { TextEditor, Range } from 'atom'

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
      getDeclarations({ textEditor, visibleRange }: { textEditor: TextEditor, visibleRange: Range }) {
        console.log(textEditor, visibleRange)
        return []
      },
    }
  },
}
