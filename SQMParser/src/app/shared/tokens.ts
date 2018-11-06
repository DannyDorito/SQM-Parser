export enum Token {
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
  ARRAY_CONTENTS = 'ARRAY_CONTENTS',
  CLASS_CONTENTS = 'CLASS_CONTENTS'
}

export enum Grammar {
  STRING = Token.STRING + Token.EQUALS + Token.QUOTE + Token.STRING + Token.QUOTE + Token.SEMICOLON,
  BOOLEAN = Token.STRING + Token.EQUALS + Token.BOOLEAN + Token.SEMICOLON,
  NUMBER = Token.STRING + Token.EQUALS + Token.NUMBER + Token.SEMICOLON,
  ARRAY = Token.STRING + Token.START_SQUARE_BRACE + Token.EQUALS + Token.START_BRACE + Token.ARRAY_CONTENTS + Token.END_BRACE + Token.SEMICOLON,
  CLASS = Token.STRING + Token.EQUALS + Token.STRING + Token.START_BRACE + Token.CLASS_CONTENTS + Token.END_BRACE
}

export class FoundToken {
  type: Token;
  value: string;
  line: number;
  position: number;
  constructor(
    _type: Token,
    _value: string,
    _line: number,
    _position: number
  ) {
    this.type = _type;
    this.value = _value;
    this.line = _line;
    this.position = _position;
  }
}
