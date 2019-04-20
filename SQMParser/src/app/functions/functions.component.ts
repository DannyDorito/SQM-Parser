import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { SaverService } from '../saver/saver.service';
import { DialogueData, DialogueType } from '../shared/dialogue';
import { MissionTreeNode } from '../shared/shared';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent {
  sqmAST: boolean;

  @Input() missionTree: MissionTreeNode[];
  @Input() fileName: string;
  @Input() isComplete: boolean;

  constructor(
    private saver: SaverService,
    public dialogue: MatDialog) {}

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
   * Gets fileName and missionAST from ParserSharedService then exports it with SaverService
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
   * Removes addOns and addOnsAuto dependencies from mission ast
   */
  removeDependencies() {
    const t0 = performance.now();
    const missionAST = this.missionTree;
    if (missionAST.length > 0) {
      let addOns = this.getIndex('addOns', missionAST, 0);
      if (isNullOrUndefined(addOns)) {
        addOns = this.getIndex('addons', missionAST, 0);
      }
      if (!isNullOrUndefined(addOns)) {
        missionAST.splice(addOns, this.getIndex(';', missionAST, addOns));
      } else {
        this.openDialogue('Error: Cannot find "addOns"!');
      }

      let addOnsAutoIndex = this.getIndex('addOnsAuto', missionAST, 0);
      if (isNullOrUndefined(addOns)) {
        addOnsAutoIndex = this.getIndex('addonsauto', missionAST, 0);
      }
      if (!isNullOrUndefined(addOnsAutoIndex)) {
        missionAST.splice(addOnsAutoIndex, this.getIndex(';', missionAST, addOnsAutoIndex));
      } else {
        this.openDialogue('Error: Cannot Find "addOnsAuto"!');
      }
      this.missionTree = missionAST;
    } else {
      this.openDialogue('Error: File is too short!');
    }
    const t1 = performance.now();
    console.log('Dependencies deleted in: ' + (t1 - t0) + 'ms');
  }

  /**
   * Get the index of an item from the missionAST tree
   */
  getIndex(value: string, missionAST: MissionTreeNode[], index: number) {
    for (let i = 0; i < missionAST.length; i++) {
      if (missionAST[index].value === value) {
        return i;
      }
    }
    return undefined;
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
