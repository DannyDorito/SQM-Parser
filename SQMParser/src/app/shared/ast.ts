export class ASTNode {
  value: string;
  type: Lexeme;
  data: any[];

  constructor(
    _value: string,
    _type: Lexeme,
    _data: any[]
  ) {
    this.value = _value;
    this.type = _type;
    this.data = _data;
  }
}

export enum Lexeme {
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

export enum LexemeRegex {
  BOOLEAN = 'true|false',
  WHITESPACE = '[ \s\t\n\r]+',
  START_SQUARE_BRACKET = '\[',
  END_SQUARE_BRACKET = ']',
  QUOTE = '"',
  EQUALS = '=',
  START_BRACE = '{',
  NUMBER = '[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?',
  END_BRACE = '}',
  COMMA = ',',
  STRING = '^(?!class)([a-zA-Z]+)',
  CLASS = 'class',
  SEMICOLON = ';'
}
