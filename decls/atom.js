/* @flow */

// Global Atom Object
declare var atom: Object;

declare module 'atom' {
  declare var Range: any;
  declare var TextEditor: any;
}

declare function it(name: string, callback: (() => void)): void;
declare function fit(name: string, callback: (() => void)): void;
declare function expect(value: any): Object;
declare function describe(name: string, callback: (() => void)): void;
