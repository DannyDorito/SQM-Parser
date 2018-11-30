import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { FunctionsComponent } from './functions/functions.component';
import { LoadingComponent } from './loading/loading.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TestsComponent } from './tests/tests.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    FunctionsComponent,
    DialogueComponent,
    TestsComponent,
    LoadingComponent,
    ContextMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
