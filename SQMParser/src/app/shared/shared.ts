import { isNullOrUndefined } from 'util';

export class MissionTreeNode {
  value: string;
  nodeType: Token = Token.DEFAULT;
  child: MissionTreeNode;
  comment: string;

  constructor(
    _value: string,
    _innerNode: MissionTreeNode,
    _error: string
  ) {
    this.value = _value;
    this.child = _innerNode;
    this.comment = _error;
  }

  /**
   * Append object to end of missionTree.innerNode
   */
  append(nodeToAppend: MissionTreeNode, depth: number) {
    if (depth > 0) {
      depth--;
      this.append(nodeToAppend, depth);
    } else {
      this.child = nodeToAppend;
    }
    return this;
  }
}

export class NestedTreeNode {
  name: string;
  comment: string;
  // node does not have children
  children ?: NestedTreeNode[];

  constructor(
    _name: string,
    _comment: string,
    _children ?: NestedTreeNode[]
  ) {
    this.name = _name;
    this.comment = _comment;
    this.children = _children;
  }

  /**
   * Append object to end of NestedTreeNode.?children
   */
  append(nodeToAppend: NestedTreeNode, depth: number) {
    if (depth > 0) {
      depth--;
      this.append(nodeToAppend, depth);
    } else {
      // if this does not have children, initialise it
      if (isNullOrUndefined(this.children)) {
        this.children = [];
      }
      this.children.push(nodeToAppend);
    }
    return this;
  }
}

export enum Token {
  DEFAULT = 'DEFAULT',
    START_BRACE = '{',
    END_BRACE = '}',
    START_SQUARE_BRACE = '[',
    END_SQUARE_BRACE = ']',
    SEMICOLON = ';',
    EQUALS = '=',
    COMMA = ',',
    QUOTE = '"',
    NUMBER = 'Number',
    BOOLEAN = 'Boolean',
    STRING = 'String',
    CLASS = 'Class'
}
