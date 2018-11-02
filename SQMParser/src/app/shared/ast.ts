import { FoundToken } from './tokens';

export class AST {
  item: FoundToken;
  children: AST[];
  constructor(
    _item: FoundToken,
    _children: AST[]
  ) {
    this.item = _item;
    this.children = _children;
  }
}
