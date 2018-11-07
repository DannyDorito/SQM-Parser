import { Component, AfterViewInit, ViewChild } from '@angular/core';
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
  /**
   * Data sharing via ViewChild component
   * Based on:
   * https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/ [Online] Accessed 6th November 2018
   */
  @ViewChild( ViewTreeComponent ) viewTree;
  tree: AST[];

  fileReaderString: string;
  confirmed = false;

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
      this.tree = < AST[] > await this.parser.execute( this.fileReaderString );
      this.fileReaderString = undefined;
    }
  }

  /**
   * Data sharing via ViewChild component
   * Based on:
   * https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/ [Online] Accessed 6th November 2018
   */
  ngAfterViewInit() {
    if ( !isNullOrUndefined( this.tree ) ) {
      this.viewTree.tree = this.tree;
    }
  }
}
