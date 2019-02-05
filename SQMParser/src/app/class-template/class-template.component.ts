import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IntroTemplate, NPCTemplate, ObjectTemplate, OutroTemplate, PlayerTemplate, SquadTemplate, VehicleTemplate, WeatherTemplate } from '../shared/arma-template';

@Component({
  selector: 'app-class-template',
  templateUrl: './class-template.component.html',
  styleUrls: ['./class-template.component.css']
})
export class ClassTemplateComponent {
  template: NPCTemplate | PlayerTemplate | VehicleTemplate | WeatherTemplate | IntroTemplate | OutroTemplate | SquadTemplate | ObjectTemplate;

  constructor(public dialogueRef: MatDialogRef<ClassTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NPCTemplate | PlayerTemplate | VehicleTemplate | WeatherTemplate | IntroTemplate | OutroTemplate | SquadTemplate | ObjectTemplate ) {}

  onNoClick() {
    this.dialogueRef.close();
  }

}
