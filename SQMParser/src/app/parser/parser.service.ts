import { Injectable } from '@angular/core';
import { FoundToken, Token, Grammar } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { AST } from '../shared/ast';

const tokensRegex = [
  { regex: /[a-zA-Z]+([a-zA-Z0-9_:-])*/, tokenType: Token.STRING },
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[\s\t\n\r]+/, tokenType: Token.WHITESPACE },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /\]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /,/, tokenType: Token.COMMA },
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
    const tree = < AST[] > await this.generateAST( inputString.split( '\r\n' ) );
    const grammars = this.findGrammars( tree );
    return tree;
  }

  /**
   * ASYNC
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
   */
  getTokensLine( line: string, lineIndex: number ) {
    if ( isNullOrUndefined( line ) ) {
      return undefined;
    }
    const foundTokens: FoundToken[] = [];
    tokensRegex.forEach( token => {
      const regexResult = token.regex.exec( line );
      if ( regexResult !== null ) {
        if ( token.tokenType !== Token.WHITESPACE) {
          console.log( regexResult[ 0 ] );
          foundTokens.push( new FoundToken( token.tokenType, regexResult[ 0 ], lineIndex, regexResult.index ) );
        }
      }
    } );
    return foundTokens;
  }

  /**
   * ASYNC
   * Creates an abstract syntax tree via token parsing
   */
  async generateAST( fileArray: string[] ) {
    let lineIndex = 0;
    const tree: AST[] = [];
    fileArray.forEach( line => {
      const foundTokens = this.getTokensLine( line, lineIndex );
      const branch = new AST( undefined, [] );
      for ( let tokenIndex = 0; tokenIndex < foundTokens.length; tokenIndex++ ) {
        if ( foundTokens.length > 0 && !isNullOrUndefined( foundTokens ) ) {
          if ( tokenIndex === 0 ) {
            branch.item = foundTokens[ tokenIndex ];
          } else {
            branch.children.push( new AST( foundTokens[ tokenIndex ], undefined ) );
          }
        }
      }
      if ( branch.item !== undefined ) {
        tree.push( branch );
      }
      lineIndex++;
    } );
    return tree;
  }

  /**
   * ASYNC
   * Find matching grammars in the passed AST tree
   */
  async findGrammars( tree: AST[] ) {
    tree.forEach( branch => {
      let grammarString = branch.item.type.toString();
      branch.children.forEach( child => {
        grammarString += child.item.type.toString();
      } );

      switch ( grammarString ) {
        case Grammar.STRING.toString():
          // console.log( 'found STRING' );
          break;

        case Grammar.BOOLEAN.toString():
          // console.log( 'found BOOLEAN' );
          break;

        case Grammar.NUMBER.toString():
          // console.log( 'found NUMBER' );
          break;

        case Grammar.ARRAY.toString():
          // console.log( 'found ARRAY' );
          break;

        case Grammar.CLASS.toString():
          // console.log( 'found CLASS' );
          break;

        case Grammar.END.toString():
          // console.log( 'found END' );
          break;
        case Grammar.START.toString():
          // console.log( 'found START' );
          break;

        default:
          console.log( 'cannot match: ' + grammarString );
          break;
      }
    } );
  }
}
