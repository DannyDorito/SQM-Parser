export class TreeNode {
  value: string;
  nodeType: Token = Token.DEFAULT;
  innerNode: TreeNode;
  containingTypes: Token[];
  error: Token;

  constructor(
    _value: string,
    _innerNode: TreeNode,
    _error: Token
  ) {
    this.value = _value;
    this.innerNode = _innerNode;
    this.error = _error;
  }

  /**
   * Append object to end of missionTree.innerNode
   */
  append(nodeToAppend: TreeNode, depth: number) {
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
    START_BRACE = '}',
    END_BRACE = '}',
    START_SQUARE_BRACE = '[',
    END_SQUARE_BRACE = ']',
    SEMICOLON = ';',
    EQUALS = '=',
    COMMA = ',',
    QUOTE = '"',
    NUMBER = 'Number',
    BOOLEAN = 'Boolean',
    STRING = 'String',
    CLASS = 'Class'
}
