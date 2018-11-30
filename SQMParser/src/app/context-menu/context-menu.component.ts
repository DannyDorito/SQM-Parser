import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {
  @Input() showContextMenu;
  @Input() contextMenuX;
  @Input() contextMenuY;
}
