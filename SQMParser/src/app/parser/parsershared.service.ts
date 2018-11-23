import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ASTNode } from '../shared/ast';

@Injectable({
  providedIn: 'root'
})
export class ParserSharedService {
  private missionAST: BehaviorSubject < ASTNode[] > = new BehaviorSubject < ASTNode[] > ([]);

  private fileName: BehaviorSubject < string > = new BehaviorSubject < string > ('');

  /**
   * Getter function for missionAST: ASTNode[]
   */
  getMissionAST() {
    return this.missionAST.asObservable();
  }

  /**
   * Setter function for missionAST: ASTNode[]
   */
  setMissionAST(missionAST: ASTNode[]) {
    this.missionAST.next(missionAST);
  }

  /**
   * Getter function for fileName: string
   */
  getFileName() {
    return this.fileName.asObservable();
  }

  /**
   * Setter function for fileName: string
   */
  setFileName(fileName: string) {
    this.fileName.next(fileName);
  }
}
