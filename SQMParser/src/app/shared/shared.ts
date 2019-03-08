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
      this.append(nodeToAppend, (depth - 1));
    } else {
      this.child = nodeToAppend;
    }
    return this;
  }
}

export class NestedTreeNode {
  name: string;
  extraData: string;
  parent: NestedTreeNode;
  children ?: NestedTreeNode[];

  constructor(
    _name: string,
    _extraData: string,
    _children ?: NestedTreeNode[]
  ) {
    this.name = _name;
    this.extraData = _extraData;
    this.children = _children;
  }

  /**
   * Append object to end of missionTree.innerNode
   */
  append(nodeToAppend: NestedTreeNode, depth: number) {
    if (depth > 0) {
      this.append(nodeToAppend, (depth - 1));
    } else {
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
