import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { SaverService } from '../saver/saver.service';
import { DialogueData, DialogueType } from '../shared/dialogue';
import { MissionTreeNode, Token } from '../shared/shared';
import { ParserService } from '../parser/parser.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent implements OnInit {
  sqmAST: boolean;

  @Input() missionTree: MissionTreeNode[];
  @Input() fileName: string;
  @Input() isComplete: boolean;

  @Output() findErrorEvent = new EventEmitter<boolean>();
  @Output() updateTreeEvent = new EventEmitter<boolean>();

  constructor(
    private saver: SaverService,
    public dialogue: MatDialog,
    private parser: ParserService) {}

  ngOnInit() {
    this.getSQMValue();
  }

  /**
   * ASYNC
   * Toggles AutoSave
   */
  async toggleAutoSave() {
    this.sqmAST = !this.sqmAST;
    if (this.sqmAST) {
      this.saver.enableAutoSave();
    } else if (!this.sqmAST) {
      this.saver.disableAutoSave();
    }
  }

  /**
   * Gets the current AutoSave value from localStorage using saver service
   */
  getSQMValue() {
    const sqmAST = this.saver.getAutoSave();
    if (sqmAST === null) {
      this.saver.disableAutoSave();
      this.sqmAST = false;
    } else {
      this.sqmAST = Boolean(sqmAST);
    }
  }

  /**
   * ASYNC
   * Gets fileName and missionAST then exports it with SaverService
   */
  async exportSQM() {
    if (this.fileName !== '') {
      if (this.missionTree.length > 0) {
        this.saver.exportSQM(this.fileName, this.missionTree);
      } else {
        this.openDialogue('Error: File is too short!');
      }
    } else {
      this.openDialogue('Error: File name not set!');
    }
  }

  /**
   * ASYNC
   * Exports it with SaverService
   */
  async saveSQM() {
    this.saver.saveSQM(this.missionTree);
  }

  /**
   * ASYNC
   * Calls clearSQM from HomeComponent
   */
  async clearSQM() {
    this.saver.clearSQM();
    this.saver.clearFileName();
  }

  /**
   * Event emitter for findErrorListener() that calls startErrorFinding() in MainComponent
   */
  findErrorEmitter() {
    this.findErrorEvent.emit(true);
  }

  /**
   * Event emitter for rebuildTreeListener() that calls missionTreeToNestedTree() in MainComponent
   */
  rebuildTreeEmitter() {
    this.updateTreeEvent.emit(true);
  }

  /**
   * Removes addOns and addOnsAuto dependencies from mission ast
   */
  removeDependencies() {
    const t0 = performance.now();
    const missionTree = this.missionTree;
    if (missionTree.length > 0) {
      try {
        const addOns = this.findNext('addons', 0, missionTree);
        if (addOns > -1) {
          const node = this.findEnd(missionTree, addOns);
          if (!isNullOrUndefined(node)) {
            missionTree.splice(node, 1);
          } else {
            missionTree.splice(addOns, 1);
          }
        } else {
          this.openDialogue('Error: Cannot find "addOns"!');
        }
      } catch {
        this.openDialogue('Error: Cannot find "addOns"!');
      }

      try {
        const addOnsAuto = this.findNext('addonsauto', 0, missionTree);
        if (addOnsAuto > -1) {
          const nodeAuto = this.findEnd(missionTree, addOnsAuto);
          if (!isNullOrUndefined(nodeAuto)) {
            missionTree.splice(nodeAuto, 1);
          } else {
            missionTree.splice(addOnsAuto, 1);
          }
        } else {
          this.openDialogue('Error: Cannot Find "addOnsAuto"!');
        }
      } catch {
        this.openDialogue('Error: Cannot Find "addOnsAuto"!');
      }

      this.missionTree = missionTree;
    } else {
      this.openDialogue('Error: File is too short!');
    }
    const t1 = performance.now();
    console.log('Dependencies deleted in: ' + (t1 - t0) + 'ms');
    this.rebuildTreeEmitter();
  }

  /**
   * Find next node
   */
  findNext(valueToFind: string, startIndex: number, missionTree: MissionTreeNode[]) {
    for (let index = startIndex; index < missionTree.length; index++) {
      if (missionTree[index].value.toLowerCase() === valueToFind) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Find the end of the addons array
   */
  findEnd(missionTree: MissionTreeNode[], index: number) {
    const lastNode = this.parser.getFinalNode(missionTree[index]);
    if (!isNullOrUndefined(lastNode)) {
      if (lastNode.nodeType === Token.SEMICOLON) {
        return undefined;
      } else {
        return this.findNext(Token.END_BRACE.toString(), index, missionTree);
      }
    } else {
      return undefined;
    }
  }

  /**
   * Open MatDialog from angular material
   */
  openDialogue(data: string) {
    this.dialogue.open(DialogueComponent, {
      data: new DialogueData(data, DialogueType.DEFAULT)
    });
  }
}
