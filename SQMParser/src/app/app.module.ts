import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { FunctionsComponent } from './functions/functions.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TestsComponent } from './tests/tests.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    FunctionsComponent,
    DialogueComponent,
    TestsComponent,
    ContextMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ScrollingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NoopAnimationsModule,
    MatDialogModule
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent],
  entryComponents: [DialogueComponent]
})
export class AppModule {}
