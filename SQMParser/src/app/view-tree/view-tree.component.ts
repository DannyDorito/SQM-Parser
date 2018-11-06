import { Component, Input } from '@angular/core';
import { AST } from '../shared/ast';

@Component({
  selector: 'app-view-tree',
  templateUrl: './view-tree.component.html',
  styleUrls: ['./view-tree.component.css']
})
export class ViewTreeComponent {
  @Input() tree: AST[];

  constructor() {}
}
