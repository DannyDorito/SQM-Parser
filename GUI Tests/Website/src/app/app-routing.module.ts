import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Home' } },
  { path: '**', component: NotfoundComponent, data: { title: 'Not Found' } }
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: environment.tracing,
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
