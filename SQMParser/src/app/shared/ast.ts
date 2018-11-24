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
