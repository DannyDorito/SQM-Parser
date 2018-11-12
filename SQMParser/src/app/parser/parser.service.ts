import { Injectable } from '@angular/core';
import { Token, Grammar } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { ASTMission, ASTVersion, ASTVariable, ASTArray, ASTClass, ASTData } from '../shared/ast';

const tokensRegex = [
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[ \s\t\n\r]+/, tokenType: Token.WHITESPACE },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /^(?!class)([a-zA-Z]+)/, tokenType: Token.STRING },
  { regex: /class/, tokenType: Token.CLASS },
  { regex: /;/, tokenType: Token.SEMICOLON }
];
@Injectable({
  providedIn: 'root'
})
export class ParserService {
  /**
   * Main method execution function for ParserService
   */
  generateAST(inputArray: string[]) {
    if (isNullOrUndefined(inputArray)) {
      throw new Error('ERROR: File is empty!');
    }
    const ast = new ASTMission(undefined, []);
    let depth = 0;
    for (let inputIndex = 0; inputIndex < inputArray.length; inputIndex++) {
      if (inputIndex === 0) {
        if (this.evalVersion(inputArray[0])) {
          ast.version = new ASTVersion(/[1-9]+/.exec(inputArray[0])[0]);
        } else {
          throw new Error('ERROR: Cannot find version number on first line of file!');
        }
      } else {
        let tokensOnLine = '';
        // const inputSplit = inputArray[ inputIndex ];
        const inputSplit = inputArray[inputIndex].split(' ');
        for (let inputSplitIndex = 0; inputSplitIndex < inputSplit.length; inputSplitIndex++) {
          for (const tokenRegex of tokensRegex) {
            const regexResult = tokenRegex.regex.exec(inputSplit[inputSplitIndex]);
            if (!isNullOrUndefined(regexResult)) {
              if (tokenRegex.tokenType !== Token.WHITESPACE) {
                tokensOnLine += tokenRegex.tokenType.toString();
                break;
              }
            }
          }
        }
        // while ( inputArray[ inputIndex ] !== '') {
        //   console.log( inputArray[ inputIndex ] );
        //   for ( const tokenRegex of tokensRegex ) {
        //     const regexResult = tokenRegex.regex.exec( inputArray[ inputIndex ]);
        //     if ( regexResult !== null) {
        //       tokensOnLine += tokenRegex.tokenType.toString();
        //       inputArray[ inputIndex ] = this.removeOccurrence(inputArray[ inputIndex ], regexResult[0]);
        //       break;
        //     }
        //   }
        // }
        if (tokensOnLine === Grammar.STRING.toString()) {
          // console.log( 'FOUND: STRING' );
          ast.append(new ASTVariable(inputSplit[0], inputSplit[3]), depth);

        } else if (tokensOnLine === Grammar.BOOLEAN.toString()) {
          // console.log( 'FOUND: BOOLEAN' );
          ast.append(new ASTVariable(inputSplit[0], Boolean(inputSplit[2])), depth);

        } else if (tokensOnLine === Grammar.NUMBER.toString()) {
          // console.log( 'FOUND: NUMBER' );
          ast.append(new ASTVariable(inputSplit[0], Number(inputSplit[2])), depth);

        } else if (tokensOnLine === Grammar.ARRAY.toString()) {
          // console.log( 'FOUND: ARRAY' );
          ast.append(new ASTArray(inputSplit[0], new ASTVariable(undefined, undefined)), depth); // TODO: contents of array
          depth++;

        } else if (tokensOnLine === Grammar.CLASS.toString()) {
          // console.log( 'FOUND: CLASS' );
          ast.append(new ASTClass(undefined, undefined), depth);
          depth++;

        } else if (tokensOnLine === Grammar.CLASS_WITH_NAME.toString()) {
          // console.log( 'FOUND: CLASS_WITH_NAME' );
          ast.append(new ASTClass(inputSplit[1], undefined), depth);

        } else if (tokensOnLine === Grammar.START.toString()) {

        } else if (tokensOnLine === Grammar.END.toString()) {
          if (depth !== 0) {
            depth--;
          }
        }
        // else {
        //   console.log( 'ERROR: FOUND ' + tokensOnLine + ' ' + ( inputIndex + 1 ) );

        // }
      }
    }
    return ast;
  }

  /**
   * Determins if the passed string matches the "version", "=", int, ";"; regex
   */
  evalVersion(line: string) {
    return /(version\s*=\s*)[0-99]+\s*;/.test(line);
  }

  /**
   * Removes first occurrence of a string from a given string
   * Based on:
   * https://www.w3resource.com/javascript-exercises/javascript-string-exercise-26.php [Online] Accessed 12th November 2018
   */
  removeOccurrence(str: string, stringToFind: string) {
    const strIndex = str.indexOf(stringToFind);
    // if there is no occurrences
    if (strIndex === -1) {
      return str;
    }
    return str.slice(0, strIndex) + str.slice(strIndex + stringToFind.length);
  }
}
