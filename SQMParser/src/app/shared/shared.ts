export class TreeNode {
  value: string;
  nodeType: Token;
  innerNode: TreeNode;
  containingTypes: Token[];
  error: string;

  constructor(
    _value: string,
    _nodeType: Token,
    _innerNode: TreeNode
  ) {
    this.value = _value;
    this.nodeType = _nodeType;
    this.innerNode = _innerNode;
  }

  /**
   * Append object to end of missionTree.innerNode
   */
  append(nodeToAppend, depth: number) {
    if (depth > 0) {
      this.append(nodeToAppend, (depth - 1));
    } else {
      this.innerNode = nodeToAppend;
    }
    return this;
  }
}

export enum Token {
  DEFAULT = 'DEFAULT',
  START_BRACE = 'START_BRACE',
  END_BRACE = 'END_BRACE',
  START_SQUARE_BRACE = 'START_SQUARE_BRACE',
  END_SQUARE_BRACE = 'END_SQUARE_BRACE',
  SEMICOLON = 'SEMICOLON',
  EQUALS = 'EQUALS',
  COMMA = 'COMMA',
  QUOTE = 'QUOTE',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  CLASS = 'CLASS'
}
