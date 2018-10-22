import { Injectable } from '@angular/core';
import { FoundToken, Token } from '../shared/tokens';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  parseTokens(foundTokens: FoundToken[]) {
    foundTokens.forEach(foundToken => {
      switch (foundToken.type) {
        case Token.NUMBER : {
          console.log(Token.NUMBER);
          break;
        }
        case Token.BOOLEAN : {
          console.log(Token.BOOLEAN);
          break;
        }
        case Token.STRING : {
          console.log(Token.STRING);
          break;
        }
        case Token.ARRAY : {
          console.log(Token.ARRAY);
          break;
        }
        case Token.CLASS : {
          console.log(Token.CLASS);
          break;
        }
        case Token.INCLUDE : {
          console.log(Token.INCLUDE);
          break;
        }
        case Token.WHITESPACE : {
          console.log(Token.WHITESPACE);
          break;
        }
        case Token.EOL : {
          console.log(Token.EOL);
          break;
        }
        case Token.START_BRACE : {
          console.log(Token.START_BRACE);
          break;
        }
        case Token.END_BRACE : {
          console.log(Token.END_BRACE);
          break;
        }
        case Token.END_BRACE_SEMICOLON : {
          console.log(Token.END_BRACE_SEMICOLON);
          break;
        }
        case Token.SQUARE_BRACKET : {
          console.log(Token.SQUARE_BRACKET);
          break;
        }
        case Token.COMMA : {
          console.log(Token.CLASS);
          break;
        }
        case Token.SEMICOLON : {
          console.log(Token.SEMICOLON);
          break;
        }
        case Token.EQUALS : {
          console.log(Token.EQUALS);
          break;
        }
        case Token.TRAILING_COMMA : {
          console.log(Token.TRAILING_COMMA);
          break;
        }
        case Token.PRIMITIVE_NUMBER : {
          console.log(Token.PRIMITIVE_NUMBER);
          break;
        }
        case Token.PRIMITIVE_BOOLEAN: {
          console.log(Token.PRIMITIVE_BOOLEAN);
          break;
        }
        case Token.PRIMITIVE_STRING : {
          console.log(Token.PRIMITIVE_STRING);
          break;
        }
      }
    });
  }
}
