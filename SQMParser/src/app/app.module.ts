import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { FunctionsComponent } from './functions/functions.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OptionsComponent } from './options/options.component';
import { TestsComponent } from './tests/tests.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    OptionsComponent,
    FunctionsComponent,
    HomeComponent,
    DialogueComponent,
    TestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [HomeComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
