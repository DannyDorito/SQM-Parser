import { Injectable } from '@angular/core';
import { MissionTreeNode, NestedTreeNode, Token } from '../shared/shared';

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
      if (grammar.value !== null) {
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
    return node;
  }

  /**
   * Remove the index of a node from the passed mission tree, then returns the new tree
   */
  removeNode(indexToRemove: number, missionTree: MissionTreeNode[]) {
    missionTree.splice(indexToRemove, 1);
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
    if (index > 0) {
      startIndex = index - 1;
    }
    this.findErrors(missionTree, startIndex, index);
    return missionTree;
  }

  /**
   * Edit comment of nth node from tree
   */
  editComment(nodeIndex: number, missionTree: MissionTreeNode[], inputString: string) {
    let index = 0;
    let missionTreeIndex = 0;
    let currentNode = missionTree[missionTreeIndex];
    while (index !== 0) {
      if ((missionTreeIndex + 1) < missionTree.length) {
        const nextNode = this.getNextNode(currentNode, missionTree[missionTreeIndex + 1]);
        currentNode = nextNode.node;
        missionTreeIndex = nextNode.index;
      } else {
        currentNode = this.getNextNodeUndef(currentNode);
      }
      index++;
    }
    currentNode.comment = inputString;
  }

  /**
   * Traverse a passed tree, return a string of the value of each node traversed
   * Compilers: Principles, Techniques, and Tools (2nd Edition) pp.56-68. Accessed 21st November 2018
   */
  traverseNodeToString(nodeToTraverse: MissionTreeNode) {
    if (nodeToTraverse === null) {
      return undefined;
    }
    let str = '';
    const traverse = (node: MissionTreeNode) => {
      if (node === null) {
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
      const first = missionTree[startIndex].nodeType;
      const second = this.getNextNode(missionTree[startIndex], missionTree[(startIndex + 1)], startIndex).node.nodeType;
      const last = this.getFinalNode(missionTree[startIndex]).nodeType;
      let previous: Token;
      if (startIndex !== 0) {
        previous = this.getFinalNode(missionTree[(startIndex - 1)]).nodeType;
      }
      if (first !== Token.CLASS) {
        if (last !== Token.START_BRACE && last !== Token.COMMA) {
          if (previous !== Token.COMMA && previous !== Token.START_BRACE) {
            if (last !== Token.SEMICOLON && second !== Token.START_SQUARE_BRACE) {
              if (missionTree[startIndex].comment !== null) {
                missionTree[startIndex].comment += 'ERROR: Cannot Find: "' + Token.SEMICOLON.toString() + '"\r\n';
                missionTree[startIndex].hasError = true;
              } else {
                missionTree[startIndex].comment = 'ERROR: Cannot Find: "' + Token.SEMICOLON.toString() + '"\r\n';
                missionTree[startIndex].hasError = true;
              }
              errorCount++;
            }
          }
        }
      } else if (first === Token.CLASS) {
        if (missionTree[(startIndex + 1)] !== null) {
          if (missionTree[(startIndex + 1)].nodeType !== Token.START_BRACE) {
            if (missionTree[startIndex].comment !== null) {
              missionTree[startIndex].comment += 'ERROR: Cannot Find: "' + Token.START_BRACE.toString() + '"\r\n';
              missionTree[startIndex].hasError = true;
            } else {
              missionTree[startIndex].comment = 'ERROR: Cannot Find: "' + Token.START_BRACE.toString() + '"\r\n';
              missionTree[startIndex].hasError = true;
            }
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
      if (node.comment !== null) {
        if (node.comment.includes(Token.SEMICOLON.toString())) {
          const finalSemiColonNode = this.getFinalNode(node);
          finalSemiColonNode.child = new MissionTreeNode(Token.SEMICOLON.toString());
          node.hasError = false;
          node.comment = undefined;
        } else if (node.comment.includes(Token.START_BRACE.toString())) {
          const finalStart_BraceNode = this.getFinalNode(node);
          finalStart_BraceNode.child = new MissionTreeNode(Token.START_BRACE.toString());
          node.hasError = false;
          node.comment = undefined;
        }
      }
    });
    return missionTree;
  }

  /**
   * Get the last child node in the passed MissionTreeNode
   */
  getFinalNode(node: MissionTreeNode) {
    if (node === null) {
      return undefined;
    }
    let returnNode = node;
    while (returnNode.child !== null) {
      returnNode = returnNode.child;
    }
    return returnNode;
  }

  /**
   * Get the child node of the passed MissionTreeNode or the next in the array index + 1
   */
  getNextNode(node: MissionTreeNode, nextNode: MissionTreeNode, index ?: number) {
    if (node === null) {
      return {
        node: nextNode,
        index: index
      };
    } else {
      if (node.child !== null) {
        return {
          node: node.child,
          index: index
        };
      } else {
        if (index !== null) {
          index++;
        }
        return {
          node: nextNode,
          index: index
        };
      }
    }
  }

  /**
   * Get the child node of the passed MissionTreeNode or undefined
   */
  getNextNodeUndef(node: MissionTreeNode) {
    if (node === null) {
      return undefined;
    } else {
      if (node.child !== null) {
        return node.child;
      } else {
        return undefined;
      }
    }
  }

  /**
   * passed missionTreeNode[] is converted to nestedTreeNode[] for the ui
   */
  missionTreeToNestedTree(missionTree: MissionTreeNode[]) {
    if (missionTree === null) {
      return [];
    }
    const nestedTree: NestedTreeNode[] = [];
    let indent = 0;

    missionTree.forEach((node, index) => {
      if (node.nodeType === Token.END_BRACE) {
        if (indent > 0) {
          indent--;
        }
      }

      if (indent > 0) {
        nestedTree[(nestedTree.length - 1)].append(new NestedTreeNode(this.traverseNodeToString(node), index, node.comment, node.hasError), indent);
      } else {
        nestedTree.push(new NestedTreeNode(this.traverseNodeToString(node), index, node.comment, node.hasError));
      }

      if (node.nodeType === Token.START_BRACE) {
        indent++;
      }
    });
    return nestedTree;
  }

  /**
   * Produces tokens to lexically analyse
   * Split the input string on terminals [ \s\t\n\r\[\]"={},;] globally with a positive lookahead
   * which preserves the found character,
   * then map the results by trimming and filterting by length to a string array and returns it
   */
  splitString(inputString: string) {
    return inputString.split(/(?=[ \s\t\n\r\[\]"={},;]+)/g).map(str => str.trim()).filter(str => str.length);
  }
}
