import { FoundToken } from './tokens';

export class AST {
  item: FoundToken;
  children: AST[];
  lineContents: string;
  constructor(
    _item: FoundToken,
    _children: AST[],
    _lineContents: string
  ) {
    this.item = _item;
    this.children = _children;
    this.lineContents = _lineContents;
  }
}
