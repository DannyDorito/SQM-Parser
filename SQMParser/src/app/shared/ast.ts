export class ASTNode {
  value: string;
  nodeType: Token;
  innerNode: ASTNode;
  hasError: boolean;
  containingTypes: Token[];

  constructor(
    _value: string,
    _nodeType: Token,
    _innerNode: ASTNode
  ) {
    this.value = _value;
    this.nodeType = _nodeType;
    this.innerNode = _innerNode;
  }

  /**
   * Append object to end of ASTMission.data
   * Based on:
   * https://stackoverflow.com/a/1693066 [Online] Accessed 12th November 2018
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

export class ASTTree {
  nodes: any[];
  constructor(
    _nodes: any
  ) {
    this.nodes = _nodes;
  }
}

export class NonTerminalNode {
  nodeType: Grammar;
  innerNodes: any[];
  constructor (
    _nodeType: Grammar,
    _innerNodes: any[]
  ) {
    this.nodeType = _nodeType;
    this.innerNodes = _innerNodes;
  }
}

export class TerminalNode {
  value: string;
  nodeType: Token;
  constructor(
    _value: string,
    _nodeType: Token
  ) {
    this.value = _value;
    this.nodeType = _nodeType;
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

export enum Grammar {
  DEFAULT = 'DEFAULT',
  STRING = 'STRING_VAR',
  NUMBER = 'NUMBER_VAR',
  BOOLEAN = 'BOOLEAN_VAR',
  ARRAY = 'ARRAY',
  CLASS = 'CLASS'
}

export enum GrammarRules {
  STRING = Token.STRING + Token.EQUALS + Token.QUOTE + Token.STRING + Token.QUOTE + Token.SEMICOLON
}
