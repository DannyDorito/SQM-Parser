import { Component } from '@angular/core';
import { ParserSharedService } from '../parser/parsershared.service';
import { SaverService } from '../saver/saver.service';
import { ASTNode } from '../shared/ast';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent {
  sqmAST: boolean;
  constructor(private saver: SaverService, private parserShared: ParserSharedService) {}

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
    const fileName = this.getFileName();
    if (fileName !== '') {
      const missionAST = this.getMissionAST();
      if (missionAST.length > 0) {
        this.saver.exportSQM(fileName, missionAST);
      } else {
        // TODO: Error
      }
    } else {
      // TODO: Error
    }
  }

  /**
   * ASYNC
   * Gets missionAST from ParserSharedService then exports it with SaverService
   */
  async saveSQM() {
    const missionAST = this.getMissionAST();
    if (missionAST.length > 0) {
      this.saver.saveSQM(missionAST);
    } else {
      // TODO: Error
    }
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
    const missionAST = this.getMissionAST();
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
      this.parserShared.setMissionAST(missionAST);
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

  /**
   * Get the missionAST from the parserShared data service
   */
  getMissionAST() {
    let missionAST;
    this.parserShared.getMissionAST().subscribe(ast => {
      missionAST = ast as ASTNode[];
    });
    return missionAST;
  }

  /**
   * Get the fileName from the parserShared data service
   */
  getFileName() {
    let fileName;
    this.parserShared.getFileName().subscribe(name => {
      fileName = name as string;
    });
    return fileName;
  }
}
