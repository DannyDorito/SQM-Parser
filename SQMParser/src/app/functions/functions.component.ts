import { Component, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { SaverService } from '../saver/saver.service';
import { ASTNode } from '../shared/ast';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent {
  sqmAST: boolean;

  @Input() missionAST;
  @Input() fileName;
  @Input() isComplete;

  constructor(private saver: SaverService) {}

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
      if (this.missionAST.length > 0) {
        this.saver.exportSQM(this.fileName, this.missionAST);
      } else {
        // TODO: Error
      }
    } else {
      // TODO: Error
    }
  }

  /**
   * ASYNC
   * Exports it with SaverService
   */
  async saveSQM() {
    this.saver.saveSQM(this.missionAST);
  }

  /**
   * ASYNC
   * Calls clearSQM from HomeComponent
   */
  async clearSQM() {
    this.saver.clearSQM();
  }

  /**
   * Removes addOns and addOnsAuto dependencies from mission ast
   */
  removeDependencies() {
    const missionAST = this.missionAST;
    if (missionAST.length > 0) {
      const addOns = this.getIndex('addOns', missionAST, 0);
      if (!isNullOrUndefined(addOns)) {
        missionAST.splice(addOns, this.getIndex('}', missionAST, addOns));
      } else {
        // TODO: Error
      }
      const addOnsAutoIndex = this.getIndex('addOnsAuto', missionAST, 0);
      if (!isNullOrUndefined(addOnsAutoIndex)) {
        missionAST.splice(addOnsAutoIndex, this.getIndex('}', missionAST, addOnsAutoIndex));
      } else {
        // TODO: Error
      }
      this.missionAST = missionAST;
    } else {
      // TODO: Error
    }
  }

  /**
   * Get the index of an item from the missionAST tree
   */
  getIndex(value: string, missionAST: ASTNode[], index: number) {
    for (index < missionAST.length; index++;) {
      if (missionAST[index].value === value) {
        return index;
      }
    }
    return undefined;
  }
}
