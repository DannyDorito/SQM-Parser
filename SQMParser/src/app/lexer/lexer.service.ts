import { Injectable } from '@angular/core';
import { Token, FoundToken } from '../shared/tokens';

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

  parseTokens(foundTokens: FoundToken[], lines: number) {
    console.log('hit');
  }

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
