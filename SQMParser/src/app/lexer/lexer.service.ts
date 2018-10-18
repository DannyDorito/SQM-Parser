import { Injectable } from '@angular/core';

enum TOKENS {
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
const tokens = [
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: TOKENS.NUMBER },
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)(true|false);/, tokenType: TOKENS.BOOLEAN },
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)"(?:\\.|[^"])*";/, tokenType: TOKENS.STRING },
  { regex: /(?:\\.|[^"])+\[\]\s*=\s*\{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*"|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?,[\r\n]*|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|true,[\r\n]*|true|false,[\r\n]*|false)+([\r\n]*)(\})/, tokenType: TOKENS.ARRAY },
  { regex: /class (?:\\.|[^"])*/, tokenType: TOKENS.CLASS },
  // { regex: /(version\s*=\s*)(?:0|[1-9]\d*);/, tokenType: tokensEnum.VERSION },
  // { regex: /addOns\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: tokensEnum.ADDONS },
  // { regex: /addOnsAuto\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: tokensEnum.ADDONS_AUTO },
  { regex: /#include "(?:\\.|[^"])*"/, tokenType: TOKENS.INCLUDE }
];
const primitives = [
  { regex: /^\s+/, tokenType: TOKENS.WHITESPACE },
  { regex: /[\r\n]+/, tokenType: TOKENS.EOL },
  { regex: /^[{]/, tokenType: TOKENS.START_BRACE },
  { regex: /^[}]/, tokenType: TOKENS.END_BRACE },
  { regex: /^[};]/, tokenType: TOKENS.END_BRACE_SEMICOLON },
  { regex: /^[\[\]]/, tokenType: TOKENS.SQUARE_BRACKET },
  { regex: /;$/, tokenType: TOKENS.SEMICOLON },
  { regex: /=/, tokenType: TOKENS.EQUALS },
  { regex: /^,/, tokenType: TOKENS.COMMA },
  { regex: /,$/, tokenType: TOKENS.TRAILING_COMMA },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: TOKENS.PRIMITIVE_NUMBER },
  { regex: /true|false/, tokenType: TOKENS.PRIMITIVE_BOOLEAN },
  { regex: /"(?:\\.|[^"])*"/, tokenType: TOKENS.PRIMITIVE_STRING },
];
@Injectable({
  providedIn: 'root'
})
export class LexerService {
  /**
   * Returns {type: x, value: y} found by the 'tokens' regex
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  getTokensRegex(input: string[]) {
    const foundTokens = [];
    let index = 0;
    input.forEach(inputElement => {
      tokens.forEach(token => {
        const regexResult = token.regex.exec(inputElement);
        if (regexResult !== null) {
          const filteredRegex =  regexResult.filter(regRes => regRes !== '');
          const newToken = new FoundToken(token.tokenType, filteredRegex[0], index);
          foundTokens.push(newToken);
        }
      });
      index++;
    });
    return foundTokens;
  }

  /**
   * Asynchronously outputs tokens found by the token regex to the console
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getTokensToConsoleRegex(input: string[]): Promise<void> {
    let index = 0;
    input.forEach(inputElement => {
      tokens.forEach(token => {
        const regexResult = token.regex.exec(inputElement);
        if (regexResult !== null) {
          regexResult.forEach(result => {
            if (result !== '') {
              console.log('Found: ' + token.tokenType + ' Matching: ' + result.toString() + ' Index: ' + index);
            }
          });
        }
      });
      index++;
    });
  }

  /**
   * Returns {type: x, value: y} found by the 'primitives' regex
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  getPrimitivesRegex(input: string[]) {
    const foundPrimitives = [];
    let index = 0;
    input.forEach(inputElement => {
      primitives.forEach(primitive => {
        const regexResult = primitive.regex.exec(inputElement);
        if (regexResult !== null) {
          const filteredRegex =  regexResult.filter(regRes => regRes !== '');
          const newToken = new FoundToken(primitive.tokenType, filteredRegex[0], index);
          foundPrimitives.push(newToken);
        }
      });
      index++;
    });
    return foundPrimitives;
  }

  /**
   * Asynchronously outputs primitives found by the primitives regex to the console
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getPrimitivesToConsoleRegex(input: string[]): Promise<void> {
    let index = 0;
    input.forEach(inputElement => {
      primitives.forEach(primitive => {
        const regexResult = primitive.regex.exec(inputElement);
        if (regexResult !== null) {
          regexResult.forEach(result => {
            if (result !== '') {
              console.log('Found: ' + primitive.tokenType + ' Matching: ' + result.toString() + ' Index: ' + index);
            }
          });
        }
      });
      index++;
    });
  }

  /**
   * Checks input to see if it matches version regex
   */
  hasVersionRegex(input: string) {
    const regex = /(version\s*=\s*)(?:0|[1-9]\d*)/;
    return regex.test(input);
  }

  /**
   * Filters passed array based on a given string, returns FoundToken[]
   */
  findTokenType(passedTokens: FoundToken[], tokenToFind: TOKENS) {
    return passedTokens.filter(passToken => passToken.type === tokenToFind);
  }
}

export class FoundToken {
  type: TOKENS;
  value: string;
  index: number;
  constructor(
    _type: TOKENS,
    _value: string,
    _index: number
  ) {
    this.type = _type;
    this.value = _value;
    this.index = _index;
  }
}
