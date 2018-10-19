import { Injectable } from '@angular/core';

export enum tokens {
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
const tokensRegex = [
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: tokens.NUMBER },
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)(true|false);/, tokenType: tokens.BOOLEAN },
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)"(?:\\.|[^"])*";/, tokenType: tokens.STRING },
  { regex: /(?:\\.|[^"])+\[\]\s*=\s*\{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*"|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?,[\r\n]*|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|true,[\r\n]*|true|false,[\r\n]*|false)+([\r\n]*)(\})/, tokenType: tokens.ARRAY },
  { regex: /class (?:\\.|[^"])*/, tokenType: tokens.CLASS },
  // { regex: /(version\s*=\s*)(?:0|[1-9]\d*);/, tokenType: tokensEnum.VERSION },
  // { regex: /addOns\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: tokensEnum.ADDONS },
  // { regex: /addOnsAuto\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: tokensEnum.ADDONS_AUTO },
  { regex: /#include "(?:\\.|[^"])*"/, tokenType: tokens.INCLUDE }
];
const primitivesRegex = [
  { regex: /^\s+/, tokenType: tokens.WHITESPACE },
  { regex: /[\r\n]+/, tokenType: tokens.EOL },
  { regex: /^[{]/, tokenType: tokens.START_BRACE },
  { regex: /^[}]/, tokenType: tokens.END_BRACE },
  { regex: /^[};]/, tokenType: tokens.END_BRACE_SEMICOLON },
  { regex: /^[\[\]]/, tokenType: tokens.SQUARE_BRACKET },
  { regex: /;$/, tokenType: tokens.SEMICOLON },
  { regex: /=/, tokenType: tokens.EQUALS },
  { regex: /^,/, tokenType: tokens.COMMA },
  { regex: /,$/, tokenType: tokens.TRAILING_COMMA },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: tokens.PRIMITIVE_NUMBER },
  { regex: /true|false/, tokenType: tokens.PRIMITIVE_BOOLEAN },
  { regex: /"(?:\\.|[^"])*"/, tokenType: tokens.PRIMITIVE_STRING },
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
  getTokensRegex(inputFile: string[]) {
    const lexemes: FoundToken[] = [];
    let index = 0;
    inputFile.forEach(inputElement => {
      tokensRegex.forEach(token => {
        const regexResult = token.regex.exec(inputElement);
        if (regexResult !== null) {
          const newToken = new FoundToken(token.tokenType, regexResult[0], index);
          lexemes.push(newToken);
        }
      });
      index++;
    });
    return lexemes;
  }

  getTokensFor(inputFile: string[]) {
    const lexemes: FoundToken[] = [];
    for (let inputIndex = 0; inputIndex < inputFile.length; inputIndex++) {
      for (let tokensIndex = 0; tokensIndex < tokensRegex.length; tokensIndex++) {
        const regexResult = tokensRegex[tokensIndex].regex.exec(inputFile[inputIndex]);
        if (regexResult !== null) {
          const newToken = new FoundToken(tokensRegex[tokensIndex].tokenType, regexResult[0], inputIndex);
          lexemes.push(newToken);
        }
      }
    }
  }

  /**
   * Asynchronously outputs tokens found by the token regex to the console
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getTokensToConsoleRegex(inputFile: string[]) {
    let index = 0;
    inputFile.forEach(inputElement => {
      tokensRegex.forEach(token => {
        const regexResult = token.regex.exec(inputElement);
        if (regexResult !== null) {
          console.log('Found: ' + token.tokenType + ' Matching: ' + regexResult[0] + ' Index: ' + index);
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
  getPrimitivesRegex(inputFile: string[]) {
    const lexemes = [];
    let index = 0;
    inputFile.forEach(inputElement => {
      primitivesRegex.forEach(primitive => {
        const regexResult = primitive.regex.exec(inputElement);
        if (regexResult !== null) {
          const newToken = new FoundToken(primitive.tokenType, regexResult[0], index);
          lexemes.push(newToken);
        }
      });
      index++;
    });
    return lexemes;
  }

  /**
   * Asynchronously outputs primitives found by the primitives regex to the console
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getPrimitivesToConsoleRegex(input: string[]) {
    let index = 0;
    input.forEach(inputElement => {
      primitivesRegex.forEach(primitive => {
        const regexResult = primitive.regex.exec(inputElement);
        if (regexResult !== null) {
          console.log('Found: ' + primitive.tokenType + ' Matching: ' + regexResult[0] + ' Index: ' + index);
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
   * Finds enum tokens using array.filter, returns FoundToken[]
   */
  filterTokenType(passedTokens: FoundToken[], tokenToFind: tokens) {
    return passedTokens.filter(passToken => passToken.type === tokenToFind);
  }

    /**
   * Finds enum tokens using array.find, returns FoundToken[]
   */
  findTokenType(passedTokens: FoundToken[], tokenToFind: tokens) {
    return passedTokens.find(passToken => passToken.type === tokenToFind);
  }
}

export class FoundToken {
  type: tokens;
  value: string;
  index: number;
  constructor(
    _type: tokens,
    _value: string,
    _index: number
  ) {
    this.type = _type;
    this.value = _value;
    this.index = _index;
  }
}
