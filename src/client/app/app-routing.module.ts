import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { injectErrorHandlingRoutes } from './route-guard';


/* define app module routes here, e.g., to lazily load a module
  (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
*/
const routes : Route[] = injectErrorHandlingRoutes([
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadChildren: './app/home/home.module#HomeModule' },
  { path: 'about', loadChildren: './app/about/about.module#AboutModule' },
  { path: 'profile', loadChildren: './app/profile/profile.module#ProfileModule' },
  { path: '',  loadChildren: './app/authentication/authentication.module#AuthenticationModule' }
]);




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

