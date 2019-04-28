import { isNullOrUndefined } from 'util';

export class MissionTreeNode {
  value: string;
  nodeType: Token = Token.DEFAULT;
  child ?: MissionTreeNode;
  comment ?: string;
  hasError: boolean;

  constructor(
    _value: string,
    _comment ?: string,
    _child ?: MissionTreeNode
  ) {
    this.value = _value;
    this.child = _child;
    this.comment = _comment;
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
  }
}

export class NestedTreeNode {
  name: string;
  index: number;
  comment: string;
  hasError: boolean;
  // node does not have children
  children ?: NestedTreeNode[];

  constructor(
    _name: string,
    _index: number,
    _comment: string,
    _hasError: boolean,
    _children ?: NestedTreeNode[]
  ) {
    this.name = _name;
    this.index = _index;
    this.comment = _comment;
    this.hasError = _hasError;
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
