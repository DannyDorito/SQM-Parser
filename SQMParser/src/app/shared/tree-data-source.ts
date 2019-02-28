import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable } from 'rxjs';

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

export interface UITreeNode {
  expandable: boolean;
  name: string;
  level: number;
  comment: string;
}

export enum Token {
  DEFAULT = 'DEFAULT',
    START_BRACE = '}',
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

export class MissionTreeFlatDataSource<T, F> extends MatTreeFlatDataSource<T, F> {
  extraData: any;
  constructor(
    treeControl: FlatTreeControl<F>,
    treeFlattener: MatTreeFlattener<T, F>,
    _extraData: any,
    initialData?: T[]
  ) {
    super(treeControl, treeFlattener, initialData);
    this.extraData = _extraData;
  }
}

export class MissionTreeControl<T> extends FlatTreeControl<T> {
  extraData: any;
  constructor(
    getLevel: (dataNode: T) => number,
    isExpandable: (dataNode: T) => boolean,
    _extraData: any
  ) {
    super(getLevel, isExpandable);
    this.extraData = _extraData;
  }
}

export class MissionTreeFlattener<T, F> extends MatTreeFlattener<T, F> {
  extraData: any;

  constructor(
    transformFunction: (node: T, level: number) => F,
    getLevel: (node: F) => number,
    isExpandable: (node: F) => boolean,
    getChildren: (node: T) => Observable<T[]> | T[] | undefined | null,
    _extraData: any
  ) {
    super(transformFunction, getLevel, isExpandable, getChildren);
    this.extraData = _extraData;
  }
}
