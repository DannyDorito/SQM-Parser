import { Component } from '@angular/core';
import { ViewTreeComponent } from '../view-tree/view-tree.component';

@Component( {
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: [ './functions.component.css' ]
} )
export class FunctionsComponent {

  constructor( private viewTreeComponent: ViewTreeComponent ) {}

  saveSQM() {
    this.viewTreeComponent.saveSQM();
  }

  saveFile() {
    this.viewTreeComponent.saveFile( 'test.sqm' );
  }
}
