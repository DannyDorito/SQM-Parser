import { Component, Input } from '@angular/core';
import * as FileSaver from 'file-saver';
import { AST } from '../shared/ast';
import { isNullOrUndefined } from 'util';

@Component( {
  selector: 'app-view-tree',
  templateUrl: './view-tree.component.html',
  styleUrls: [ './view-tree.component.css' ]
} )
export class ViewTreeComponent {
  @Input() tree: AST[];

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
      FileSaver.saveAs( new Blob( this.astToStrArray(this.tree), {
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
    tree.forEach(branch => {
      let stringConcat = branch.item.value;
      branch.children.forEach(child => {
        if (!isNullOrUndefined(child)) {
          stringConcat += child.item.value;
        }
      });
      stringConcat += '\r\n';
      stringTree.push(stringConcat);
    });
    return stringTree;
  }
}
