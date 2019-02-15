import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children ?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [{
  name: 'Fruit',
  children: [{
      name: 'Apple'
    },
    {
      name: 'Banana'
    },
    {
      name: 'Fruit loops'
    },
  ]
}, {
  name: 'Vegetables',
  children: [{
    name: 'Green',
    children: [{
        name: 'Broccoli'
      },
      {
        name: 'sprouts'
      },
    ]
  }, {
    name: 'Orange',
    children: [{
        name: 'Pumpkins'
      },
      {
        name: 'Carrots'
      },
    ]
  }, ]
}, ];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-tree',
  templateUrl: 'tree.html',
  styleUrls: ['tree.css'],
})
export class TreeComponent {
  transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }
  constructor() {
    this.dataSource.data = TREE_DATA;
  }
// tslint:disable-next-line: member-ordering
  treeControl = new FlatTreeControl<ExampleFlatNode> (
    node => node.level, node => node.expandable
  );

// tslint:disable-next-line: member-ordering
  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children
  );

// tslint:disable-next-line: member-ordering
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
