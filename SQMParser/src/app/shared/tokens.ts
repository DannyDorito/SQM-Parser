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
  START_SQUARE_BRACE,
  END_SQUARE_BRACE,
  COMMA,
  SEMICOLON,
  EQUALS,
  TRAILING_COMMA,
  PRIMITIVE_NUMBER,
  PRIMITIVE_BOOLEAN,
  PRIMITIVE_STRING,
  NAME
}

export enum Grammar {
  CLASS,
  STRING,
  NUMBER,
  BOOLEAN,
  ARRAY
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
