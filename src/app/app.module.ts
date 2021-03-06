import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, 
  MatSortModule, MatTableModule, MatDialogModule } from "@angular/material";
import { AppRoutingModule,routingcomponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapService } from './shared/map.service';
import { HttpClientModule } from "@angular/common/http";
import { MapComponent, RapportMatDialogue,histogrammefrequence } from './map/map.component';

import { ChartModule } from 'angular-highcharts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DesscritisationPdfComponent } from './desscritisation-pdf/desscritisation-pdf.component';

@NgModule({
  declarations: [
histogrammefrequence,
   RapportMatDialogue,
    AppComponent,
     MapComponent,
    routingcomponents,
    DesscritisationPdfComponent,
   
      
  ],
  entryComponents: [RapportMatDialogue,histogrammefrequence],
  imports: [
    PdfViewerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartModule,
    MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        AngularFontAwesomeModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
