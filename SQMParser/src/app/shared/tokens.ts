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
  STRING = 'STRING'
}

export class FoundToken {
  type: Token;
  value: string;
  posX: number;
  posY: number;
  constructor(
    _type: Token,
    _value: string,
    _posX: number,
    _posY: number
    ) {
    this.type = _type;
    this.value = _value;
    this.posX = _posX;
    this.posY = _posY;
  }
}
