import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable } from 'rxjs';

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
    _extraData: (node: F) => any
  ) {
    super(transformFunction, getLevel, isExpandable, getChildren);
    this.extraData = _extraData;
  }
}
