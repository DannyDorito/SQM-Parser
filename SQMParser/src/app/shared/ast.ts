export class ASTNode {
  value: string;
  type: Token;
  data: ASTNode[];
  hasError: boolean;
  containingTypes: Token[];

  constructor(
    _value: string,
    _type: Token,
    _data: ASTNode[]
  ) {
    this.value = _value;
    this.type = _type;
    this.data = _data;
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
      this.data.push(nodeToAppend);
    }
    return this;
  }
}

export enum Token {
  DEFAULT = 'DEFAULT',
  WHITESPACE = 'WHITESPACE',
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
