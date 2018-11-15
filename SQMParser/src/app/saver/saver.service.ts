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
    if (!this.validName(fileName)) {
      throw new Error('Error: ' + fileName + ' is invalid!');
    } else if (!!new Blob === false) {
      throw new Error('Error: File saving is not supported on this browser, please use a browser that supports Blobs!');
    } else {
      FileSaver.saveAs(new Blob(missionAST.toString().split('\r\n'), { type: 'text/plain;charset=utf-8' }), fileName);
    }
  }

  /**
   * Checks file name is a valid, eg. mission.sqm
   */
  validName(fileName: string) {
    return /^[\w\-. ]+\.sqm/.test(fileName);
  }

  /**
   * Loads saved sqm from localStorage
   */
  loadSQM() {
    if (window.localStorage) {
      return localStorage.getItem(environment.sqmLocalStorageName);
    } else {
      throw new Error('Error: This browser does not support LocalStorage, cannot load SQM!');
    }
  }

  /**
   * ASYNC
   * Saves ASTMission to localStorage
   */
  async saveSQM(missionAST: ASTMission) {
    if (window.localStorage) {
      localStorage.setItem(environment.sqmLocalStorageName, missionAST.toString());
    } else {
      throw new Error('Error: This browser does not support LocalStorage, cannot save SQM!');
    }
  }

  /**
   * Enables autosave, adds to localStorage
   */
  enableAutoSave() {
    if (window.localStorage) {
      try {
        localStorage.setItem(environment.sqmAutoSaveName, 'true');
      } catch (error) {
        throw new Error('Error: LocalStorage is either full or cannot access it!');
      }
    } else {
      throw new Error('Error: This browser does not support LocalStorage, disabling AutoSave!');
    }
  }

  /**
   * Disables autosave, removes from localstorage
   */
  disableAutoSave() {
    if (window.localStorage) {
      localStorage.removeItem(environment.sqmAutoSaveName);
    } else {
      throw new Error('Error: This browser does not support localStorage, cannot disable AutoSave!');
    }
  }
}
