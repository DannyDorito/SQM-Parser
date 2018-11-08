import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { AST } from '../shared/ast';
import { isNullOrUndefined } from 'util';
import { OptionsComponent } from '../options/options.component';
import { timer } from 'rxjs';

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
   * ASYNC
   * Saves given file to passed fileName, appends .sqm if it does not have it
   * Based on:
   * https://github.com/eligrey/FileSaver.js [Online] Accessed 19th October 2018
   * https://github.com/eligrey/FileSaver.js/issues/308#issuecomment-286127364  [Online] Accessed 20th October 2018
   * https://github.com/eligrey/FileSaver.js/blob/master/README.md#supported-browsers [Online] Accessed 20th October 2018
   */
  async saveFile( fileName: string ) {
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
    if ( isNullOrUndefined( tree ) ) {
      return undefined;
    }
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
    if ( !isNullOrUndefined( localStorage.getItem( 'sqmSaveLocalStorage' ) ) ) {
      this.saveLocalStorage = Boolean( localStorage.getItem( 'sqmSaveLocalStorage' ) );
      if ( this.saveLocalStorage ) {
        this.autoSave();
      } else {
        this.clearSQM();
      }
    }
  }

  /**
   * ASYNC
   * Saves AST tree contents to local storage using astToString then calling join()
   */
  async saveSQM() {
    if ( !isNullOrUndefined( this.tree ) ) {
      localStorage.setItem( 'sqmSave', this.astToStrArray( this.tree ).join() );
    }
  }

  autoSave() {
    const saveTimer = timer(1000);
    const saveTimerSubscribe = saveTimer.subscribe(time => {
      console.log(time);
    });
    this.saveSQM();
  }

  /**
   * ASYNC
   * Clears the local storage of AST tree
   */
  clearSQM() {
    localStorage.removeItem( 'sqmSave' );
  }
}
