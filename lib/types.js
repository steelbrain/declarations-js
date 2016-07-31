/* @flow */

export type Declaration = {
  name: string,
  position: { line: number, column: number },
  source: {
    name: ?string,
    filePath: ?string,
    position: { line: number, column: number },
  }
}
