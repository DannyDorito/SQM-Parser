import { Injectable } from '@angular/core';
import { Token, FoundToken } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { FileTree } from '../shared/file-tree';

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
export class LexerService {
  /**
   * ASYNC
   * Returns {type: x, value: y, index: z} found by the 'tokens' regex
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
   */
  async getTokensOLD( inputFile: string[] ) {
    if ( !isNullOrUndefined( inputFile ) ) {
      const lexemes: FoundToken[] = [];
      let index = 0;
      inputFile.forEach( inputElement => {
        tokensRegex.forEach( token => {
          const regexResult = token.regex.exec( inputElement );
          if ( regexResult !== null ) {
            lexemes.push( new FoundToken( token.tokenType, regexResult[ 0 ], index ) );
          }
        } );
        index++;
      } );
      return lexemes;
    } else {
      return undefined;
    }
  }

  /**
   * ASYNC
   * Finds the lexemes from an input string, returns FileTree[]
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
   */
  async getTokens( inputString: string ) {
    if ( !isNullOrUndefined( inputString ) && inputString !== '' ) {
      const parsedFile = < string[] > await this.parseFile( inputString );
      const fileTree: FileTree[] = [];
      let line = 0;
      if ( this.hasVersionRegex( parsedFile[ 0 ] ) ) {
        parsedFile.forEach( parsedFileElement => {
          const lexemes: FoundToken[] = [];
          tokensRegex.forEach( token => {
            const regexResult = token.regex.exec( parsedFileElement );
            if ( !isNullOrUndefined( regexResult ) ) {
              lexemes.push( new FoundToken( token.tokenType, regexResult[ 0 ], line ) );
            }
          } );
          fileTree.push( new FileTree( parsedFileElement, line, lexemes ) );
          line++;
        } );
        return fileTree;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  /**
   * ASYNC
   * Trims each element of array
   * Based on:
   * https://www.textfixer.com/tutorials/javascript-line-breaks.php [Online] Accessed 17th October 2018
   */
  async parseFile( inputString: string ) {
    const fileArray = inputString.split( '\r\n' );
    fileArray.forEach( element => {
      element = element.trim();
    } );
    return fileArray;
  }

  /**
   * ASYNC
   * Filters found tokens depending on the passed line number, for iterating
   */
  async getTokensOnLine( allTokens: FoundToken[], line: number ) {
    if ( line <= 0 || allTokens.length > line ) {
      return null;
    } else {
      return allTokens.filter( tokens => tokens.index === allTokens[ ( allTokens.length - 1 ) ].index );
    }
  }

  /**
   * Checks input to see if it matches version regex
   */
  hasVersionRegex( input: string ) {
    const regex = /(version\s*=\s*)(?:0|[1-9]\d*)/;
    return regex.test( input );
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
  parseTokens( foundTokens: FoundToken[], lines: number ) {
    console.log( 'hit' );
  }
}
