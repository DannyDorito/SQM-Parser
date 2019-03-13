import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogueData, DialogueType } from '../shared/dialogue';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent {
  defaultType: DialogueType = DialogueType.DEFAULT;
  constructor(public dialogueRef: MatDialogRef < DialogueComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: DialogueData) {}

  onNoClick() {
    this.dialogueRef.close();
  }

  onYesClick() {
    this.dialogueRef.close();
  }
}
