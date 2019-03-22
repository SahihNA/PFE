import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule,routingcomponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapService } from './shared/map.service';
import { HttpClientModule } from "@angular/common/http";
import { MapComponent } from './map/map.component';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [
    AppComponent,
     MapComponent,
    routingcomponents,
   
      
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
