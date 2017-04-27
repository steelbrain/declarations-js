/* @flow */

import Path from 'path'
import resolve from 'resolve'

function getRootFromConfig () {
  const valInConfug = atom.config.get('declarations-js.rootPath');
  return valInConfug ? valInConfug.split(';') : [];
}

let rootsPath = getRootFromConfig();

atom.config.onDidChange('declarations-js.rootPath', () => {
  rootsPath = getRootFromConfig();
})

export function locToPoint(loc: Object): [number, number] {
  return [loc.line - 1, loc.column]
}

export function locToRange(loc: Object): [[number, number], [number, number]] {
  return [locToPoint(loc.start), locToPoint(loc.end)]
}

export function processDeclaration(entries: Array<Object>, sourceFile: string): Array<Object> {
  const toReturn = []
  
  const openProjects = atom.project.getPaths()
  let projectPath
  for (let i = 0, length = openProjects.length; i < length; ++i) {
  	if (sourceFile.indexOf(openProjects[i]) === 0) {
  	  projectPath = openProjects[i]
  	  break
  	}
  }
  
  for (let i = 0, length = entries.length; i < length; ++i) {
    const entry = entries[i]
    let filePath = entry.source.filePath

    if (filePath) {
      if (resolve.isCore(filePath)) {
        continue
      }
    
      let hasError = false
    
      try {
        filePath = resolve.sync(filePath, {
          basedir: Path.dirname(sourceFile),
        })
      } catch (_) {
        hasError = true
        
        for (let j = 0, rootLength = rootsPath.length; j < rootLength; ++j) {
          hasError = false
          try {
            filePath = resolve.sync('./', {
              basedir: Path.join(projectPath, rootsPath[j], filePath),
            })
            break
          } catch (_) {
            hasError = true 
          }
        }
      }
  
      if (hasError) {
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
