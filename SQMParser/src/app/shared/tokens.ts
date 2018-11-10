export enum Token { // TODO: Remove these strings when stopped debugging
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

export enum Grammar {
  STRING = Token.STRING + Token.EQUALS + Token.QUOTE + Token.STRING + Token.SEMICOLON,
  BOOLEAN = Token.STRING + Token.EQUALS + Token.BOOLEAN + Token.SEMICOLON,
  NUMBER = Token.STRING + Token.EQUALS + Token.NUMBER + Token.SEMICOLON,
  ARRAY = Token.STRING + Token.START_SQUARE_BRACE + Token.END_SQUARE_BRACE + Token.EQUALS + Token.START_BRACE + Token.END_BRACE + Token.SEMICOLON,
  CLASS = Token.STRING + Token.START_BRACE + Token.END_BRACE + Token.SEMICOLON,
  CLASS_WITH_NAME = Token.STRING + Token.STRING + Token.START_BRACE + Token.END_BRACE + Token.SEMICOLON,
  START = Token.START_BRACE,
  END = Token.END_BRACE + Token.SEMICOLON
}
