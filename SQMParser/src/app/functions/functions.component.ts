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
  constructor(private saver: SaverService, private parserShared: ParserSharedService) {}

  /**
   * ASYNC
   * Gets fileName and missionAST from ParserSharedService then exports it with SaverService
   */
  async exportSQM() {
    let fileName;
    this.parserShared.getFileName().subscribe(name => {
      fileName = name as string;
    });
    let missionAST;
    this.parserShared.getMissionAST().subscribe(ast => {
      missionAST = ast as ASTNode[];
    });
    this.saver.exportSQM(fileName, missionAST);
  }

  /**
   * ASYNC
   * Gets missionAST from ParserSharedService then exports it with SaverService
   */
  async saveSQM() {
    let missionAST;
    this.parserShared.getMissionAST().subscribe(ast => {
      missionAST = ast as ASTNode[];
    });
    this.saver.saveSQM(missionAST);
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
    let missionAST: ASTNode[];
    this.parserShared.getMissionAST().subscribe(ast => {
      missionAST = ast as ASTNode[];
    });
    const addOns = this.getIndex('addOns', missionAST, 0);
    if (!isNullOrUndefined(addOns)) {
      missionAST.splice(addOns, this.getIndex('}', missionAST, addOns));
    }
    const addOnsAutoIndex = this.getIndex('addOnsAuto', missionAST, 0);
    if (!isNullOrUndefined(addOnsAutoIndex)) {
      missionAST.splice(addOnsAutoIndex, this.getIndex('}', missionAST, addOnsAutoIndex));
    }
    this.parserShared.setMissionAST(missionAST);
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
