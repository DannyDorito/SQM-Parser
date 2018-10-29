import { Injectable } from '@angular/core';
import { FoundToken, Token } from '../shared/tokens';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  getTokensOnLine(allTokens: FoundToken[], line: number) {
    console.log((line + 'line'));
    if (line <= 0 || allTokens.length > line) {
      return null;
    } else {
      return allTokens.filter(tokens => tokens.index === allTokens[(allTokens.length - 1)].index);
    }
  }

  parseTokens(foundTokens: FoundToken[], lines: number) {
    const a = Token.NAME.toString() + Token.WHITESPACE.toString() + Token.EQUALS.toString() + Token.WHITESPACE.toString() + Token.PRIMITIVE_STRING.toString() + Token.SEMICOLON.toString();
    console.log(a);
    for (let lineIndex = 0; lineIndex < lines; lineIndex++) {
      const tokensOnLine = this.getTokensOnLine(foundTokens, lineIndex);
      console.log(tokensOnLine);
      let b;
      tokensOnLine.forEach(tokens => {
        b += tokens.type.toString();
      });
      if (b === a) {
        console.log('found string');
      }
    }
  }

  parseTokensSwitch(foundTokens: FoundToken[]) {
    foundTokens.forEach(foundToken => {
      switch (foundToken.type) {
        case Token.NUMBER : {
          console.log('Token.NUMBER');
          break;
        }
        case Token.BOOLEAN : {
          console.log('Token.BOOLEAN');
          break;
        }
        case Token.STRING : {
          console.log('Token.STRING');
          break;
        }
        case Token.ARRAY : {
          console.log('Token.ARRAY');
          break;
        }
        case Token.CLASS : {
          console.log('Token.CLASS');
          break;
        }
        case Token.INCLUDE : {
          console.log('Token.INCLUDE');
          break;
        }
        case Token.WHITESPACE : {
          console.log('Token.WHITESPACE');
          break; // do nothing
        }
        case Token.EOL : {
          console.log('Token.EOL');
          break; // do nothing
        }
        case Token.START_BRACE : {
          console.log('Token.START_BRACE');
          break;
        }
        case Token.END_BRACE : {
          console.log('Token.END_BRACE');
          break;
        }
        case Token.START_SQUARE_BRACE : {
          console.log('Token.START_SQUARE_BRACE');
          break;
        }
        case Token.END_SQUARE_BRACE : {
          console.log('Token.END_SQUARE_BRACE');
          break;
        }
        case Token.COMMA : {
          console.log('Token.CLASS');
          break;
        }
        case Token.SEMICOLON : {
          console.log('Token.SEMICOLON');
          break;
        }
        case Token.EQUALS : {
          console.log('Token.EQUALS');
          break;
        }
        case Token.TRAILING_COMMA : {
          console.log('Token.TRAILING_COMMA');
          break;
        }
        case Token.PRIMITIVE_NUMBER : {
          console.log('Token.PRIMITIVE_NUMBER');
          break;
        }
        case Token.PRIMITIVE_BOOLEAN: {
          console.log('Token.PRIMITIVE_BOOLEAN');
          break;
        }
        case Token.PRIMITIVE_STRING : {
          console.log('Token.PRIMITIVE_STRING');
          break;
        }
      }
    });
  }
}
