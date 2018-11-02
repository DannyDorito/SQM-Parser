import { Injectable } from '@angular/core';
import { FoundToken, Token } from '../shared/tokens';
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

@Injectable( {
  providedIn: 'root'
} )
export class ParserService {

  async executeLexer( inputString: string ) {
    const parsedFile = this.parseFile( inputString );
    const a = this.getTokens( parsedFile );
    console.log( parsedFile );
  }

  /**
 * ASYNC
 * Based on:
 * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
 */
  async getTokens( parsedFile: string[] ) {
    if ( !isNullOrUndefined( parsedFile ) ) {
      const lexemes: FoundToken[] = [];
      let line = 0;
      parsedFile.forEach( inputElement => {
        tokensRegex.forEach( token => {
          const regexResult = token.regex.exec( inputElement );
          if ( regexResult !== null ) {
            lexemes.push( new FoundToken( token.tokenType, regexResult[ 0 ], line, regexResult.index  ) );
          }
        } );
        line++;
      } );
      return lexemes;
    } else {
      return undefined;
    }
  }

  /**
   * Based on:
   * https://blog.mgechev.com/2017/09/16/developing-simple-interpreter-transpiler-compiler-tutorial/ , Accessed 2nd November 2018
   */
  parseFile( inputString: string ) {
    const lex = str => str.split( '\r\n' ).map( s => s.trim() ).filter( s => s.length );
    const parsedFile: string[] = lex( inputString );
    return parsedFile;
  }

  /**
   * Checks input to see if it matches version regex
   */
  hasVersionRegex( input: string ) {
    const regex = /(version\s*=\s*)(?:0|[1-9]\d*)/;
    return regex.test( input );
  }
}
