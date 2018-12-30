import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogueData } from '../shared/dialogue';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent {
  constructor(public dialogRef: MatDialogRef<DialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogueData) {}

  onNoClick() {
    this.dialogRef.close();
  }

  onYesClick() {

  }
}
