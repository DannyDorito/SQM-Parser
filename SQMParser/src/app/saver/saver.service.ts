import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ASTMission } from '../shared/ast';

@Injectable({
  providedIn: 'root'
})
export class SaverService {

  constructor() {}

  /**
   * Saves given file to passed fileName, appends .sqm if it does not have it
   * Based on:
   * https://github.com/eligrey/FileSaver.js [Online] Accessed 19th October 2018
   * https://github.com/eligrey/FileSaver.js/issues/308#issuecomment-286127364  [Online] Accessed 20th October 2018
   * https://github.com/eligrey/FileSaver.js/blob/master/README.md#supported-browsers [Online] Accessed 20th October 2018
   */
  exportSQM(fileName: string, missionAST: ASTMission) {
    try {
      const isFileSaverSupported = !!new Blob;
      if (!fileName.includes('.sqm')) {
        fileName += '.sqm';
      }
      FileSaver.saveAs(new Blob(missionAST.toString().split('\r\n'), {
        type: 'text/plain;charset=utf-8'
      }), fileName);
    } catch (exception) {
      console.log('Cannot save SQM!');
    }
  }

  loadSQM(fileReaderString: string) {
    const sqmAutoSave = localStorage.getItem('sqmAST');
    if (sqmAutoSave !== '') {
      fileReaderString = sqmAutoSave;
    }
  }

  async saveSQM(missionAST: ASTMission) {
    localStorage.setItem('sqmAST', missionAST.toString());
  }

  enableAutoSave() {
    localStorage.setItem('sqmAutoSave', 'true');
  }

  disableAutoSave() {
    localStorage.removeItem('sqmAutoSave');
  }
}
