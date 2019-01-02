import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { isNullOrUndefined } from 'util';
import { DialogueComponent } from './dialogue/dialogue.component';
import { FunctionsComponent } from './functions/functions.component';
import { ParserService } from './parser/parser.service';
import { SaverService } from './saver/saver.service';
import { DialogueData, DialogueType } from './shared/dialogue';
import { TreeNode } from './shared/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  fileReaderString: string;
  isConfirmed = false;
  isComplete: boolean;
  isDraggingFile = false;

  timerSubscribe: Subscription;

  @ViewChild(FunctionsComponent) missionTree: TreeNode[];
  @ViewChild(FunctionsComponent) fileName: string;

  showContextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  lastSelected = -1;

  constructor(public parser: ParserService, private saver: SaverService, public dialogue: MatDialog) {}

  ngOnInit() {
    this.showContextMenu = false;
    this.missionTree = [];
    this.isComplete = false;
    this.loadAutoSave();

    const timerSource = timer((environment.sqmSavePeriodMins * 60) * 10000);
    this.timerSubscribe = timerSource.subscribe(event => {
      this.saver.saveSQM(this.missionTree);
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
      this.openDialogue('Error: "' + this.fileName + '" is an invalid file!', DialogueType.DEFAULT);
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
      this.openDialogue('Error: Something went wrong reading file!', DialogueType.DEFAULT);
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
      try {
        this.fileName = dropEvent.dataTransfer.files[0].name;
        if (!this.saver.validName(this.fileName)) {
          this.openDialogue('Error: "' + this.fileName + '" is an invalid file!', DialogueType.DEFAULT);
          this.cancelSelection();
        } else {
          this.readFile(dropEvent.dataTransfer.files[0]);
        }
      } catch (exception) {
        this.cancelSelection();
        this.openDialogue(exception.toString(), DialogueType.DEFAULT);
      }
    }
  }

  /**
   * Fired when the user right clicks, enables and sets the x,y position of the context menu
   * https://developer.mozilla.org/en-US/docs/Web/Events/contextmenu [Online] Accessed 30th November 2018
   */
  onRightClick(rightClickEvent: MouseEvent, index: number) {
    if (index >= 0 && index < this.missionTree.length) {
      this.lastSelected = index;
      rightClickEvent.preventDefault();
      this.showContextMenu = true;
      this.contextMenuX = rightClickEvent.clientX;
      this.contextMenuY = rightClickEvent.clientY;
    }
  }

  /**
   * Delete the last selected index of the line that has been right clicked
   */
  deleteLine() {
    if (this.lastSelected >= 0 && this.lastSelected < this.missionTree.length) {
      this.openDialogue('Delete line ' + this.lastSelected + '?', DialogueType.DELETE);
    } else {
      this.openDialogue('Error: Last selected "' + this.lastSelected + '" is out of bounds!', DialogueType.DEFAULT);
    }
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
   * Fired when user clicks the cancel button
   */
  cancelSelection() {
    this.fileReaderString = undefined;
    this.fileName = undefined;
  }

  /**
   * Start tree creation
   */
  startTreeCreation() {
    const t0 = performance.now();
    try {
      this.missionTree = this.parser.generateTree(this.fileReaderString.split('\r\n'));
    } catch (exception) {
      this.openDialogue(exception.toString(), DialogueType.DEFAULT);
    }
    const t1 = performance.now();
    console.log('Tree generated in: ' + (t1 - t0) + 'ms');

    this.fileReaderString = undefined;
    this.isComplete = true;

    if (this.saver.getAutoSave()) {
      this.saver.saveSQM(this.missionTree);
    }

    const t2 = performance.now();
    try {
      this.startErrorFinding();
    } catch (exception) {
      this.openDialogue(exception.toString(), DialogueType.DEFAULT);
    }
    const t3 = performance.now();
    console.log('Errors generated in: ' + (t3 - t2) + 'ms');
  }

  /**
   * Starts the findError method in the parser service,
   * then the UI highlights and the lines with errors
   */
  startErrorFinding() {
    const errorCount = this.parser.findErrors(this.missionTree, 0, this.missionTree.length);
    if (errorCount > 0) {
      this.openDialogue('Found ' + errorCount + ' potential errors, attempt to fix them automatically?', DialogueType.FIX_ERRORS);
    }
  }

  /**
   * Edit a passed node from CDK virtual for
   */
  editNode(event: Event, index: number) {
    this.parser.parseAndEditNode(index, this.missionTree, event.toString());
  }

  /**
   * Calculates the max height of the viewport - the toolbar size (toolbar size is always 38px)
   */
  getMaxSize() {
    return (window.innerHeight - 38);
  }

  /**
   * Open MatDialog from angular material
   */
  openDialogue(data: string, type: DialogueType) {
    if (type) {
      const dialogueRef = this.dialogue.open(DialogueComponent, {
        data: new DialogueData(data, type)
      });
      dialogueRef.afterClosed().subscribe(result => {
        if (result) {
          switch (type) {
            case DialogueType.FIX_ERRORS:
              this.parser.fixErrors(this.missionTree);
              break;
            case DialogueType.DELETE:
              this.parser.removeNode(this.lastSelected, this.missionTree);
              break;
            default:
              break;
          }
        }
      });
    } else {
      this.dialogue.open(DialogueComponent, {
        data: new DialogueData(data, type)
      });
    }
  }
}
