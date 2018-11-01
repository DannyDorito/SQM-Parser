export enum Token {
  WHITESPACE,
  START_BRACE,
  END_BRACE,
  START_SQUARE_BRACE,
  END_SQUARE_BRACE,
  SEMICOLON,
  EQUALS,
  COMMA,
  QUOTE,
  NUMBER,
  BOOLEAN,
  STRING
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
