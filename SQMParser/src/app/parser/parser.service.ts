import { Injectable } from '@angular/core';
import { FoundToken, Token } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { AST } from '../shared/ast';

const tokensRegex = [
  { regex: /[a-zA-Z0-9]+/, tokenType: Token.STRING },
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[\s\t\n\r]+/, tokenType: Token.WHITESPACE },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /\]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /;/, tokenType: Token.SEMICOLON }
];
@Injectable( {
  providedIn: 'root'
} )
export class ParserService {

  /**
   * ASYNC
   * Main method execution function for ParserService
   */
  async execute( inputString: string ) {
    const foundTokens = < FoundToken[] > await this.getTokens( inputString.split( '\r\n' ) );
    if ( isNullOrUndefined( foundTokens ) ) {
      return undefined;
    }
    const tree = < AST[] > await this.generateAST( foundTokens );
    if ( isNullOrUndefined( tree ) ) {
      return undefined;
    }
    console.log( tree );
    return tree;
  }

  /**
   * ASYNC
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
   */
  async getTokens( fileArray: string[] ) {
    if ( isNullOrUndefined( fileArray ) ) {
      return undefined;
    }
    if ( !/(version\s*=\s*)(?:0|[1-9]\d*)/.test( fileArray[ 0 ] ) ) {
      return undefined;
    }
    const lexemes: FoundToken[] = [];
    let line = 0;
    fileArray.forEach( fileElement => {
      tokensRegex.forEach( token => {
        const regexResult = token.regex.exec( fileElement );
        if ( regexResult !== null ) {
          lexemes.push( new FoundToken( token.tokenType, regexResult[ 0 ], line, regexResult.index ) );
        }
      } );
      line++;
    } );
    return lexemes;
  }

  /**
   * ASYNC
   * Creates an abstract syntax tree base on the passed lexemes
   */
  async generateAST( foundTokens: FoundToken[] ) {
    const tree: AST[] = [];
    for ( let tokenIndex = 0; tokenIndex < foundTokens[ foundTokens.length - 1 ].line; tokenIndex++ ) {
      const tokensOnLine = foundTokens.filter( token => token.line === tokenIndex );
      if ( !isNullOrUndefined( tokensOnLine ) ) {
        const branch = new AST( undefined, [] );
        tokensOnLine.forEach( token => {
          if ( token.type !== Token.WHITESPACE ) {
            if ( !isNullOrUndefined( branch.item ) ) {
              branch.item = token;
            } else {
              branch.children.push( new AST( token, undefined ) );
            }
          }
        } );
        tree.push( branch );
      }
    }
    return tree;
  }
}
