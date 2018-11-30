import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { isNullOrUndefined } from 'util';
import { DialogueComponent } from './dialogue/dialogue.component';
import { FunctionsComponent } from './functions/functions.component';
import { ParserService } from './parser/parser.service';
import { SaverService } from './saver/saver.service';
import { ASTNode } from './shared/ast';
import { LoadingComponent } from './loading/loading.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  fileReaderString: string;
  isConfirmed = false;
  @ViewChild(LoadingComponent) isLoading: boolean;
  @ViewChild(FunctionsComponent) isComplete: boolean;
  isDraggingFile = false;

  timerSubscribe: Subscription;

  @ViewChild(DialogueComponent) dialogueError: string;

  @ViewChild(FunctionsComponent) missionAST: ASTNode[];
  @ViewChild(FunctionsComponent) fileName: string;

  showContextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;

  constructor(public parser: ParserService, private saver: SaverService) {}

  ngOnInit() {
    this.showContextMenu = false;
    this.isLoading = false;
    this.missionAST = [];
    this.isComplete = false;
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
      this.dialogueError = 'Error: "' + this.fileName + '" is an invalid file!';
      this.cancelSelection();
    } else {
      this.readFile(fileChangeEvent.target.files[0]);
    }
  }

  /**
   * Start reading the given file
   */
  readFile(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.fileReaderString = fileReader.result as string;
    };
    fileReader.onerror = () => {
      this.isLoading = false;
      this.dialogueError = 'Error: Something went wrong reading file!';
      fileReader.abort();
    };
    fileReader.readAsText(file);
  }

  /**
   * Fired when user drags a file, when a file has been found, change the binding text for the label
   * Based on:
   * https://scotch.io/@minrock/how-to-create-a-drag-and-drop-file-directive-in-angular2-with-angular-cli-part-1 [Online] Accessed 29th November 2018
   */
  onDragOver(dragEvent) {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.isDraggingFile = true;
  }

  /**
   * Fired when the user stops dragging a file
   * Based on:
   * https://www.w3schools.com/tags/ev_ondragend.asp [Online] Accessed 29th November 2018
   */
  onDragEnd(dragEvent) {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.isDraggingFile = false;
  }

  /**
   * Fired when drops a dragged file, when a file has been found, get the name of the file and attempt to read file
   * Based on: https://scotch.io/@minrock/how-to-create-a-drag-and-drop-file-directive-in-angular2-with-angular-cli-part-1 [Online] Accessed 29th November 2018
   */
  onDrop(dropEvent) {
    dropEvent.preventDefault();
    dropEvent.stopPropagation();
    const files = dropEvent.dataTransfer.files;
    if (files.length === 1) {
      this.isDraggingFile = false;
      this.fileName = dropEvent.dataTransfer.files[0].name;
      if (!this.saver.validName(this.fileName)) {
        this.dialogueError = 'Error: "' + this.fileName + '" is an invalid file!';
        this.cancelSelection();
      } else {
        this.readFile(dropEvent.dataTransfer.files[0]);
      }
    }
  }

  /**
   * Fired when the user clicks the confirm button, main method
   */
  confirmSelection() {
    if (!isNullOrUndefined(this.fileReaderString)) {
      this.isConfirmed = true;
      this.isLoading = true;
      this.startTreeCreation();
    }
  }

  /**
   * Fired when user clicks the cancel button
   */
  cancelSelection() {
    this.fileReaderString = undefined;
    this.fileName = undefined;
  }

  /**
   * ASYNC
   * Start AST tree creation
   */
  async startTreeCreation() {
    const t0 = performance.now();
    try {
      this.missionAST = await this.parser.generateAST(this.fileReaderString.split('\r\n'));
    } catch (exception) {
      this.dialogueError = exception.toString();
    }
    const t1 = performance.now();
    console.log('Tree generated in: ' + (t1 - t0) + 'ms');

    this.fileReaderString = undefined;
    this.isComplete = true;
    this.isLoading = false;

    if (this.saver.getAutoSave()) {
      this.saver.saveSQM(this.missionAST);
    }

    const t2 = performance.now();
    try {
      this.startErrorFinding();
    } catch (exception) {
      this.dialogueError = exception.toString();
    }
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

  onRightClick(rightClickEvent: any) {
    this.showContextMenu = true;
    this.contextMenuX = rightClickEvent.clientX;
    this.contextMenuY = rightClickEvent.clientY;
    rightClickEvent.preventDefault();
  }
}
