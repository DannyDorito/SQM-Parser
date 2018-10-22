export enum Token {
  NUMBER,
  BOOLEAN,
  STRING,
  ARRAY,
  // VERSION,
  // ADDONS,
  // ADDONS_AUTO,
  CLASS,
  INCLUDE,
  WHITESPACE,
  EOL,
  START_BRACE,
  END_BRACE,
  END_BRACE_SEMICOLON,
  SQUARE_BRACKET,
  COMMA,
  SEMICOLON,
  EQUALS,
  TRAILING_COMMA,
  PRIMITIVE_NUMBER,
  PRIMITIVE_BOOLEAN,
  PRIMITIVE_STRING
}

export class FoundToken {
  type: Token;
  value: string;
  index: number;
  constructor(
    _type: Token,
    _value: string,
    _index: number
  ) {
    this.type = _type;
    this.value = _value;
    this.index = _index;
  }
}
