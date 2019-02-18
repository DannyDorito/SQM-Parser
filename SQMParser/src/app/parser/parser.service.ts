import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Token, MissionTreeNode } from '../shared/shared';

const tokensRegex = [
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /[\+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][\+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /[a-zA-Z]+/, tokenType: Token.STRING },
  { regex: /;/, tokenType: Token.SEMICOLON }
];
@Injectable({
  providedIn: 'root'
})
export class ParserService {
  /**
   * Main method execution function for ParserService
   */
  generateTree(inputFile: string[]) {
    const missionTree: MissionTreeNode[] = [];
    for (const inputString of inputFile) {
      const grammar = this.parser(inputString);
      if (!isNullOrUndefined(grammar.value)) {
        missionTree.push(grammar);
      }
    }
    return missionTree;
  }

  /**
   * Splits the input string into an array, tests Lexeme regex against it
   * if successful, set the type
   * Compilers: Principles, Techniques, and Tools (2nd Edition) pp.79-80. Accessed 21st November 2018
   */
  parser(inputString: string) {
    const lexemes = this.splitString(inputString);
    let index = 0;
    const containingTypes: Token[] = [];
    const parseType = () => {
      const newNode = new MissionTreeNode(lexemes[index], undefined, undefined);
      for (const tokenRegex of tokensRegex) {
        if (tokenRegex.regex.test(lexemes[index])) {
          if (lexemes[index] === 'class') {
            newNode.value += ' ';
            newNode.nodeType = Token.CLASS;
          } else {
            newNode.nodeType = tokenRegex.tokenType;
          }
          containingTypes.push(newNode.nodeType);
          break;
        }
      }
      index++;
      while (lexemes[index]) {
        newNode.child = parseType();
      }
      return newNode;
    };
    const node = parseType();
    node.containingTypes = containingTypes;
    return node;
  }

  /**
   * Remove the index of a node from the passed mission tree, then returns the new tree
   */
  removeNode(index: number, missionTree: MissionTreeNode[]) {
    return missionTree.slice(index, (index + 1));
  }

  /**
   * Adds the index of a node from the passed mission tree, then returns the new tree
   */
  addNode(index: number, missionTree: MissionTreeNode[], nodeToAdd: MissionTreeNode) {
    if (index === 0) {
      missionTree.unshift(nodeToAdd);
    } else if (index === (missionTree.length - 1)) {
      missionTree.push(nodeToAdd);
    } else {
      missionTree.splice(index, 0, nodeToAdd);
    }
    return missionTree;
  }

  /**
   * Parses the new input string for a given index, adds the new node to the tree, then returns the new tree
   */
  parseAndAddNode(index: number, missionTree: MissionTreeNode[], inputString: string) {
    const nodeToAdd = this.parser(inputString);
    missionTree = this.addNode(index, missionTree, nodeToAdd);
    return missionTree;
  }

  /**
   * Parses the new input string for a given index, edits the node at the index in the tree, then returns the new tree
   */
  parseAndEditNode(index: number, missionTree: MissionTreeNode[], inputString: string) {
    missionTree[index] = this.parser(inputString);
    let startIndex = index;
    if (index >= 0) {
      startIndex = index - 1;
    }
    this.findErrors(missionTree, startIndex, index);
    return missionTree;
  }

  /**
   * Traverse a passed tree, return a string of the value of each node traversed
   * Compilers: Principles, Techniques, and Tools (2nd Edition) pp.56-68. Accessed 21st November 2018
   */
  traverseNodeValue(nodeToTraverse: MissionTreeNode) {
    if (isNullOrUndefined(nodeToTraverse)) {
      return '';
    }
    let str = '';
    const traverse = (node: MissionTreeNode) => {
      if (node) {
        str += node.value;
        traverse(node.child);
      }
    };
    traverse(nodeToTraverse);
    return str;
  }

  /**
   * Find missing semicolons and braces in a given missionTree
   * missionTree is passed by reference so error count is returned
   */
  findErrors(missionTree: MissionTreeNode[], startIndex: number, endIndex: number) {
    let errorCount = 0;
    for (startIndex; startIndex < endIndex; startIndex++) {
      const first = missionTree[startIndex].containingTypes[0];
      const last = missionTree[startIndex].containingTypes[(missionTree[startIndex].containingTypes.length - 1)];
      let previous;
      if (startIndex !== 0) {
        previous = missionTree[(startIndex - 1)].containingTypes[(missionTree[(startIndex - 1)].containingTypes.length - 1)];
      }
      if (first !== Token.CLASS) {
        if (last !== Token.START_BRACE && last !== Token.COMMA) {
          if (previous !== Token.COMMA && previous !== Token.START_BRACE) {
            if (last !== Token.SEMICOLON && missionTree[startIndex].containingTypes[1] !== Token.START_SQUARE_BRACE) {
              missionTree[startIndex].error = Token.SEMICOLON;
              errorCount++;
            }
          }
        }
      } else if (first === Token.CLASS) {
        if (!isNullOrUndefined(missionTree[(startIndex + 1)])) {
          if (missionTree[(startIndex + 1)].containingTypes[0] !== Token.START_BRACE) {
            missionTree[startIndex].error = Token.START_BRACE;
            errorCount++;
          }
        }
      }
    }
    return errorCount;
  }

  /**
   * Fix found errors in the passed missionTree
   */
  fixErrors(missionTree: MissionTreeNode[]) {
    missionTree.forEach((node) => {
      if (!isNullOrUndefined(node.error)) {
        switch (node.error) {
          case (Token.SEMICOLON):
            const finalSemiColonNode = this.getFinalNode(node);
            finalSemiColonNode.child = new MissionTreeNode(';', undefined, undefined);
            node.error = undefined;
            break;
          case (Token.START_BRACE):
            const finalStart_BraceNode = this.getFinalNode(node);
            finalStart_BraceNode.child = new MissionTreeNode(';', undefined, undefined);
            node.error = undefined;
            break;
          default:
            break;
        }
      }
    });
    return missionTree;
  }

  /**
   * Get the last child node in the passed MissionTreeNode
   */
  getFinalNode(node: MissionTreeNode) {
    let returnNode = node;
    while (!isNullOrUndefined(returnNode.child)) {
      returnNode = returnNode.child;
    }
    return returnNode;
  }

  /**
   * Get the child node of the passed MissionTreeNode or the next in the array index + 1
   */
  getNextNode(node: MissionTreeNode, nextNode: MissionTreeNode, index: number) {
    if (isNullOrUndefined(node)) {
      index++;
      return {node: nextNode, index: index};
    } else {
      if (!isNullOrUndefined(node.child)) {
        return {node: node.child, index: index};
      } else {
        index++;
        return {node: nextNode, index: index};
      }
    }
  }

  /**
   * Produces tokens to lexically analyse
   * Split the input string on terminals [ \s\t\n\r\[\]"={},;] globally with a positive lookahead
   * which preserves the found character,
   * then map the results by trimming and filterting by length to a string array and returns it
   */
  splitString(inputString: string) {
    return inputString.split(/(?=[ \s\t\n\r\[\]\"\=\{\}\,\;]+)/g).map(str => str.trim()).filter(str => str.length);
  }
}
