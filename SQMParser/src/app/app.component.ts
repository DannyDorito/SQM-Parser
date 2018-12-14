import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { isNullOrUndefined } from 'util';
import { DialogueComponent } from './dialogue/dialogue.component';
import { FunctionsComponent } from './functions/functions.component';
import { ParserService } from './parser/parser.service';
import { SaverService } from './saver/saver.service';
import { TreeNode } from './shared/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  fileReaderString: string;
  isConfirmed = false;
  isLoading: boolean;
  isComplete: boolean;
  isDraggingFile = false;

  timerSubscribe: Subscription;

  @ViewChild(DialogueComponent) dialogueError: string;

  @ViewChild(FunctionsComponent) missionTree: TreeNode[];
  @ViewChild(FunctionsComponent) fileName: string;

  showContextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;

  constructor(public parser: ParserService, private saver: SaverService) {}

  ngOnInit() {
    this.showContextMenu = false;
    this.isLoading = false;
    this.missionTree = [];
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
   * Attempt to load the autosave from localStorage through the saver service
   */
  loadAutoSave() {
    const autosave = this.saver.getAutoSave();
    const fileName = this.saver.getFileName();
    if (fileName !== null && autosave) {
      this.fileName = fileName;
    }
    const contents = this.saver.loadSQM();
    if (contents !== null && autosave) {
      this.fileReaderString = contents;
      this.confirmSelection();
    }
  }

  /**
   * Fired when a file has been selected by the user's $event
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
   * https://scotch.io/@minrock/how-to-create-a-drag-and-drop-file-directive-in-angular2-with-angular-cli-part-1 [Online] Accessed 29th November 2018
   * https://developer.mozilla.org/en-US/docs/Web/API/DragEvent [Online] Accessed 29th November 2018
   */
  onDragOver(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.isDraggingFile = true;
  }

  /**
   * Fired when the user stops dragging a file
   * https://www.w3schools.com/tags/ev_ondragend.asp [Online] Accessed 29th November 2018
   * https://developer.mozilla.org/en-US/docs/Web/API/DragEvent [Online] Accessed 29th November 2018
   */
  onDragEnd(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.isDraggingFile = false;
  }

  /**
   * Fired when drops a dragged file, when a file has been found, get the name of the file and attempt to read file
   * https://scotch.io/@minrock/how-to-create-a-drag-and-drop-file-directive-in-angular2-with-angular-cli-part-1 [Online] Accessed 29th November 2018
   * https://developer.mozilla.org/en-US/docs/Web/API/DragEvent [Online] Accessed 29th November 2018
   */
  onDrop(dropEvent: DragEvent) {
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
   * Fired when the user right clicks, enables and sets the x,y position of the context menu
   * https://developer.mozilla.org/en-US/docs/Web/Events/contextmenu [Online] Accessed 30th November 2018
   */
  onRightClick(rightClickEvent: MouseEvent) {
    this.showContextMenu = true;
    this.contextMenuX = rightClickEvent.clientX;
    this.contextMenuY = rightClickEvent.clientY;
    rightClickEvent.preventDefault();
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
   * Start tree creation
   */
  async startTreeCreation() {
    const t0 = performance.now();
    try {
      this.missionTree = await this.parser.generateTree(this.fileReaderString.split('\r\n'));
    } catch (exception) {
      this.dialogueError = exception.toString();
    }
    const t1 = performance.now();
    console.log('Tree generated in: ' + (t1 - t0) + 'ms');

    this.fileReaderString = undefined;
    this.isComplete = true;
    this.isLoading = false;

    if (this.saver.getAutoSave()) {
      this.saver.saveSQM(this.missionTree);
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
    this.parser.findErrors(this.missionTree);
  }

  /**
   * Gets fileName and missionTree from ParserSharedService then exports it with SaverService
   */
  exportSQM() {
    this.saver.exportSQM(this.fileName, this.missionTree);
  }

  /**
   * Gets missionTree from ParserSharedService then exports it with SaverService
   */
  saveSQM() {
    this.saver.saveSQM(this.missionTree);
  }

  /**
   * Calls clearSQM from saver service
   */
  clearSQM() {
    this.saver.clearSQM();
  }

  onEdit(event) {
    console.log(event);
  }

  /**
   * Calculates the max height of the viewport - the toolbar size
   */
  getMaxSize() {
    return (window.innerHeight - 38);
  }
}
