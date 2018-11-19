import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent {
  @Input() dialogueText: string;

  close() {
    this.dialogueText = '';
  }
}
