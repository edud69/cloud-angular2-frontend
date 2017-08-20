import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouteManager } from './route-manager';
import { SharedModule } from './shared/shared.module';


@NgModule({
  imports: [BrowserAnimationsModule, BrowserModule, HttpModule, AppRoutingModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
  {
    provide: RouteManager,
    useClass: RouteManager
  }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
