import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { AST } from '../shared/ast';
import { isNullOrUndefined } from 'util';
import { OptionsComponent } from '../options/options.component';

@Component( {
  selector: 'app-view-tree',
  templateUrl: './view-tree.component.html',
  styleUrls: [ './view-tree.component.css' ]
} )
export class ViewTreeComponent implements AfterViewInit {
  @Input() tree: AST[];

  @ViewChild( OptionsComponent ) options;
  @Input() saveLocalStorage: boolean;

  /**
   * Saves given file to passed fileName, appends .sqm if it does not have it
   * Based on:
   * https://github.com/eligrey/FileSaver.js [Online] Accessed 19th October 2018
   * https://github.com/eligrey/FileSaver.js/issues/308#issuecomment-286127364  [Online] Accessed 20th October 2018
   * https://github.com/eligrey/FileSaver.js/blob/master/README.md#supported-browsers [Online] Accessed 20th October 2018
   */
  saveFile( fileName: string ) {
    try {
      const isFileSaverSupported = !!new Blob;
      if ( !fileName.includes( '.sqm' ) ) {
        fileName += '.sqm';
      }
      FileSaver.saveAs( new Blob( this.astToStrArray( this.tree ), {
        type: 'text/plain;charset=utf-8'
      } ), fileName );
    } catch ( exception ) {
      console.log( exception );
    }
  }

  editItem( pos: number ) {
    console.log( pos );
  }

  /**
   * Converts passed AST tree to string[] for saving to file
   */
  astToStrArray( tree: AST[] ) {
    const stringTree: string[] = [];
    tree.forEach( branch => {
      let stringConcat = branch.item.value;
      branch.children.forEach( child => {
        if ( !isNullOrUndefined( child ) ) {
          stringConcat += child.item.value;
        }
      } );
      stringConcat += '\r\n';
      stringTree.push( stringConcat );
    } );
    return stringTree;
  }

  /**
   * Data sharing via ViewChild component
   * Based on:
   * https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/ [Online] Accessed 6th November 2018
   */
  ngAfterViewInit() {
    if ( !isNullOrUndefined( this.options.saveLocalStorage ) ) {
      this.saveLocalStorage = this.options.saveLocalStorage;
      if ( this.saveLocalStorage ) {
        this.saveToLocalStorage();
      } else {
        this.clearLocalStorage();
      }
    }
  }

  async saveToLocalStorage() {
    localStorage.setItem( 'sqmSave', this.astToStrArray( this.tree ).join() );
  }

  async clearLocalStorage() {
    localStorage.removeItem( 'sqmSave' );
  }
}
