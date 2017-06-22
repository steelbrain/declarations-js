/* @flow */

import { scanDeclarations } from 'declarations-javascript'
import type { TextEditor, Range } from 'atom'
import { processDeclaration } from './helpers'

const FLOW_PACKAGES = ['declarations-flow']

export default {
  config: {
    rootPath: {
      type: 'string',
      title: 'Root folder path',
      description: 'Specify Root folder path. More than one path separated by ;',
      default: '',
      order: 1
    }
  },
	
  activate() {
    if (!atom.inSpecMode()) {
       // eslint-disable-next-line global-require
      require('atom-package-deps').install('declarations-js')
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
