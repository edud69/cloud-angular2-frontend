import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouteGuard } from './route-guard';
import { SharedModule } from './shared/shared.module';


@NgModule({
  imports: [BrowserAnimationsModule, BrowserModule, HttpModule, AppRoutingModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
  {
    provide: RouteGuard,
    useClass: RouteGuard
  }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
