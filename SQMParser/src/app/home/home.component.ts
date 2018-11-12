import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ParserService } from '../parser/parser.service';
import { ViewTreeComponent } from '../view-tree/view-tree.component';
import { ASTMission } from '../shared/ast';

@Component( {
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
} )
export class HomeComponent implements AfterViewInit, OnInit {
  /**
   * Data sharing via ViewChild component
   * Based on:
   * https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/ [Online] Accessed 6th November 2018
   */
  @ViewChild( ViewTreeComponent ) viewTree;

  missionAST: ASTMission;

  fileReaderString: string;
  confirmed = false;
  loading = false;

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
      fileReader.abort();
    };
    fileReader.onprogress = () => {
      this.loading = true;
    };
    fileReader.onloadend = (data) => {
      if (data.lengthComputable) {
        console.log(data.loaded);
        this.loading = false;
      }
    };
    try {
      fileReader.readAsText( fileChangeEvent.target.files[ 0 ] );
    } catch ( TypeError ) {
      console.log( 'error loading, type error' );
    }
  }

  /**
   * Fired when the user clicks the confirm button, main method
   */
  confirmSelection() {
    if ( !isNullOrUndefined( this.fileReaderString ) ) {
      this.confirmed = true;
      this.startTreeCreation();
    }
  }

  /**
   * Start AST tree creation
   */
  async startTreeCreation() {
    this.missionAST = this.parser.generateAST( this.fileReaderString.split( '\r\n') );
    console.log(this.missionAST);
    this.fileReaderString = undefined;
  }

  /**
   * Data sharing via ViewChild component
   * Based on:
   * https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/ [Online] Accessed 6th November 2018
   */
  ngAfterViewInit() {
    // if ( !isNullOrUndefined( this.tree ) ) {
    //   this.viewTree.tree = this.tree;
    // }
  }

  /**
   * Load from sqmSave local storage, confirm and then start tree generation
   */
  ngOnInit() {
    const sqmLocalStorage = localStorage.getItem( 'sqmSave' );
    if ( !isNullOrUndefined( sqmLocalStorage ) && sqmLocalStorage !== '' ) {
      this.fileReaderString = sqmLocalStorage;
      this.confirmed = true;
      this.startTreeCreation();
    }
  }
}
