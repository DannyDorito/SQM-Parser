import { Injectable } from '@angular/core';
import { Token, FoundToken } from '../tokens';

const tokensRegex = [
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)(true|false);/, tokenType: Token.BOOLEAN },
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)"(?:\\.|[^"])*";/, tokenType: Token.STRING },
  { regex: /(?:\\.|[^"])+\[\]\s*=\s*\{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*"|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?,[\r\n]*|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|true,[\r\n]*|true|false,[\r\n]*|false)+([\r\n]*)(\})/, tokenType: Token.ARRAY },
  { regex: /class (?:\\.|[^"])*/, tokenType: Token.CLASS },
  // { regex: /(version\s*=\s*)(?:0|[1-9]\d*);/, tokenType: tokensEnum.VERSION },
  // { regex: /addOns\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: tokensEnum.ADDONS },
  // { regex: /addOnsAuto\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: tokensEnum.ADDONS_AUTO },
  // { regex: /#include "(?:\\.|[^"])*"/, tokenType: tokens.INCLUDE }
];
const primitivesRegex = [
  { regex: /^\s+/, tokenType: Token.WHITESPACE },
  { regex: /[\r\n]+/, tokenType: Token.EOL },
  { regex: /^[{]/, tokenType: Token.START_BRACE },
  { regex: /^[}]/, tokenType: Token.END_BRACE },
  { regex: /^[};]/, tokenType: Token.END_BRACE_SEMICOLON },
  { regex: /^[\[\]]/, tokenType: Token.SQUARE_BRACKET },
  { regex: /;$/, tokenType: Token.SEMICOLON },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /^,/, tokenType: Token.COMMA },
  { regex: /,$/, tokenType: Token.TRAILING_COMMA },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.PRIMITIVE_NUMBER },
  { regex: /true|false/, tokenType: Token.PRIMITIVE_BOOLEAN },
  { regex: /"(?:\\.|[^"])*"/, tokenType: Token.PRIMITIVE_STRING },
];
@Injectable({
  providedIn: 'root'
})
export class LexerService {
  /**
   * Returns {type: x, value: y, index: z} found by the 'tokens' regex
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  getTokens(inputFile: string[]) {
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
          break;
        }
      }
    }
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
   * Checks input to see if it matches version regex
   */
  hasVersionRegex(input: string) {
    const regex = /(version\s*=\s*)(?:0|[1-9]\d*)/;
    return regex.test(input);
  }

  /**
   * Finds enum tokens using array.filter, returns FoundToken[]
   */
  filterTokenType(passedTokens: FoundToken[], tokenToFind: Token) {
    return passedTokens.filter(passToken => passToken.type === tokenToFind);
  }

    /**
   * Finds enum tokens using array.find, returns FoundToken[]
   */
  findTokenType(passedTokens: FoundToken[], tokenToFind: Token) {
    return passedTokens.find(passToken => passToken.type === tokenToFind);
  }
}
