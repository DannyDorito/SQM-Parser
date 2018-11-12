import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ASTMission } from '../shared/ast';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SaverService {
  /**
   * Saves given file to passed fileName, appends .sqm if it does not have it
   * Based on:
   * https://github.com/eligrey/FileSaver.js [Online] Accessed 19th October 2018
   * https://github.com/eligrey/FileSaver.js/issues/308#issuecomment-286127364  [Online] Accessed 20th October 2018
   * https://github.com/eligrey/FileSaver.js/blob/master/README.md#supported-browsers [Online] Accessed 20th October 2018
   */
  exportSQM(fileName: string, missionAST: ASTMission) {
    const isFileSaverSupported = !!new Blob;
    if (isFileSaverSupported === false) {
      throw new Error('Error: File saving is not supported on this browser!\r\nPlease use a browser that supports Blobs');
    }
    if (!fileName.includes('.sqm')) {
      fileName += '.sqm';
    }
    FileSaver.saveAs(new Blob(missionAST.toString().split('\r\n'), { type: 'text/plain;charset=utf-8' }), fileName);
  }

  /**
   * Loads saved sqm from localStorage
   */
  loadSQM() {
    return localStorage.getItem(environment.sqmLocalStorageName);
  }

  /**
   * ASYNC
   * Saves ASTMission to localStorage
   */
  async saveSQM(missionAST: ASTMission) {
    localStorage.setItem(environment.sqmLocalStorageName, missionAST.toString());
  }

  /**
   * Enables autosave, adds to localStorage
   */
  enableAutoSave() {
    localStorage.setItem(environment.sqmAutoSaveName, 'true');
  }

  /**
   * Disables autosave, removes from localstorage
   */
  disableAutoSave() {
    localStorage.removeItem(environment.sqmAutoSaveName);
  }
}
