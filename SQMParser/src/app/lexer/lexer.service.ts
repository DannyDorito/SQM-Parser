import { Injectable } from '@angular/core';
import { Token, FoundToken } from '../shared/tokens';
import { isNullOrUndefined } from 'util';

const tokensRegex = [
  { regex: /[\s\t\n\r]+/, tokenType: Token.WHITESPACE },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /\]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /;/, tokenType: Token.SEMICOLON },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[a-zA-Z0-9]+/, tokenType: Token.STRING }
];
@Injectable({
  providedIn: 'root'
})
export class LexerService {
  /**
   * ASYNC
   * Returns {type: x, value: y, index: z} found by the 'tokens' regex
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getTokens(inputFile: string[]) {
    if (!isNullOrUndefined(inputFile)) {
      const lexemes: FoundToken[] = [];
      let index = 0;
      inputFile.forEach(inputElement => {
        tokensRegex.forEach(token => {
          const regexResult = token.regex.exec(inputElement);
          if (regexResult !== null) {
            lexemes.push(new FoundToken(token.tokenType, regexResult[0], index));
          }
        });
        index++;
      });
      return lexemes;
    } else {
      return null;
    }
  }

  /**
 * ASYNC
 * Trims each element of array
 * Based on:
 * https://www.textfixer.com/tutorials/javascript-line-breaks.php [Online] Accessed 17th October 2018
 */
  async parseFile(fileString: string) {
    const fileArray = fileString.split('\r\n');
    fileArray.forEach(element => {
      element = element.trim();
    });
    return fileArray;
  }

  /**
 * Filters found tokens depending on the passed line number, for iterating
 */
  getTokensOnLine(allTokens: FoundToken[], line: number) {
    if (line <= 0 || allTokens.length > line) {
      return null;
    } else {
      return allTokens.filter(tokens => tokens.index === allTokens[(allTokens.length - 1)].index);
    }
  }

/**
 * Finds enum tokens using array.filter, returns FoundToken[]
 */
  // filterTokenType(passedTokens: FoundToken[], tokenToFind: Token) {
  //   return passedTokens.filter(passToken => passToken.type === tokenToFind);
  // }

/**
 *
 */
  parseTokens(foundTokens: FoundToken[], lines: number) {
    console.log('hit');
  }
}
