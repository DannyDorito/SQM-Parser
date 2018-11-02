import { Injectable } from '@angular/core';
import { FoundToken, Token } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { AST } from '../shared/ast';

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

  /**
   * ASYNC
   * Main method execution function for ParserService
   */
  async execute( inputString: string ) {
    const parsedFile = < string[] > await this.parseFile( inputString );
    const tokens = < FoundToken[] > await this.getTokens( parsedFile );
    const ast = < AST[] > await this.generateAST( tokens );
    console.log( ast );
    return ast;
  }

  /**
   * ASYNC
   * Fast string splitting
   * Based on:
   * https://blog.mgechev.com/2017/09/16/developing-simple-interpreter-transpiler-compiler-tutorial/ , Accessed 2nd November 2018
   */
  async parseFile( inputString: string ) {
    const lex = str => str.split( '\r\n' ).map( s => s.trim() ).filter( s => s.length );
    const parsedFile: string[] = lex( inputString );
    return parsedFile;
  }

  /**
   * ASYNC
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
   */
  async getTokens( parsedFile: string[] ) {
    if ( !isNullOrUndefined( parsedFile ) ) {
      if ( this.hasVersionRegex( parsedFile[ 0 ] ) ) {
        const lexemes: FoundToken[] = [];
        let line = 0;
        parsedFile.forEach( inputElement => {
          tokensRegex.forEach( token => {
            const regexResult = token.regex.exec( inputElement );
            if ( regexResult !== null ) {
              lexemes.push( new FoundToken( token.tokenType, regexResult[ 0 ], line, regexResult.index ) );
            }
          } );
          line++;
        } );
        return lexemes;
      } else {
        return undefined;
      }
    } else {
      return undefined;
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
   * ASYNC
   * Creates an abstract syntax tree base on the passed lexemes
   */
  async generateAST( foundTokens: FoundToken[] ) {
    const astArray: AST[] = [];
    for ( let tokenIndex = 0; tokenIndex < foundTokens[ foundTokens.length - 1 ].line; tokenIndex++ ) {
      const tokensOnLine = foundTokens.filter( token => token.line === tokenIndex ).reverse();
      if ( !isNullOrUndefined( tokensOnLine ) ) {
        const ast = new AST( undefined, [] );
        let count = 0;
        tokensOnLine.forEach( token => {
          if ( token.type !== Token.WHITESPACE ) {
            if ( count === 0 ) {
              ast.item = token;
            } else {
              ast.children.push( new AST( token, undefined ) );
            }
            count++;
          }
        } );
        astArray.push( ast );
      }
    }
    return astArray;
  }
}
