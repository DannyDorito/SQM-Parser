import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { isNullOrUndefined } from 'util';
import { FunctionsComponent } from './functions/functions.component';
import { ParserService } from './parser/parser.service';
import { SaverService } from './saver/saver.service';
import { ASTNode } from './shared/ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  fileReaderString: string;
  isConfirmed = false;
  isLoading = false;
  isComplete = false;

  timerSubscribe: Subscription;

  // TODO: Error dialogue
  // @ViewChild(DialogueComponent) dialogueError: string;

  @ViewChild(FunctionsComponent) missionAST: ASTNode[];
  @ViewChild(FunctionsComponent) fileName: string;

  constructor(public parser: ParserService, private saver: SaverService) {}

  ngOnInit() {
    this.missionAST = [];

    // TODO: Error dialogue
    // this.dialogueError = '';

    this.loadAutoSave();

    const timerSource = timer((environment.sqmSavePeriodMins * 60) * 10000);
    this.timerSubscribe = timerSource.subscribe(event => {
      this.saveSQM();
    });
  }

  /**
   * Before the component is destroyed, unsubscribe from the timer subscription
   */
  ngOnDestroy() {
    if (!isNullOrUndefined(this.timerSubscribe)) {
      this.timerSubscribe.unsubscribe();
    }
  }

  /**
   * Before the component is destroyed, unsubscribe from the timer subscription
   */
  loadAutoSave() {
    const contents = this.saver.loadSQM();
    const autosave = this.saver.getAutoSave();
    if (contents !== null && autosave) {
      this.fileReaderString = contents;
      this.confirmSelection();
    }
  }

  /**
   * Fired when a file has been selected by the user's $event
   * Based on:
   * https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/ [Online] Accessed 9th October 2018
   * https://stackoverflow.com/a/27439524 [Online] Accessed 16th October 2018
   * https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html [Online] Accessed 17th October 2018
   */
  onFileChanged(fileChangeEvent: any) {
    this.fileName = fileChangeEvent.target.files[0].name;
    if (!this.saver.validName(this.fileName)) {
      // TODO: Error dialogue
      // this.dialogueError = 'Error: ' + this.fileName + ' is invalid.';
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.isLoading = true;
      this.fileReaderString = fileReader.result as string;
    };
    fileReader.onerror = () => {
      this.isLoading = false;
      // TODO: Error dialogue
      fileReader.abort();
    };
    fileReader.onprogress = () => {
      this.isLoading = true;
    };
    fileReader.onloadend = (data) => {
      if (data.lengthComputable) {
        this.isLoading = false;
      }
    };
    fileReader.readAsText(fileChangeEvent.target.files[0]);
  }

  /**
   * Fired when the user clicks the confirm button, main method
   */
  confirmSelection() {
    if (!isNullOrUndefined(this.fileReaderString)) {
      this.isConfirmed = true;
      this.startTreeCreation();
    }
  }

  cancelSelection() {
    this.fileReaderString = undefined;
  }

  /**
   * ASYNC
   * Start AST tree creation
   */
  async startTreeCreation() {
    const t0 = performance.now();
    this.missionAST = await this.parser.generateAST(this.fileReaderString.split('\r\n'));
    const t1 = performance.now();
    console.log('Tree generated in: ' + (t1 - t0) + 'ms');

    this.fileReaderString = undefined;
    this.isComplete = true;

    if (this.saver.getAutoSave()) {
      this.saver.saveSQM(this.missionAST);
    }

    const t2 = performance.now();
    this.startErrorFinding();
    const t3 = performance.now();
    console.log('Errors generated in: ' + (t3 - t2) + 'ms');
  }

  async startErrorFinding() {
    this.parser.findErrors(this.missionAST);
  }

  /**
   * Gets fileName and missionAST from ParserSharedService then exports it with SaverService
   */
  exportSQM() {
    this.saver.exportSQM(this.fileName, this.missionAST);
  }

  /**
   * Gets missionAST from ParserSharedService then exports it with SaverService
   */
  saveSQM() {
    this.saver.saveSQM(this.missionAST);
  }

  /**
   * Calls clearSQM from saver service
   */
  clearSQM() {
    this.saver.clearSQM();
  }
}
