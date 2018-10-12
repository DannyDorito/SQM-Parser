import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { OptionsComponent } from './options/options.component';
import { FunctionsComponent } from './functions/functions.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'functions', component: FunctionsComponent, data: { title: 'Functions' } },
  { path: 'options', component: OptionsComponent, data: { title: 'Functions' } },
  { path: '', component: AppComponent, data: { title: 'Home' } },
  { path: '**', component: NotFoundComponent, data: { title: 'Not Found' } }
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
