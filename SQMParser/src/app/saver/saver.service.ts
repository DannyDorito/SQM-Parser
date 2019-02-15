import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment.prod';
import { MissionTreeNode } from '../shared/shared';

@Injectable({
  providedIn: 'root'
})
export class SaverService {
  /**
   * Saves given file to passed fileName, appends .sqm if it does not have it
   * https://github.com/eligrey/FileSaver.js [Online] Accessed 19th October 2018
   */
  exportSQM(fileName: string, missionTree: MissionTreeNode[]) {
    if (!this.validName(fileName)) {
      throw new Error('Error: ' + fileName + ' is invalid!');
    } else if (!!new Blob === false) {
      throw new Error('Error: File saving is not supported on this browser, please use a browser that supports Blobs!');
    } else {
      FileSaver.saveAs(new Blob(this.treeToStringArray(missionTree), { type: 'text/plain;charset=utf-8' }), fileName);
    }
  }

  /**
   * Passed tree to string array
   */
  treeToStringArray( missionTree: MissionTreeNode[] ) {
    const strArray: string[] = [];
    for (const branch of missionTree) {
      let str = '';
      const traverse = (node: MissionTreeNode) => {
        if (node) {
          str += node.value;
          traverse(node.child);
        }
      };
      traverse(branch);
      str += '\r\n';
      strArray.push(str);
    }
    return strArray;
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
   * Saves missionTree to localStorage
   */
  async saveSQM(missionTree: MissionTreeNode[]) {
    if (window.localStorage) {
      localStorage.setItem(environment.sqmLocalStorageName, this.treeToStringArray(missionTree).join(''));
    } else {
      throw new Error('Error: This browser does not support LocalStorage, cannot save SQM!');
    }
  }

  /**
   * Clears missionTree from localStorage
   */
  clearSQM() {
    if (window.localStorage) {
      localStorage.removeItem(environment.sqmLocalStorageName);
    } else {
      throw new Error('Error: This browser does not support LocalStorage, cannot clear SQM!');
    }
  }

  /**
   * ASYNC
   * Saves filename to localStorage
   */
  saveFileName(fileName: string) {
    if (window.localStorage) {
      localStorage.setItem(environment.sqmFileName, fileName);
    } else {
      throw new Error('Error: This browser does not support LocalStorage, cannot clear SQM!');
    }
  }

  /**
   * Loads fileName from localStorage
   */
  getFileName() {
    if (window.localStorage) {
      return localStorage.getItem(environment.sqmFileName);
    } else {
      throw new Error('Error: This browser does not support LocalStorage, cannot clear SQM!');
    }
  }

  /**
   * Clears fileName from localStorage
   */
  clearFileName() {
    if (window.localStorage) {
      localStorage.removeItem(environment.sqmFileName);
    } else {
      throw new Error('Error: This browser does not support LocalStorage, cannot clear SQM!');
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
  async disableAutoSave() {
    if (window.localStorage) {
      localStorage.removeItem(environment.sqmAutoSaveName);
    } else {
      throw new Error('Error: This browser does not support localStorage, cannot disable AutoSave!');
    }
  }

  /**
   * Gets autosave value from localStorage
   */
  getAutoSave() {
    if (window.localStorage) {
      return Boolean(localStorage.getItem(environment.sqmAutoSaveName));
    } else {
      throw new Error('Error: This browser does not support localStorage, cannot get AutoSave!');
    }
  }
}
