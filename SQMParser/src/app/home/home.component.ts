import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { isNullOrUndefined } from 'util';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { ParserService } from '../parser/parser.service';
import { SaverService } from '../saver/saver.service';
import { ASTNode } from '../shared/ast';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  missionAST: ASTNode[];

  fileReaderString: string;
  fileName: string;
  isConfirmed = false;
  isLoading = false;
  isComplete = false;

  timerSubscribe: Subscription;

  @ViewChild(DialogueComponent) dialogueError: string;

  constructor(private parser: ParserService, private saver: SaverService) {}

  ngOnInit() {
    this.dialogueError = '';

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
      this.dialogueError = 'Error: ' + this.fileName + ' is invalid.';
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.isLoading = true;
      this.fileReaderString = fileReader.result as string;
    };
    fileReader.onerror = () => {
      this.isLoading = false;
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

  /**
   * Start AST tree creation
   */
  startTreeCreation() {
    const t0 = performance.now();
    this.missionAST = this.parser.generateAST(this.fileReaderString.split('\r\n'));
    const t1 = performance.now();
    console.log((t1 - t0) + 'ms');
    console.log(this.missionAST);
    this.fileReaderString = undefined;
    this.isComplete = true;
    if (this.saver.getAutoSave()) {
      this.saver.saveSQM(this.missionAST);
    }
  }

  /**
   * ASYNC
   * Calls exportSQM from saver service
   */
  async exportSQM() {
    this.saver.exportSQM(this.fileName, this.missionAST);
  }

  /**
   * ASYNC
   * Calls saveSQM from saver service
   */
  async saveSQM() {
    this.saver.saveSQM(this.missionAST);
  }

  /**
   * ASYNC
   * Calls clearSQM from saver service
   */
  async clearSQM() {
    this.saver.clearSQM();
  }
}
