import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { isNullOrUndefined } from 'util';
import { ParserService } from '../parser/parser.service';
import { AST } from '../shared/ast';
import { ViewTreeComponent } from '../view-tree/view-tree.component';

@Component( {
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
} )
export class HomeComponent implements AfterViewInit {
  @ViewChild(ViewTreeComponent) child;

  fileReaderString: string;
  confirmed = false;
  tree: AST[];

  constructor( private parser: ParserService ) {}

  /**
   * Fired when a file has been selected by the user's $event
   * Based on:
   * https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/ [Online] Accessed 9th October 2018
   * https://stackoverflow.com/a/27439524 [Online] Accessed 16th October 2018
   * https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html [Online] Accessed 17th October 2018
   */
  onFileChanged( fileChangeEvent: any ) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.fileReaderString = fileReader.result as string;
    };
    fileReader.onerror = () => {
      console.log( 'error loading' );
    };
    try {
      fileReader.readAsText( fileChangeEvent.target.files[ 0 ] );
    } catch ( TypeError ) {
      console.log( 'error loading, type error' );
    }
  }

  /**
   * ASYNC
   * Fired when the user clicks the confirm button, main method
   */
  async confirmSelection() {
    if ( !isNullOrUndefined( this.fileReaderString ) ) {
      this.confirmed = true;
      this.tree = <AST[]> await this.parser.execute( this.fileReaderString );
      this.fileReaderString = undefined;
    }
  }

  ngAfterViewInit() {
    this.child.tree = this.tree;
    // this.tree = this.child.tree;
  }

  editItem( pos: number ) {
    console.log( pos );
  }

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
      // FileSaver.saveAs( new Blob( this.file, {
      //   type: 'text/plain;charset=utf-8'
      // } ), fileName );
    } catch ( exception ) {
      console.log( exception );
    }
  }
}
